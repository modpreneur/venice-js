/**
 * Created by fisa on 11/27/15.
 */
'use strict';

import _ from 'lodash';
import Gateway from 'trinity/Gateway';
import QueryBuilder from './TrinityQueryBuilder';
import Store from 'flux/lib/FluxStore';
import History from '../GlobalHistory';
import {
    SET_PAGE,
    FILTER,
    ORDER_BY,
    CLEAR_FILTER,
    SEARCH,
    REPEAT_REQUEST
} from './GridActions';

let messageService = null;
let fakeTimeout = false;


if(DEVELOPMENT){
    messageService = require('trinity/Services.js').messageService;
}


// Initial options
const defaultOptions = {
    limit : 15,
    page : 1,
    max : 1,
    orderBy: 'id:ASC',
    allowFilter: true,
    allowSearch: true,
    filter: null,
    search: null,
    forceFilter: null
};


const ORDER_BY_SPIT_RX = /:(?=ASC$|DESC$)/,
    FILTER_STORAGE = 'filter',
    NORMAL_STORAGE = 'normal',
    SEARCH_STORAGE = 'search'
    ;

/**
 * Store data component for grid tables
 */
export default class TableDataStore extends Store {
    constructor(dispatcher, url, columns, options){
        super(dispatcher);

        this.options = __processOptions(options);
        this.url = url;
        this.columns = columns;
        this.select = _(columns)
            .filter(col => col.select !== false)
            .map(col => col.name)
            .value();

        this.select.push('_id');
        this.isFetching = false;
        this.isError = false;
        this.__repeatLastRequest = false;

        // Data storage
        this.__data = {
            normal: {
                cache: new Array(this.options.maxPages),
                page: this.options.page,
                maxPages: this.options.maxPages,
                max: this.options.max
            },
            filter: {
                cache: [],
                page: 0,
                maxPages: 1,
                max: 0
            },
            search: {
                cache: [],
                page: 0,
                maxPages: 1,
                max: 0
            }
        };

        if(!this.options.allowFilter){
            this.options.filter = null;
        }
        if(!this.options.allowSearch){
            this.options.search = null;
        }

        this.activeStorage = NORMAL_STORAGE;
        if(!_.isEmpty(this.options.search)){
            this.activeStorage = SEARCH_STORAGE;
        }
        else if(!_.isEmpty(this.options.filter)){
            this.activeStorage = FILTER_STORAGE;
        }
        // current view
        this.dataView = [];

        // History
        let firstRequest = true;
        this.__historyListener = History.listen((loc)=>{
            if(firstRequest){
                firstRequest = false;
                return;
            }
            if(loc.action === 'POP' && loc.state){
                if(loc.state.orderBy !== this.options.orderBy || loc.state.filter !== this.options.filter){
                    this.cleanCache();
                }
                this.options = _.clone(loc.state);
                this.updateDataView();
            }
        });
        // Initial request
        this.__initialPageSet();
    }

    /**
     * Dispatch action
     * @param action {object}
     */
    dispatch(action){
        this.__dispatcher.dispatch(action);
    }

    /**
     * Returns actual state of table
     * @returns {object}
     */
    getState(){
        return _.cloneDeep({
            data: this.dataView,
            orderBy: this.options.orderBy,
            pagination: this.getPaginationInfo(),
            isFetching: this.isFetching,
            isError: this.isError,
        });
    }

    /**
     * Returns actual inner view state of active data
     * @returns {Array|*}
     */
    getData(){
        return this.dataView;
    }

    /**
     * Returns actual ORDER BY setup
     * @returns {string|*|string}
     */
    getOrderBy(){
        return this.options.orderBy;
    }

    /**
     * Returns actual pagination info
     * @returns {{maxPages: number, page: (number|*|string|string)}}
     */
    getPaginationInfo(){
        let storage = this.__data[this.activeStorage];
        return {
            maxPages: storage.maxPages,
            page: storage.page
        };
    }

    /**
     * Clear cached Data
     */
    cleanCache(){
        this.__data[FILTER_STORAGE].cache = [];
        this.__data[SEARCH_STORAGE].cache = [];
        this.__data[NORMAL_STORAGE].cache = new Array(this.__data[NORMAL_STORAGE].maxPages);
    }

