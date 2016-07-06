'use strict';

import _ from 'lodash';
import React from 'react';

const ORDER_BY_SPIT_RX = /:(?=ASC$|DESC$)/;

/**
 * Table Header component
 */
const Header = (props)=>{
    let column = null,
        order = null;
    if(props.orderBy){
        [column, order] = props.orderBy.split(ORDER_BY_SPIT_RX);
    }

    // Header Columns
    let headerColumns = _.map(props.columns, (col, i)=>{
        let className = [col.headerClassName || false, props.columnClassName || false],
            useOrderBy = col.allowOrder && !props.isEmpty;
        
        if(useOrderBy){
            className.push(props.orderByClassName || false);
            if(column && col.name === column ){
                className.push((!order || order === 'ASC') ?
                    props.ascClassName : props.descClassName);
            }

        }
        let attributes = {
            key: i,
            style: col.hidden ? {'display':'none'}: {},
            onClick: useOrderBy ? props.orderByCallback.bind(null, col) : false,
            className: _.filter(className, c => !!c).join(' ')
        };

        return <th {...attributes}>{col.label}</th>;
    });

    return (
        <thead className={props.className}>
            <tr className={props.rowClassName}>{headerColumns}{props.children}</tr>
        </thead>
    );
};

/**
 * Property types
 */
if(DEVELOPMENT){
    Header.propTypes = {
        orderBy: React.PropTypes.string,
        columns: React.PropTypes.array,
        orderByCallback: React.PropTypes.func,
        /** ClassNames **/
        className: React.PropTypes.string,
        rowClassName: React.PropTypes.string,
        columnCLassName: React.PropTypes.string,
        orderByCLassName: React.PropTypes.string,
        ascClassName: React.PropTypes.string,
        descClassName: React.PropTypes.string
    };
}

export default Header;