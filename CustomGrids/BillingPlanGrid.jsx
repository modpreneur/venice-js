'use strict';

import _ from 'lodash';
import $ from 'jquery';
import React from 'react';
import DefaultGrid from '../Libraries/Grid/DefaultGrid.jsx';
import {messageService} from 'trinity/Services';
import Gateway from 'trinity/Gateway';

const iconSetting = {
        "set": {"iClass": "trinity trinity-pin"},
        "is": {"iClass": "trinity trinity-yes"},
        "unset": {"iClass": "trinity trinity-close"},
        "loading": {"iClass": "tiecons tiecons-loading tiecons-rotate"}
    },
    isState = 'is',
    unsetState = 'unset',
    setState = 'set',
    loadState = 'loading',
    stateAttr = 'data-state';

export default class BillingPlanGrid extends DefaultGrid {
    constructor(props) {
        super(props);
        this.defOnVenice = [];
    }

    changeOtherIconts(icon){
        console.log('called on', icon);
        _.each(this.defOnVenice, ci => {
            if(ci !== icon){
                $(ci).attr(stateAttr, setState);
                ci.className = iconSetting[$(ci).attr(stateAttr)].iClass;
            }
        });
    }

    renderRows() {
        this.useDetail = false;

        return _.map(this.state.data, (el, i) => {
            let dataColumns = _.map(this.columns, (col, i) => {
                let colProps = {
                    key: i,
                    style: col.hidden ? {'display': 'none'} : {},
                    className: col.className
                };
                if (col.name === 'veniceDefault') {  // todo someday make class from all of this
                    let elem = $(el[col.name]), divState = elem.attr(stateAttr) ,url = elem.attr('data-href'), icon,
                        onClick = () => {
                            if ($(icon).attr(stateAttr) === setState) {
                                $(icon).attr(stateAttr, loadState);
                                icon.className = iconSetting[$(icon).attr(stateAttr)].iClass;
                                Gateway.post(url, null, () => {
                                    $(icon).attr(stateAttr, isState);
                                    icon.className = iconSetting[$(icon).attr(stateAttr)].iClass;
                                    this.changeOtherIconts(icon);
                                }, err => {
                                    console.log(err);
                                });
                            } else if ($(icon).attr(stateAttr) === unsetState) {
                                $(icon).attr(stateAttr, loadState);
                                icon.className = iconSetting[$(icon).attr(stateAttr)].iClass;
                                Gateway.post(url, {unset: true}, () => {
                                    $(icon).attr(stateAttr, setState);
                                    icon.className = iconSetting[$(icon).attr(stateAttr)].iClass;
                                }, err => {
                                    console.log(err);
                                });
                            }
                        },
                        toggle = (enter) => {
                            if ($(icon).attr(stateAttr) === isState || $(icon).attr(stateAttr) === unsetState) {
                                if(enter){
                                    $(icon).attr(stateAttr, unsetState);
                                    icon.className = iconSetting[$(icon).attr(stateAttr)].iClass;
                                } else {
                                    $(icon).attr(stateAttr, isState);
                                    icon.className = iconSetting[$(icon).attr(stateAttr)].iClass;
                                }
                            }
                        };
                    return (
                        <td {...colProps} >
                            <div>
                                <i
                                    onClick={onClick}
                                    onMouseEnter={toggle.bind(this,true)}
                                    onMouseLeave={toggle.bind(this,false)}
                                    ref={input => {
                                        icon = input;
                                        $(icon).attr(stateAttr,divState);
                                        this.defOnVenice.push(icon);
                                    }}
                                    style={{cursor: 'pointer'}}
                                    className={iconSetting[elem.attr(stateAttr)].iClass}
                                />
                            </div>
                        </td>
                    );
                }
                colProps.dangerouslySetInnerHTML = {__html: el[col.name]};
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