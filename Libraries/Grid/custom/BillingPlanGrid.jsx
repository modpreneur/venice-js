'use strict';

import _ from 'lodash';
import React from 'react';
import DefaultGrid from '../DefaultGrid.jsx';




export default class BillingPlanGrid extends DefaultGrid {
    renderRows(){
        dump
        this.useDetail = false;
        return _.map(this.state.data, (el, i) => {
            let id = el._id;
            return (
                <DetailRow
                    key={'' + i + id}
                    data={el}
                    columns={this.columns}
                    isEditMode={this.state.isEditMode}
                />
            );
        });
    }
}