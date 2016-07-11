'use strict';

import _ from 'lodash';
import React from 'react';

/**
 * Simple Row
 */
const UnsafeRow = (props)=>{
        let data = _.map(props.columns, (col, i)=>{
            let colProps = {
                key: i,
                style: col.hidden ? {'display':'none'}:{},
                className: col.className,
                dangerouslySetInnerHTML: { __html: props.data[col.name] }
            };
            return <td {...colProps} />;
        });
        return (
            <tr>
                {data}
                {props.children}
            </tr>
        );
};

/**
 * Property types
 */
UnsafeRow.propTypes = {
    template: React.PropTypes.array,
    data: React.PropTypes.object
};

export default UnsafeRow;