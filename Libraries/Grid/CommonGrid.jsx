'use strict';

import _ from 'lodash';
import React from 'react';
import DefaultGrid from './DefaultGrid.jsx';


export default class CommonGrid extends DefaultGrid {
    renderRows(){
        this.useDetail = false;
        return _.map(this.state.data, (el, i) => {
            let dataColumns = _.map(this.columns, (col, i) => {
                let colProps = {
                    key: i,
                    style: col.hidden ? {'display':'none'} : {},
                    className: col.className,
                    dangerouslySetInnerHTML: { __html: el[col.name] }
                };

                return <td {...colProps} />;
            });
            return (
            <tr key={'' + i + el._id}>
                {dataColumns}
            </tr>
            );
        });
    }
}