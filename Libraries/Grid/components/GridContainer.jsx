'use strict';

import _ from 'lodash';
import React from 'react';
import PaginateComponent from 'react-paginate';
import TableLoader from './deprecated/TableLoader.jsx';
import NoDataRow from './deprecated/NoDataRow.jsx';
import ErrorRow from './deprecated/ErrorRow.jsx';
import UnsafeRow from './UnsafeRow.jsx';
import Header from './deprecated/Header.jsx';
import GridSearch from './search/GridSearchContainer.jsx';
import GridQueryBuilder from './search/GridQueryBuilder.jsx';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {prepareFilterColumns} from '../utils.jsx';

const NUM_REGEX = /\d+/;

export default class GridContainer extends React.Component {
    constructor(props) {
        super(props);
        this.__dispatcher = props.dispatcher;
        this.__store = props.store;
        this.__filters = prepareFilterColumns(props.columns);
        let components = props.components;

        // Is query Builder
        this.__showQueryBuilder = components.queryBuilder && !_.isEmpty(this.__filters);
        this.__showSearchPart = this.__showQueryBuilder || components.search;

        let limit = props.limit && props.limit > 0 ? props.limit : 15,
            maxPages = Math.ceil(props.max / limit),
            page = (props.page && props.page > 0) ? props.page - 1 : 0;

        if (page >= maxPages) {
            page = (maxPages - 1);
        }

        this.state = {
            page,
            maxPages,
            data: [],
            orderBy: this.__store.getOrderBy(),
            isFetching: false,
            isError: false,
            loaderOffset: 0,
            showQueryBuilder: this.__showQueryBuilder && !!props.filter
        };
    }

    componentDidMount() {
        let data = this.__store.getData();
        if (data.length > 0) {
            this.setState({
                data,
                orderBy: this.__store.getOrderBy()
            });
        } else if (this.__store.isFetching) {
            this.setState({
                isFetching: true
            });
        }
        // Attach main listener
        this.__store.addListener(this.onStateChange.bind(this));
    }

    onStateChange() {
        if (this.__store.isFetching) {
            // recompute size of loader
            let tableHeight = Number(window.getComputedStyle(this.refs['table']).height.match(NUM_REGEX)[0]);
            // If store loading data, just change order-by and show loader
            this.setState({
                isFetching: true,
                loaderOffset: Math.floor(tableHeight / 2) - 20
            });
        } else {
            this.setState({
                isFetching: false,
                isError: this.__store.isError,
                data: this.__store.getData(),
                orderBy: this.__store.getOrderBy(),
                ...this.__store.getPaginationInfo()
            });
        }
    }

    handleOrderBy(property) {
        console.log('PROP', property);
        this.__dispatcher.dispatch({
            action: 'order-by',
            column: property.name
        });
    }


    handlePageClick(e) {
        this.__dispatcher.dispatch({
            action: 'set-page',
            page: e.selected
        });
    }

    switchSearchMode() {
        if (this.state.showQueryBuilder) {
            this.__dispatcher.dispatch({
                action: 'clear-filter'
            });
        }
        this.setState({
            showQueryBuilder: !this.state.showQueryBuilder
        });
    }

    repeatRequest() {
        this.__dispatcher.dispatch({
            action: 'repeat-request'
        });
    }

    buildSearchComponent(isQueryBuilder) {
        return isQueryBuilder ?
            (
                <GridQueryBuilder
                    key="query-builder"
                    className={'margin-top-10'}
                    rules={this.__filters}
                    filter={this.props.filter}
                    onSearch={(filter) => this.__store.dispatch({ action: 'filter', filter })}
                    onClose={this.props.components.search && this.switchSearchMode.bind(this)}
                />
            ) : (
            <div key="grid-search">
                <GridSearch
                    className={'margin-top-10'}
                    columns={this.props.columns}
                    search={this.props.search || ''}
                    onSearch={(search) => this.__store.dispatch({ action: 'search', search })}
                />
                { this.__showQueryBuilder && // if both, show switcher
                <a className={'row pointer'}
                   onClick={this.switchSearchMode.bind(this)}>
                    <div className="button-small">Advanced search</div>
                </a>
                }
            </div>
        );
    }

    render() {
        let props = this.props,
            show = props.components,
            isEmpty = _.isEmpty(this.state.data) && this.state.maxPages === 0;

        let paginateOptions = props.paginateComponent,
            tableOptions = props.tableComponent,
            activeSearchComponent = null;

        if (this.__showSearchPart) {
            if (show.search && this.__showQueryBuilder) {
                activeSearchComponent = this.buildSearchComponent(this.state.showQueryBuilder);
            } else if (show.search) {
                activeSearchComponent = this.buildSearchComponent(false);
            } else {
                activeSearchComponent = this.buildSearchComponent(true);
            }
        }

        return (
            <div className="wrapper-grid">
                { (show.search || this.__showQueryBuilder) ? (
                    <CSSTransitionGroup
                        className="text-center padding-20"
                        component="div"
                        transitionName="example"
                        transitionEnterTimeout={500}
                        transitionLeave={false}
                    >
                        {activeSearchComponent}
                    </CSSTransitionGroup>) : false
                }
                <TableLoader
                    display={this.state.isFetching}
                    iconOffset={this.state.loaderOffset}
                    text="fetching"
                    iconClassName="tiecons tiecons-loading-rotate tiecons-rotate font-40"
                >
                    <table ref="table" className="grid" style={{width: '100%'}}>
                        <Header
                            columns={props.columns}
                            isEmpty={isEmpty}
                            orderBy={this.state.orderBy}
                            orderByCallback={this.handleOrderBy.bind(this)}
                            orderByClassName={tableOptions.orderByClassName}
                            ascClassName={tableOptions.ascClassName}
                            descClassName={tableOptions.descClassName}
                            {...tableOptions.header}
                        />
                        <CSSTransitionGroup
                            component='tbody'
                            transitionName="example"
                            transitionEnterTimeout={200}
                            transitionLeave={false}
                        >
                            { this.state.isError ?
                                <ErrorRow
                                    colSpan={props.columns.length}
                                    btnCallback={this.repeatRequest.bind(this)}
                                />
                                : isEmpty ?
                                <NoDataRow colSpan={props.columns.length}/>
                                : _.map(this.state.data, (el, i) =>
                                <UnsafeRow key={'' + i + el._id} columns={props.columns} data={el}/>
                            )
                            }
                        </CSSTransitionGroup>
                    </table>
                </TableLoader>
                { show.pagination && this.state.maxPages > 1 ?
                    <div className="pagination-wrapper">
                        <PaginateComponent
                            clickCallback={this.handlePageClick.bind(this)}
                            initialSelected={this.state.page}
                            forceSelected={this.state.page}
                            pageNum={this.state.maxPages}
                            {...paginateOptions}
                        /></div> : false
                }
            </div>
        );
    }
}