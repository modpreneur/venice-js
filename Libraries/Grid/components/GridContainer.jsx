'use strict';

import _ from 'lodash';
import React from 'react';
import PaginateComponent from 'react-paginate';
import TableLoader from './TableLoader.jsx';
import NoDataRow from './NoDataRow.jsx';
import UnsafeRow from './UnsafeRow.jsx';
import Header from './Header.jsx';
import GridSearch from './GridSearch.jsx';
import GridQueryBuilder from './GridQueryBuilder.jsx';

const NUM_REGEX = /\d+/;

// Grid Builder
const STRING_OPERATORS = ['equal', 'not_equal', 'contains', 'begins_with', 'ends_with'];
const NUMBER_OPERATORS = ['equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal'];
const OPERATOR_MAP = {
    'integer':NUMBER_OPERATORS,
    'double':NUMBER_OPERATORS,
    'string':STRING_OPERATORS,
    'date':NUMBER_OPERATORS
};


export default class GridContainer extends React.Component {
    constructor(props){
        super(props);
        this.__dispatcher = props.dispatcher;
        this.__store = props.store;
        this.__filters = this.prepareFilterColumns(props.columns);

        let query = props.options.query,
            limit = query.limit && query.limit > 0 ? query.limit : 15,
            maxPages = Math.ceil(props.options.max / limit),
            page = (query.page && query.page > 0) ? query.page - 1 : 0;

        if( page >= maxPages ){
            page = (maxPages-1);
        }
        this.state = {
            page,
            maxPages,
            data:[],
            orderBy: query.orderBy,
            isFetching: false,
            loaderOffset: 0,
            showQueryBuilder: !!query.filter
        };
    }

    componentDidMount(){
        let data = this.__store.getData();
        if(data.length > 0){
            this.setState({
                data,
                orderBy: this.__store.getOrderBy()
            });
        }
        // Attach main listener
        this.__store.addListener(this.onStateChange.bind(this));
    }

    onStateChange(){
        if(this.__store.isFetching){
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
                data: this.__store.getData(),
                orderBy: this.__store.getOrderBy(),
                ...this.__store.getPaginationInfo()
            });
        }
    }

    handleOrderBy(property){
        this.__dispatcher.dispatch({
            action: 'order-by',
            orderBy: property.name
        });
    }


    handlePageClick(e){
        this.__dispatcher.dispatch({
            action:'set-page',
            page: e.selected
        });
    }

    switchSearchMode(){
        if(this.state.showQueryBuilder){
            this.__dispatcher.dispatch({
                action: 'clear-filter'
            });
        }
        this.setState({
            showQueryBuilder: !this.state.showQueryBuilder
        });
    }

    prepareFilterColumns(){
        return _(this.props.columns)
            .filter(col => !!(col.name === 'id' || col.allowFilter || col.type))
            .map((col)=>{
                col.id = col.name;
                if(col.id === 'id'){
                    col.type = 'integer';
                    col.operators = NUMBER_OPERATORS;
                } else {
                    col.type = col.type || 'string';
                    col.operators = OPERATOR_MAP[col.type];
                }
                return col;
            }).value();
    }

    render(){
        let props = this.props,
            show = props.options.components,
            isEmpty = _.isEmpty(this.state.data) && this.state.maxPages === 0;

        let paginateOptions = props.options.paginateComponent,
            tableOptions = props.options.tableComponent,
            // Query builder
            QueryBuilder = false,
            searchClassName = '';

        if(show.queryBuilder && !_.isEmpty(this.__filters)){
            let builderClassName = 'display-none';
            if(this.state.showQueryBuilder){
                searchClassName = 'display-none';
                builderClassName = '';
            }
            QueryBuilder = (
                <div>
                    <div className="row pointer">
                        <a onClick={this.switchSearchMode.bind(this)}>
                            Advanced search
                        </a>
                        <i className={"trinity trinity-close padding-left-10 " + builderClassName}
                           onClick={this.switchSearchMode.bind(this)} />
                    </div>
                    <GridQueryBuilder
                        className={builderClassName}
                        filters={this.__filters}
                        dispatcher={this.__dispatcher}
                        filter={props.options.query.filter}
                    />
                </div>
            );
        }

        return (
            <div className="wrapper-grid">
                { show.search ?
                    <div className="grid-search row text-center">
                        <GridSearch
                            className={searchClassName}
                            columns={props.columns}
                            dispatcher={this.__dispatcher}
                            initialSearch={props.options.query.search}
                        />
                        {QueryBuilder}
                    </div> : false
                }
                <TableLoader
                    display={this.state.isFetching}
                    iconStyle={{top: this.state.loaderOffset + 'px'}}
                    iconClassName="tiecons tiecons-loading tiecons-rotate font-40"
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
                        <tbody>
                        { isEmpty ?
                            <NoDataRow colSpan={props.columns.length} />
                                : _.map(this.state.data, (el, i)=>
                            <UnsafeRow key={i} columns={props.columns} data={el} />)
                        }
                        </tbody>
                    </table>
                </TableLoader>
                { show.pagination && this.state.maxPages > 1 ?
                    <PaginateComponent
                        clickCallback={this.handlePageClick.bind(this)}
                        initialSelected={this.state.page}
                        forceSelected={this.state.page}
                        pageNum={this.state.maxPages}
                        {...paginateOptions}
                    /> : false
                }
            </div>
        );
    }
}

/**
 * Property types
 */
if(DEVELOPMENT){
    GridContainer.propTypes = {
        dispatcher: React.PropTypes.object,
        store: React.PropTypes.object,
        columns: React.PropTypes.array,
        initialOrderBy: React.PropTypes.string
    };
}