/**
 * Created by Bures on 23/4/16.
 */
'use strict';

import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import _ from 'lodash';

const dateFormMap = {
    'd': 'YYYY-MM-DD',
    't': 'hh-mm-ss',
    'dt': 'YYYY-MM-DD hh:mm:ss'
};

export default class NecktieDateAndTime extends React.Component {


    constructor(props) {
        super(props);

        momentLocalizer(moment);
        this.state = {value: this.props.value}; // Initial state
        if (this.props.func) {
            this.props.func(this);
        }
        this.props.oldElem.style.display = 'none';
    }

    render() {
        return (
            <DateTimePicker
                value={this.state.value || null}
                format={getLongFormat(this.props.format)}
                className={this.props.className}
                id={this.props.id}
                name={this.props.name}
                min={this.props.minDate || new Date(1900, 0, 1)} // new Date(1900, 0, 1) is react-widgets default
                max={this.props.maxDate || new Date(2099, 11, 31)} // new Date(2099, 11, 31) is react-widgets default
                required={this.props.required}
                time={(this.props.type.indexOf('t') > -1)}
                calendar={(this.props.type.indexOf('d')> -1)}
                onChange={
                    (value) => {
                        this.setState({value : value});
                        this.props.oldElem.value = moment(value).format(dateFormMap[this.props.type]);
                    }
                }
            />
        );
    }
}
NecktieDateAndTime.defaultProps = {
    type: 'dt',
    format: 'Y-M-D H:m',
    required: 'required',
    value: null
};

const changeTo = {
    Y:'YYYY',
    y:'YY',
    i:'mm',
    h:'hh',
    D:'ddd',
    d:'DD',
    M:'MMM',
    m:'MM',
    H:'HH',
    s:'ss'
};

/**
 * Get moment format from user format
 * @param format {string}
 * @return {string}
 */
function getLongFormat(format) {
    let longFormat = '';
    _.each(Array.from(format),(char)=>{
        longFormat += (changeTo[char])?char.replace(char,changeTo[char]):char;
    });
    return longFormat;

    // return format
    //     .replace(/Y/, 'YYYY')
    //     .replace(/i/, 'mm')
    //     .replace(/h/, 'hh')
    //     .replace(/D/, 'ddd')
    //     .replace(/d/, 'DD')
    //     .replace(/M/, 'MMM')
    //     .replace(/m/, 'MM')
    //     .replace(/H/, 'HH')
    //     .replace(/s/, 'ss');
}
