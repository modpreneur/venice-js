/**
 * Created by fisa on 11/27/15.
 */
'use strict';

import _ from 'lodash';
import Gateway from 'trinity/Gateway';
// TODO: make it settable - hopefully one day
import QueryBuilder from './TrinityQueryBuilder';
import Store from 'flux/lib/FluxStore';
import History from './GlobalHistory';
// import Services from 'trinity/services';

let messageService = null;
if(DEVELOPMENT){
    // console.log(Services);
    // messageService = Services.messageService;
    messageService = require('trinity/Services.js').messageService;
}


const actions = {
    SET_PAGE : 'set-page',
    FILTER : 'filter',
    ORDER_BY: 'order-by',
    CLEAR_FILTER: 'clear-filter',
    SEARCH: 'search'
};

const defaultOptions = {
    limit : 15,
    page : 1,
    max : 1,
    orderBy: 'id:ASC',
    filter: null,
    search: null,
    forceFilter: null
};


const ORDER_BY_SPIT_RX = /:(?=ASC$|DESC$)/;
const FILTER_STORAGE = 'filter';
const NORMAL_STORAGE = 'normal';
const SEARCH_STORAGE = 'search';

/**
 * Store data component for grid tables
 */
export default class TableDataStore extends Store {
    constructor(dispatcher, url, columns, options){
        super(dispatcher);

        this.options = __processOptions(options);
        this.url = url;
        this.columns = columns;
        this.select = _.map(columns, col => col.name);
        this.select.push('_id');
        this.isFetching = false;
        // Data storage
        this.__data = {
            normal: new Array(this.options.maxPages),
            filter: [],
            search: []
        };
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
        return {
            maxPages: this.options.maxPages,
            page: this.options.page
        }
    }

    /**
     * Clear cached Data
     */
    cleanCache(){
        this.__data[FILTER_STORAGE] = [];
        this.__data[SEARCH_STORAGE] = [];
        this.__data[NORMAL_STORAGE] = new Array(this.options.maxPages);
    }

    /**
     * Main method handling dispatched actions
     * @param payload {Object}
     * @private
     */
    __onDispatch(payload){
        switch(payload.action){

            // Pagination
            case actions.SET_PAGE :{
                this.__setPage(payload.page);
            } break;

            // Order by change
            case actions.ORDER_BY :{
                this.__orderBy(payload.orderBy);
            } break;
            // Search
            case actions.SEARCH:{
                this.__search(payload.search);
            } break;
            // Filter
            case actions.FILTER :{
                this.__filter(payload.filter);
            } break;

            // Filter
            case actions.CLEAR_FILTER :{
                this.__clearFilter(payload.filter);
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
        } else {
            this.options.search = queryString;
            this.activeStorage = SEARCH_STORAGE;
        }

        this.options.page = 0;
        this.__data[SEARCH_STORAGE] = [];
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
            this.options.page = 0;
            this.__data[FILTER_STORAGE] = [];
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
            this.options.page = 0;
            this.__data[FILTER_STORAGE] = [];
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
        if(!this.isFetching || this.options.page !== page) {
            this.options.page = page;
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
        let [preColumn, order] = this.options.orderBy.split(ORDER_BY_SPIT_RX);
        this.options.orderBy = column + ((column === preColumn && order === 'ASC') ? ':DESC' : ':ASC');
        this.cleanCache();
        this.__pushHistory();
        this.updateDataView();
    }

    /**
     * Update data view
     */
    updateDataView(){
        let data = this.__data[this.activeStorage],
            page = this.options.page;

        // Do we have Data?
        if(data[page] && data[page].length > 0){
            this.dataView = data[page];
            this.__stateChange();
            return;
        }

        // We have to download Data
        this.isFetching = true;
        this.__stateChange();

        // Save previous orderBy query
        let requestOrderBy = this.options.orderBy,
            requestFilter = this.options.filter,
            requestSearch = this.options.search;

        // REQUEST
        this.requestData((response)=>{
            let orderByTest = this.options.orderBy === requestOrderBy,
                filterTest = requestFilter === this.options.filter,
                searchTest = requestSearch === this.options.search,
                dataTest = !data[page] || _.isEmpty(data[page]);

            // Check if some other request was triggered
            if(orderByTest && dataTest && filterTest && searchTest){
                this.isFetching = false;
                this.options.max = response.body.count.total;
                this.options.maxPages = Math.ceil(this.options.max / this.options.limit);
                this.dataView = data[page] = response.body.result;
                this.__stateChange();
            }
        }, (error)=>{
            // ERROR
            if(DEVELOPMENT){
                console.error(error);
                console.log(error.response);
                if(messageService){
                    messageService(
                        error.response.statusCode + "<br>"
                        + error.response.statusText, 'error');
                }

            }
            this.isFetching = false;
            this.__stateChange();
        });
    }

    /**
     * Request for all queries
     * @param successCallback
     * @param errorCallback
     */
    requestData(successCallback, errorCallback){
        let queryRequest = this.activeStorage === SEARCH_STORAGE ? 
            QueryBuilder.createSearch(
                this.url, // Url
                this.select,
                this.options.search,
                {
                    offset: (this.options.page) * this.options.limit,
                    limit: this.options.limit,
                    orderBy: this.options.orderBy
                }
            )
            : QueryBuilder.create(
                this.url, // Url
                this.select, // Select
                this.options.forceFilter, // filter
                // Query
                {
                    offset: (this.options.page) * this.options.limit,
                    limit: this.options.limit,
                    orderBy: this.options.orderBy,
                    filter: this.options.filter
                }
            );
        Gateway.getJSON(encodeURI(queryRequest), null, successCallback, errorCallback);
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
        let queryUrl = [];
        queryUrl.push('page='+(this.options.page+1));
        queryUrl.push('limit='+this.options.limit);
        queryUrl.push('orderby='+this.options.orderBy);
        if(this.options.search){
            queryUrl.push(`search=${window.btoa(this.options.search)}`);
        } else if(this.options.filter){
            queryUrl.push(`filter=${window.btoa(this.options.filter)}`);
        }
        return {
            pathname:window.location.pathname,
            search:'?'+ window.encodeURI(queryUrl.join('&')) + window.location.hash,
            state:_.clone(this.options)
        };
    }
}


TableDataStore.actions = actions;

/**
 * Correct options
 * @param options
 * @returns {*}
 * @private
 */
function __processOptions(options){
    options = _.defaultsDeep(options || {}, defaultOptions);

    let [name, order] = options.orderBy.split(ORDER_BY_SPIT_RX);
    if(!name){
        options.orderBy = defaultOptions.orderBy;
    }

    options.limit = options.limit && options.limit > 0 ? options.limit : 15;
    options.maxPages = Math.ceil(options.max / options.limit);
    options.page = (options.page && options.page > 0) ? options.page - 1 : 0;

    if( options.page >= options.maxPages ){
        options.page = (options.maxPages-1);
    }
    return options;
}