'use strict';

import _ from 'lodash';
import React from 'react';
import {prepareFilterColumns} from './utils.jsx';
import GridWrapper from './components/GridWrapper.jsx';
import BaseGrid from './components/BaseGridContainer.jsx';
import ErrorView from './ErrorView.jsx';
import EmptyView from './EmptyView.jsx';
import FetchingView from './FetchingView.jsx';

import {
    SET_PAGE,
    FILTER,
    ORDER_BY,
    CLEAR_FILTER,
    SEARCH,
    REPEAT_REQUEST
} from './GridActions';



export default class DefaultGrid extends BaseGrid {
    constructor(props){
        super(props);
        this.didMountCallbacks = [];
        this.useDetail = true;
        // Filtered columns
        this.columns = _.filter(props.columns, col => !col.hidden && col.select !== false);
        // Filter rules
        this.filterRules = prepareFilterColumns(props.columns);
        props.components.queryBuilder = props.components.queryBuilder && !_.isEmpty(this.filterRules);
    }

    /**
     * Switch search mode
     */
    switchSearchMode(){
        if(this.state.showQueryBuilder){
            this.dispatch({ action: CLEAR_FILTER });
        }
        this.setState({ showQueryBuilder: !this.state.showQueryBuilder });
    }

    /**
     * Handles search event - dispatch search action to store
     * @param search {string}
     */
    handleSearch(search){
        this.dispatch({ action: SEARCH, search });
    }

    /**
     * Handles filter event - dispatch Filter action to store
     * @param filter {string}
     */
    handleQuerySearch(filter){
        this.dispatch({ action: FILTER, filter });
    }

    /**
     * Handles orderBy action
     * @param property {object}
     */
    handleOrderBy(property){
        this.dispatch({ action: ORDER_BY, column: property.name });
    }

    /**
     * Handle page select
     * @param page {number}
     */
    handlePageSelect(page){
        this.dispatch({ action: SET_PAGE, page: page.selected });
    }

    /**
     * Handle row select
     * @param id
     * @param e
     */
    handleRowSelect(id, e){
        //TODO:
        // e.stopPropagation();
        if(DEVELOPMENT){
            e.persist();
            console.log(e);
            console.log('SELECT EVENT');
            console.log('ID', id);
        }
    }

    handleRowClick(productId, event){
        //TODO:
        if(DEVELOPMENT) {
            console.log('EVENT', event);
            console.log('SHOW PRODUCT DETAIL WITH ID:', productId);
        }

        if(event.isDefaultPrevented){
            return;
        }
        if(event.ctrlKey || event.metaKey || event.button === 1) {
            console.log('NOW IT SHOULD REDIRECT');
        } else {
            this.setState({ showDetailId: this.state.showDetailId === productId ? null : productId });
        }
    }

    repeatRequest(){
        this.dispatch({ action: REPEAT_REQUEST });
    }


    handleDetailClose(){
        this.setState({ showDetailId: null });
    }

    /**
     * Template method
     * @returns {Array}
     */
    renderRows(){
        return [];
    }

    /** Render **/
    render(){
        let props = this.props,
            show = props.components,
            paginateOptions = props.paginateComponent,
            tableOptions = props.tableComponent,
            showSearch = show.search || show.queryBuilder,
            activeSearchComponent = 'QUERY_BUILDER',
            gridSearchProps,
            errorComponent,
            emptyComponent,
            columns = this.columns
            ;

        if(showSearch){
            if(show.search && show.queryBuilder){
                // if Both, loot at state
                activeSearchComponent = this.state.showQueryBuilder ? 'QUERY_BUILDER' : 'QUERY_SEARCH';
            } else {
                // only one
                activeSearchComponent = show.search ? 'QUERY_SEARCH' : 'QUERY_BUILDER';
            }

            gridSearchProps = {
                transition: {
                    className: 'text-center padding-20'
                },
                initialFilter: props.filter,
                initialSearch: props.search,
                filterRules: this.filterRules,
                queryBuilder: show.queryBuilder,
                querySearch: show.search,
                activeComponent: activeSearchComponent || 'QUERY_BUILDER',
                onClose: this.switchSearchMode.bind(this),
                onSearch: (search) => this.handleSearch(search),
                onQuerySearch:  (filter) => this.handleQuerySearch(filter)
            };
        }



        if(this.state.isError){
            errorComponent = <ErrorView reloadCallback={this.repeatRequest.bind(this)}/>;
        }
        emptyComponent = this.state.isFetching ? <FetchingView/> : <EmptyView/>;

        // Get it before, because of useDetail override
        let rows = this.renderRows();

        return (
            <GridWrapper
                detail={this.useDetail}
                columns={columns}
                orderBy={this.state.orderBy}
                isEditMode={this.state.isEditMode}
                isFetching={this.state.isFetching}
                tableOptions={tableOptions}

                /** Pagination **/
                pagination={show.pagination}
                paginateOptions={paginateOptions}
                {...this.state.pagination}

                /** Search **/
                showSearch={showSearch}
                searchProperties={gridSearchProps}

                /** content **/
                emptyData={emptyComponent}
                error={errorComponent}

                /** Callbacks **/
                onSelectAll={(e) => this.handleRowSelect('all', e)}
                onOrderBy={(prop) => this.handleOrderBy(prop)}
                onPageSelect={(page) => this.handlePageSelect(page)}
            >
                {rows}
            </GridWrapper>
        );
    }
}