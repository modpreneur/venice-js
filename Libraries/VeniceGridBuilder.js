'use strict';

import _ from 'lodash';
import {Dispatcher} from 'flux';
import React from 'react';
import ReactDOM from 'react-dom';
import DataStore from './Grid/TableDataStore';
import GridContainer from './Grid/components/GridContainer.jsx';

const EXAMPLE_COLUMN = {
    name:'string', // REQUIRED
    // OPTIONAL
    label:'string', // default name
    allowOrder: 'boolean',
    hidden:'boolean',
    
    // STYLES
    className: 'string',
    headerClassName: 'string',
    
    // FILTER
    allowFilter: 'bool',
    type: ['string', 'integer', 'double', 'number', 'date', 'datetime', 'time'] // one of
};

const defaultOptions = {
    components: {
        search: true,
        pagination: true,
        queryBuilder: true,
        loadMoreButton: false
    },
    paginateComponent: {
        marginPagesDisplayed: 2,
        pageRangeDisplayed: 3,
        containerClassName:'pagination',
        subContainerClassName:'pages pagination',
        activeClassName:'active',
        nextLinkClassName:'pull-right bold',
        previousLinkClassName:'bold',
        breakLabel: React.createElement('i', {className: 'tiecons tiecons-dots-negative'}),
        previousLabel: React.createElement('i', {className: 'trinity trinity-arrow-down-two'}),
        nextLabel: React.createElement('i', {className: 'trinity trinity-arrow-down-two'})
    },
    tableComponent: {
        orderByClassName: 'order-by',
        ascClassName: 'order-by-asc',
        descClassName: 'order-by-desc',
        header: {
            rowClassName: '',
            columnClassName: ''
        },
        rowClassName: '',
        columnClassName: ''
    },
    filter: '',
    query: {
        page: 0,
        limit: 15,
        filter: undefined,
        search: null
    },
    max: 1,
    editable: false,
    pageFilter: true

};


//todo: move to trinity?
const VeniceGridBuilder = {
    build(container, query, customOptions={}){
        if(!container) {
            throw new Error('Container cannot be ' + container);
        }

        let config = JSON.parse(container.getAttribute('data-config'));

        let options = _.defaultsDeep(
            // From server options
            {
                query: query ? {
                    limit: +query.limit || config['limit'] || 15,
                    page: +query.page || undefined,
                    orderBy: query.orderby,
                    filter: query.filter ? window.atob(query.filter) : undefined,
                    search: query.search ? window.atob(query.search) : undefined
                } : {
                    limit:  config['limit'] || 15,
                    page: 1
                },
                max: config['max'],
                filter: config['filter'],
                editable: config['editable']
            },
            customOptions,
            defaultOptions
        );

        // Logs in elastic does not have ID and _ID is random - no need to order by it
        if(!options.query.orderBy && config.url.indexOf('/grid/elastic/') > -1){
            options.query.orderBy = 'createdAt:DESC'
        }

        let DataGrid = {
            options,
            columns : config['columns'],
            store : null,
            dispatcher: new Dispatcher()
        };
        DataGrid.store = new DataStore(
            DataGrid.dispatcher,
            config['url'],
            config['columns'],
            {
                ...options.query,
                max: options.max,
                maxPages: options.maxPages,
                forceFilter: options.filter
            }
        );

        ReactDOM.render(React.createElement(GridContainer, {...DataGrid}), container);

        return DataGrid;
    }
};

export default VeniceGridBuilder;