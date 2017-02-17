'use strict';

import React from 'react';
import SearchForm from '../../../Components/SearchForm.jsx';

/**
 * Grid search form
 */
export default class GridSearchContainer extends React.Component {
    constructor(props){
        super(props);
        this.__timerID = null;
    }

    handleChange(e, val){
        if(this.__timerID){
            clearTimeout(this.__timerID);
        }
        if(val.length === 0){
            this.props.onSearch(val);
        } else {
            this.__timerID = setTimeout(() => {
                // Clear
                clearTimeout(this.__timerID);
                this.__timerID = null;
                this.props.onSearch(val);
            }, this.props.timeout || 500);
        }
    }

    handleSubmit(e, val){
        e.preventDefault();
        clearTimeout(this.__timerID);
        this.__timerID = null;
        this.props.onSearch(val);
    }

    render(){
        return (
            <SearchForm
                attributes={{
                    className: this.props.className
                }}
                defaultValue={this.props.search || ''}
                placeholder="Search in table..."
                onChange={this.handleChange.bind(this)}
                onSubmit={this.handleSubmit.bind(this)}
            />
        );
    }
}

/**
 * Property types
 */
if(DEVELOPMENT){
    GridSearchContainer.propTypes = {
        className: React.PropTypes.string,
        initialSearch: React.PropTypes.string
    };
}