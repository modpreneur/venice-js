'use strict';

import React from 'react';
import CustomRowContainer from '../CustomRowContainer.jsx';

const ErrorRow = (props) => {
    return (
        <CustomRowContainer colSpan={props.colSpan}>
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
                <button className="button button-info" onClick={props.btnCallback}>
                    <i className="padding-right-5 tiecons tiecons-loading"/>
                    Refresh
                </button>
            </div>
        </CustomRowContainer>
    );
};

export default ErrorRow;

if (DEVELOPMENT) {
    ErrorRow.propTypes = {
        colSpan: React.PropTypes.number,
        btnCallback: React.PropTypes.func
    };
}