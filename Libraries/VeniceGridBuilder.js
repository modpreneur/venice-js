'use strict';

import _ from 'lodash';
import {Dispatcher} from 'flux';
import React from 'react';
import ReactDOM from 'react-dom';
import DataStore from './Grid/TableDataStore';
import CommonGrid from './Grid/CommonGrid.jsx';


const defaultOptionsNew = {
    components: {
        search: true,
        pagination: true,
        queryBuilder: true,
        loadMoreButton: false
    },
    paginateComponent: {
        marginPagesDisplayed: 2,
        pageRangeDisplayed: 3,
        containerClassName: 'pagination',
        subContainerClassName: 'pages pagination',
        activeClassName: 'active',
        nextLinkClassName: 'pull-right bold',
        previousLinkClassName: 'bold',
        breakLabel: React.createElement('i', {className: 'tiecons tiecons-dots-negative'}),
        previousLabel: React.createElement('i', {className: 'trinity trinity-arrow-down-two'}),
        nextLabel: React.createElement('i', {className: 'trinity trinity-arrow-down-two'})
    },
    tableComponent: {
        orderByClassName: 'order-by',
        ascClassName: 'order-by-asc',
        descClassName: 'order-by-desc'
    },
    forceFilter: undefined,
    filter: undefined,
    search: undefined,
    page: 0,
    limit: 15,
    max: 1
};


const VeniceGridBuilder = {
    build(container, query, customOptions = {}){
        //imports do not work, i suppose, that is because imports are "executed" before app
        // is loaded, so window.jQuery does not exist at that time

        // return this.buildCustom(container, query, GridContainer, customOptions);
        return this.buildCustom(container, query, CommonGrid, customOptions);
    },

    buildCustom(container, query, grid, customOptions = {}){
        if (!container) {
            throw new Error('Container cannot be ' + container);
        }
        let options = JSON.parse(container.getAttribute('data-config'));
        let gridConfiguration = _.defaultsDeep(
            {},
            // Url request settings
            query && {
                limit: +query.limit,
                page: +query.page,
                filter: query.filter && window.atob(query.filter),
                search: query.search && window.atob(query.search),
                orderBy: query.orderby
            },
            // Server settings
            {
                page: 1,
                max: options.max,
                limit: options.limit,
                orderBy: options.defaultOrder,
                forceFilter: options.forceFilter || options.filter,
                components: options.components
            },
            customOptions,
            defaultOptionsNew
        );

        console.log('Grid configuration', gridConfiguration);

        let dispatcher = new Dispatcher(),
            store = new DataStore(
                dispatcher,
                options.url,
                // '/app_dev.php/admin/user/new',
                options.columns,
                {
                    limit: gridConfiguration.limit,
                    orderBy: gridConfiguration.orderBy,
                    page: gridConfiguration.page,
                    filter: gridConfiguration.filter,
                    search: gridConfiguration.search,
                    max: gridConfiguration.max,
                    forceFilter: gridConfiguration.forceFilter,
                    allowSearch: gridConfiguration.components.search,
                    allowFilter: gridConfiguration.components.filter
                }
            );


        ReactDOM.render(React.createElement(grid, {
            store,
            dispatcher,
            ...gridConfiguration,
            columns: options.columns
        }), container);

        return gridConfiguration;
    }
};

export default VeniceGridBuilder;