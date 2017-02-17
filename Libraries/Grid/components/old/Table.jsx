'use strict';

import _ from 'lodash';
import React from 'react';
import UnsafeRow from './UnsafeRow.jsx';
import Header from './Header.jsx';

const NUM_REGEX = /\d+/;

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.__store = props.dataStore;
        this.Dispatcher = props.dispatcher;

        //Set initial template
        this.state = {
            data: [],
            orderBy: props.initialOrderBy,
            editing: null,
            loaderIconOffset: 0,
            isFetching: false
        };
    }

    /**
     * React native method - called after mounting to DOM
     * @override
     */
    componentDidMount() {
        let data = this.__store.getData();
        if (data.length > 0) {
            this.setState(_.assign(this.state, {
                data,
                orderBy: this.__store.getOrderBy()
            }));
        }
        // Attach main listener
        this.__store.addListener(this.onStateChange.bind(this));
    }

    /**
     * Listener to every change in dataStore
     */
    onStateChange() {
        if (this.__store.isLoading) {
            // recompute size of loader
            let tableHeight = Number(window.getComputedStyle(this.refs['table']).height.match(NUM_REGEX)[0]);
            // If store loading data, just change order-by and show loader
            this.setState(_.assign(this.state, {
                isFetching: true,
                loaderIconOffset: Math.floor(tableHeight / 2) - 20
            }));
        } else {
            this.setState(_.assign(this.state, {
                isFetching: false,
                data: this.__store.getData(),
                orderBy: this.__store.getOrderBy()
            }));
        }
    }

    /**
     * Handles "order by" user action
     *  - dispatch change to dataStore
     * @param property {object}
     */
    handleOrderBy(property) {
        this.Dispatcher.dispatch({
            action: 'order-by',
            orderBy: property.name
        });
    }

    /**
     * Renders Component into DOM
     * @returns {XML} - HTML
     */
    render() {
        let rows = _.map(this.state.data, (el, i) => {
            return (<UnsafeRow key={i}
                               columns={this.props.template}
                               data={el}/>);
        });

        return (
            <div className="box-table-body" style={{position: 'relative'}}>
                <div ref="loader"
                     className="text-center"
                     style={{
                         width: '100%',
                         height: '100%',
                         position: 'absolute',
                         backgroundColor: 'rgba(204, 204, 204, 0.25)',
                         display: this.state.isFetching ? '' : 'none'
                     }}>
                    <i className="tiecons tiecons-loading tiecons-rotate font-40"
                       style={{top: this.state.loaderIconOffset + 'px'}}/>
                </div>
                <table ref="table" className="grid" style={{width: '100%'}}>
                    <Header
                        columns={this.props.template}
                        orderBy={this.state.orderBy}
                        orderByCallback={this.handleOrderBy.bind(this)}
                        ascClassName={this.props.ascClassName}
                        descClassName={this.props.descClassName}
                        {...this.props.header}
                    />
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}