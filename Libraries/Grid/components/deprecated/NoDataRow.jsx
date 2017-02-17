/**
 * Created by fisa on 6/28/16.
 */
'use strict';

import React from 'react';

const NoDataRow = (props) => {
    return (
        <tr>
            <td colSpan={props.colSpan} className="row">
                <div className="info-empty-form">
                    <div className="row"><i className="trinity-info"/></div>
                    <div className="row"><h2 className="warning">NO DATA</h2></div>
                    {
                        // <div className="row span-none-xlarge-10">
                        //     <p>This log does not contain any data yet.</p>
                        // </div>
                    }
                </div>
            </td>
        </tr>
    );
};

/**
 * Property types
 */
if(DEVELOPMENT){
    NoDataRow.propTypes = {
        colSpan: React.PropTypes.number
    };
}

export default NoDataRow;