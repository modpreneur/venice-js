'use strict';

import React from 'react';

const TableLoader = (props)=>{
    return (
        <div className="box-table-body" style={{ position: 'relative' }}>
            <div className="text-center"
                 style={{
                        width: '100%',
                        height: '100%',
                        zIndex: '10',
                        position: 'absolute',
                        backgroundColor: 'rgba(204, 204, 204, 0.5)',
                        display: props.display ? '' : 'none'
                     }}>
                <i className={props.iconClassName} 
                   style={props.iconStyle} />
            </div>
            {props.children}
        </div>
    );
};

export default TableLoader;

if(DEVELOPMENT){
    TableLoader.propTypes = {
        iconClassName: React.PropTypes.string,
        iconStyle: React.PropTypes.object,
        display: React.PropTypes.bool
    };
}