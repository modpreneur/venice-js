'use strict';

import _ from 'lodash';
import React from 'react';


/**
 * Table Header component
 */
const Header = ({
    orderBy,
    columns,
    isEmpty,
    isEditMode,

    /** ORDER-BY styles **/
    orderByClassName,
    ascClassName,
    descClassName,

    /** Callbacks **/
    orderByCallback,
    onSelect,

    /** Children **/
    children
}) => {
    let column = orderBy && orderBy.column,
        order = orderBy && (orderBy.order || 'ASC')
    ;

    // Header Columns
    let headerColumns = _.map(columns, (col, i)=>{
        let className = col.headerClassName;

        // If no data to show -> dont show any order-by sign
        let useOrderBy = col.allowOrder && !isEmpty;
        
        if(useOrderBy){
            className += ' ' + orderByClassName;
            if(column && col.name === column ){
                className += ' ' + (order === 'ASC' ? ascClassName : descClassName);
            }
        }
        let attributes = {
            key: i,
            style: col.hidden ? {'display':'none'} : undefined,
            onClick: useOrderBy && orderByCallback.bind(null, col),
            className
        };

        return <th {...attributes}>{col.label}</th>;
    });

    return (
        <thead>
            <tr>
                {isEditMode ? (
                    <td>
                        <div className="text-center" >
                            {/*TODO: multiple tables - needs unique id*/}
                            <input onClick={onSelect} id='select-all' className="edit-input display-none" type="checkbox" />
                            <label htmlFor='select-all' ><span></span></label>
                        </div>
                    </td> ) : false
                }
                {headerColumns}
                {children}
            </tr>
        </thead>
    );
};

/**
 * Default Properties
 */
Header.defaultProps = {
    isEmpty: false,
    isEditMode: false,
    orderByCLassName: 'tjs-order-by',
    ascClassName: 'tjs-asc',
    descClassName: 'tjs-desc'
};

/**
 * Property types
 */
if(DEVELOPMENT){
    Header.propTypes = {
        isEmpty: React.PropTypes.bool,
        isEditMode: React.PropTypes.bool,
        orderBy: React.PropTypes.object,
        columns: React.PropTypes.array,
        orderByCallback: React.PropTypes.func,

        /** ClassNames **/
        orderByCLassName: React.PropTypes.string,
        ascClassName: React.PropTypes.string,
        descClassName: React.PropTypes.string
    };
}

export default Header;