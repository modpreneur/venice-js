'use strict';

import React from 'react';

/**
 * Grid search form
 */
export default class GridSearch extends React.Component {
    constructor(props){
        super(props);
        this.__timerID = null;
        this.__initialSearch = props.initialSearch;
    }

    handleChange(){
        if(this.__timerID){
            clearTimeout(this.__timerID);
        }
        let val = this.refs['search'].value;
        if(val.length === 0){
            this.props.dispatcher.dispatch({
                action: 'search',
                search: this.refs['search'].value
            });
        } else {
            this.__timerID = setTimeout(()=>{
                // Clear
                clearTimeout(this.__timerID);
                this.__timerID = null;

                this.props.dispatcher.dispatch({
                    action: 'search',
                    search: this.refs['search'].value
                });
            }, this.props.timeout || 500);
        }
    }

    render(){
        let className = 'display-inline-block ' + this.props.className;
        return (
            <form className={className}>
                <input ref="search"
                       type="text"
                       placeholder="Search in table..."
                       onChange={this.handleChange.bind(this)}
                       defaultValue={this.__initialSearch}
                />
                <button type="submit" onClick={(e)=>{
                    e.preventDefault();
                    this.handleChange();
                    return false;
                }}>
                    <i className="trinity trinity-search" />
                </button>
            </form>
        );
    }
}

/**
 * Property types
 */
if(DEVELOPMENT){
    GridSearch.propTypes = {
        className: React.PropTypes.string
    };
}