    /**
     * Main method handling dispatched actions
     * @param payload {Object}
     * @private
     */
    __onDispatch(payload){
        switch(payload.action){

            // Pagination
            case SET_PAGE :{
                this.__setPage(payload.page);
            } break;

            // Order by change
            case ORDER_BY :{
                this.__orderBy(payload.column);
            } break;
            // Search
            case SEARCH:{
                this.__search(payload.search);
            } break;
            // Filter
            case FILTER :{
                this.__filter(payload.filter);
            } break;
            // Clear Filter
            case CLEAR_FILTER :{
                this.__clearFilter(payload.filter);
            } break;
            // Request again
            case REPEAT_REQUEST :{
                this.__repeatRequest();
            } break;
            default: break;
        }
    }

    /**
     * Shortcut for emit state change
     * @private
     */
    __stateChange(){
        this.__emitter.emit(this.__changeEvent);
    }

    /**
     * Apply search filter
     * @param queryString {string}
     * @private
     */
    __search(queryString){
        if(queryString === this.options.search){
            return;
        }

        if(_.isEmpty(queryString)){
            this.activeStorage = NORMAL_STORAGE;
            this.options.search = null;
            this.isFetching = false;
            if(this.__lastRequest){
                this.__lastRequest.abort();
            }
        } else {
            this.options.search = queryString;
            this.activeStorage = SEARCH_STORAGE;
        }

        this.__data[SEARCH_STORAGE].page = 0;
        this.__data[SEARCH_STORAGE].cache = [];
        this.__pushHistory();
        this.updateDataView();
    }

    /**
     * Apply filter
     * @param queryString {string}
     * @private
     */
    __filter(queryString){
        if(queryString !== this.options.filter){
            this.options.filter = queryString;
            this.activeStorage = FILTER_STORAGE;
            this.__data[FILTER_STORAGE].page = 0;
            this.__data[FILTER_STORAGE].cache = [];
            this.__pushHistory();
            this.updateDataView();
        }
    }

    /**
     * Clears Filter
     * @private
     */
    __clearFilter(){
        if(!_.isEmpty(this.options.filter)){
            this.options.filter = null;
            this.activeStorage = _.isNull(this.options.search) ? NORMAL_STORAGE : SEARCH_STORAGE;
            this.__data[FILTER_STORAGE].page = 0;
            this.__data[FILTER_STORAGE].cache = [];
            this.__pushHistory();
            this.updateDataView();
        }
    }

    /**
     * Handles SET PAGE request
     * @param page {number}
     * @private
     */
    __setPage(page){
        let storage = this.__data[this.activeStorage];
        if(!this.isFetching || storage !== page) {
            storage.page = page;
            this.__pushHistory();
            this.updateDataView();
        }
    }

    /**
     * Handles orderBy action request
     * @param column {string}
     * @private
     */
    __orderBy(column){

        let previousColumn = this.options.orderBy.column,
            order = this.options.orderBy.order;

        // Set new order
        this.options.orderBy.column = column;
        // look at previous column, if its same as actual -> change order, if not -> order ASC
        this.options.orderBy.order = previousColumn === column && order === 'ASC' ? 'DESC' : 'ASC';

        this.cleanCache();
        this.__pushHistory();
        this.updateDataView();
    }

    __repeatRequest(){
        this.__repeatLastRequest = true;
        this.updateDataView();
    }

    /**
     * Update data view
     */
    updateDataView(){
        // Clear error cache
        this.isError = false;

        let storage = this.__data[this.activeStorage],
            page = storage.page;

        // Do we have Data?
        if(storage.cache[page] && storage.cache[page].length > 0){
            this.dataView = storage.cache[page];
            this.__stateChange();
            return;
        }

        // We have to download Data
        this.isFetching = true;
        this.__stateChange();

        // REQUEST
        let currentQuery = this.requestData((response)=>{
            let queryTest = currentQuery === this.__lastQuery,
                dataTest = !storage.cache[page] || _.isEmpty(storage.cache[page]);

            // Check if some other request was triggered
            if(queryTest && dataTest){
                this.isFetching = false;
                storage.cache.max = response.body.count.total;
                storage.cache.maxPages = Math.ceil(storage.cache.max / this.options.limit);
                this.dataView = storage.cache[page] = response.body.result;
                this.__stateChange();
            }
        }, (error)=>{
            // ERROR
            if(DEVELOPMENT){
                console.error(error);
                console.log('RESPONSE', error.response);
                if(messageService && error.response){
                    messageService(
                        error.response.statusCode + '<br>'
                        + error.response.statusText, 'error');
                }
            }

            // Check if some other request was triggered
            if(currentQuery === this.__lastQuery){
                this.isFetching = false;
                this.isError = true;
                this.__stateChange();
            }
        }, this.__repeatLastRequest);
    }

