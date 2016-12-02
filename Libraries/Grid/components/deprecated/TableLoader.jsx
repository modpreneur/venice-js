'use strict';

import React from 'react';

const TableLoader = (props)=> {
    return (
        <div className="box-table-body" style={{
            position: 'relative',
            minHeight: '200px'
        }}>
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
                   style={{top: (props.iconOffset > 100 ? props.iconOffset : 100) + 'px'}}
                />
            </div>
            {props.children}
        </div>
    );
};

export default TableLoader;

if (DEVELOPMENT) {
    TableLoader.propTypes = {
        iconClassName: React.PropTypes.string,
        iconOffset: React.PropTypes.number,
        display: React.PropTypes.bool,
        text: React.PropTypes.string
    };
}