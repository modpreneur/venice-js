'use strict';

import _ from 'lodash';
import React from 'react';
import DefaultGrid from '../Libraries/Grid/DefaultGrid.jsx';

export default class BillingPlanGrid extends DefaultGrid {
    constructor(props){
        super(props);
    }
    renderRows(){
        this.useDetail = false;

        return _.map(this.state.data, (el, i) => {
            let dataColumns = _.map(this.columns, (col, i)=>{
                let colProps = {
                    key: i,
                    style: col.hidden ? {'display':'none'} : {},
                    className: col.className,
                    dangerouslySetInnerHTML: { __html: el[col.name] }
                };
                if(col.name === 'veniceDefault'){
                    return <td {...colProps} />; //TODO
                }
                return <td {...colProps} />;
            });
            return (
            <tr  key={'' + i + el._id}>
                {dataColumns}
            </tr>
            );
        });
    }
}