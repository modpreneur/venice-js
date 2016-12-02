'use strict';

import React from 'react';


const ErrorView = ({ reloadCallback }) => {
    return (
        <div className="info-empty-form">
            <div className="row">
                <i className="trinity-warning" style={{
                    fontSize: '140px'
                }}/>
            </div>
            <div className="row">
                <h2 className="warning">ERROR</h2>
                <p className="padding-top-10">Something went wrong. Please try again later</p>
            </div>
            <button className="button button-info" onClick={reloadCallback}>
                <i className="padding-right-5 tiecons tiecons-loading"/>
                Refresh
            </button>
        </div>
    );
};

export default  ErrorView;