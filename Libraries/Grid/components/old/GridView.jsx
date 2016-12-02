/**
 * Created by fisa on 1/18/16.
 */
'use strict';

import React from 'react';
import TableComponent from './Table.jsx';
import GridSearch from './GridSearchContainer.jsx';
import PaginateComponent from 'react-paginate';


export default class GridView extends React.Component {
    constructor(props) {
        super(props);
        this.__dataStore = props.store;
        this.__dataTemplate = props.columns;
        this.Dispatcher = props.dispatcher;

        let limit = props.options.query.limit < 1 ? 15 : props.options.query.limit;
        // Set Initial State
        let maxPages = props.options.maxPages || Math.ceil(props.options.max / limit),
            page = props.options.query.page;
        page = props.options.pageFilter && page > 0 ? page - 1 : 0;

        // validate
        if (page >= maxPages) {
            page = (maxPages - 1);
        }
        props.options.query.page = page;

        this.state = {
            page,
            maxPages
        };

        //TODO: Load More button
        this.loadMoreButton = props.options.loadMoreButton ? (
            <div className="text-center">
                <button onLoad={this.handleLoadMore}>Load More</button>
            </div>
        ) : false;
    }

    componentDidMount() {
        // Attach main listener
        this.__store.addListener(this.onStateChange.bind(this));
    }

    onStateChange() {
        // let pages = this.__dataStore.getPaginationInfo();
    }

    handlePageClick(e) {
        this.Dispatcher.dispatch({
            action: 'set-page',
            page: e.selected
        });
    }

    handleLoadMore() {
        console.warn('Method not implemented!');
    }

    render() {
        let paginateOptions = this.props.options.paginateComponent,
            tableOptions = this.props.options.tableComponent;

        return (
            <div className="wrapper-grid">
                <GridSearch columns={this.__dataTemplate} dispatcher={this.Dispatcher}/>
                <TableComponent
                    dispatcher={this.Dispatcher}
                    template={this.__dataTemplate}
                    dataStore={this.__dataStore}
                    initialOrderBy={this.props.options.query.orderBy}
                    {...tableOptions}
                />
                {/* TODO: Load more button */}
                {this.loadMoreButton}

                <PaginateComponent
                    clickCallback={this.handlePageClick.bind(this)}
                    initialSelected={0}
                    forceSelected={this.state.page}
                    pageNum={this.state.maxPages}
                    previousLabel={<i className="trinity trinity-arrow-down-two"/>}
                    nextLabel={<i className="trinity trinity-arrow-down-two"/>}
                    {...paginateOptions}
                />
            </div>
        );
    }
}

/**
 * Property types
 */
//GridView.propTypes = {

//};