    /**
     * Request for all queries
     * @param successCallback
     * @param errorCallback
     * @param repeatLast {boolean}
     */
    requestData(successCallback, errorCallback, repeatLast){
        // If there is last then abort it
        this.__lastRequest && this.__lastRequest.abort();

        if(repeatLast){
            if(DEVELOPMENT && fakeTimeout){
                fakeTimeout = false;
                this.__lastRequest.timeout(30000);
            }
            this.__repeatLastRequest = false;
            this.__lastRequest.finish();
            return this.__lastQuery;
        }

        let storage = this.__data[this.activeStorage];
        let queryRequest = this.activeStorage === SEARCH_STORAGE && this.options.allowSearch ?
            QueryBuilder.createSearch(
                this.url, // Url
                this.select,
                this.options.search,
                {
                    offset: (storage.page) * this.options.limit,
                    limit: this.options.limit,
                    orderBy: this.options.orderBy
                }
                // TODO: Extra query params
            )
            : QueryBuilder.create(
                this.url, // Url
                this.select, // Select
                this.options.forceFilter, // filter
                // Query
                {
                    offset: (storage.page) * this.options.limit,
                    limit: this.options.limit,
                    orderBy: this.options.orderBy,
                    filter: this.options.allowFilter ? this.options.filter : null
                }
            );


        if(DEVELOPMENT){
            console.log('REQUEST', queryRequest);
        }

        let request = Gateway.sendJSON(
            encodeURI(queryRequest),
            'GET',
            null,
            successCallback,
            errorCallback,
            true // override
        );

        request.timeout(30000);
        if(DEVELOPMENT && fakeTimeout){
            request.timeout(1);
        }
        request.finish();
        this.__lastRequest = request;

        return this.__lastQuery = queryRequest;
    }

    /**
     * Initial request
     * @private
     */
    __initialPageSet(){
        this.updateDataView();
        History.replace(this.__createHistoryUrl());
    }

    /**
     * Add new state to history
     * @private
     */
    __pushHistory(){
        History.push(this.__createHistoryUrl());
    }
    
    __createHistoryUrl(){
        let storage = this.__data[this.activeStorage];
        let queryUrl = [];
        queryUrl.push('page=' + (storage.page + 1));
        queryUrl.push('limit=' + this.options.limit);
        queryUrl.push(`orderby=${this.options.orderBy.column}:${this.options.orderBy.order}`);
        if(this.options.search){
            queryUrl.push(`search=${window.btoa(this.options.search)}`);
        } else if(this.options.filter){
            queryUrl.push(`filter=${window.btoa(this.options.filter)}`);
        }
        return {
            pathname:window.location.pathname,
            search:'?' + window.encodeURI(queryUrl.join('&')) + window.location.hash,
            state:_.clone(this.options)
        };
    }
}


/**
 * Correct options
 * @param options
 * @returns {*}
 * @private
 */
function __processOptions(options){
    options = _.defaultsDeep(options || {}, defaultOptions);

    if(_.isString(options.orderBy)){
        let orderBy = options.orderBy.split(ORDER_BY_SPIT_RX);
        // if not name
        options.orderBy = orderBy[0] ? {
            column: orderBy[0],
            order: orderBy[1]
        } : {   // Default options
            column: 'id',
            order: 'ASC'
        };
    }

    options.limit = options.limit && options.limit > 0 ? options.limit : 15;
    options.maxPages = Math.ceil(options.max / options.limit);
    options.page = (options.page && options.page > 0) ? options.page - 1 : 0;

    if( options.page >= options.maxPages ){
        options.page = (options.maxPages - 1);
    }
    return options;
}