'use strict';

import _ from 'lodash';
import React from 'react';

const DetailRow = ({
    columns,
    data,
    isEditMode,
    attributes,
    /** callbacks **/
    onSelect,
    /** children **/
    children
}) => {
    let dataColumns = _.map(columns, (col, i) => {
        let colProps = {
            key: i,
            style: col.hidden ? {'display':'none'} : {},
            className: col.className,
            dangerouslySetInnerHTML: { __html: data[col.name] }
        };
        return <td {...colProps} />;
    });
    return (
        <tr {...attributes}>
            {isEditMode ? (
                <td>
                    <div onClick={(e) => e.stopPropagation()} className="text-center" >
                        <input onClick={onSelect}  id={data['_id']} className="edit-input display-none" type="checkbox" />
                        <label htmlFor={data['_id']} ><span></span></label>
                    </div>
                </td>) : false
            }
            {dataColumns}
            {children}
        </tr>
    );
};

export default DetailRow;

