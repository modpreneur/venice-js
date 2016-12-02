'use strict';

import React from 'react';

const InitialFetchingView = () => {
    return (
        <div className="info-empty-form">
            <div className="row">
                <i className="tiecons tiecons-loading-rotate tiecons-rotate font-50"/>
            </div>
            <div className="row">
                <h2 className="warning">
                    Loading data...
                </h2>
            </div>
        </div>
    );
};

export default InitialFetchingView;