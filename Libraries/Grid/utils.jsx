'use strict';

import _ from 'lodash';
import React from 'react';
import DetailRowContainer from './components/DetailRowContainer.jsx';


/**
 * Add Detail row wrapper to detail and return single 1D array of rows
 * @param rows {array<array<React.Component>>} array of row - detail pairs
 * @param colSpan {number} number of columns
 */
export function glueRowAndDetail(rows, colSpan){
    return _(rows).map(r => {
        let row = r[0],
            detail = r[1],
            detailKey = (row.key || row.props.data._id) + '_detail';

        return [
            row,
            <DetailRowContainer
                id={detailKey}
                key={detailKey}
                colSpan={colSpan}
                onClose={detail.props.onClose}
            >
                { detail.props.isActive ? detail : null }
            </DetailRowContainer>
        ];
    }).flatten().value();
}

// Grid Builder constants
const SPECIAL_TYPES = ['enum', 'array'],
    SPECIAL_TYPES_OPERATORS = {
        'enum': ['equal', 'not_equal'],
        'array': ['is']
    };

/**
 * Creates set of rules for GridQueryBuilder
 * @param columns {object}
 * @returns {*}
 */
export function prepareFilterColumns(columns) {
    return _(columns)
        .filter(col => !!(col.name === 'id' || col.allowFilter || col.type))
        .map((col)=> {
            col.id = col.name;
            if (col.id === 'id') {
                col.type = 'integer';
            } else {
                col.type = col.type || 'string';
                // Exception
                if (~SPECIAL_TYPES.indexOf(col.type)) {
                    col.operators = SPECIAL_TYPES_OPERATORS[col.type];
                }
            }
            return col;
        }).value();
}