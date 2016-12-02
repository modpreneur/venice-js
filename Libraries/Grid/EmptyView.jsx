'use strict';

import React from 'react';

const ErrorView = (/*{ message }*/) => {
    return (
        <div className="info-empty-form">
            <div className="row"><i className="trinity-info"/></div>
            <div className="row"><h2 className="warning">NO DATA</h2></div>
            {
                // <div className="row span-none-xlarge-10">
                //     <p>This log does not contain any data yet.</p>
                // </div>
            }
        </div>
    );
};

export default  ErrorView;