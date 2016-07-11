'use strict';

/**
 * http://querybuilder.js.org/
 */

import _ from 'lodash';
import $ from 'jquery';
import '../../../lib/query-builder';
// import '../../../lib/query-builder.css';
import React from 'react';
import Events from 'trinity/utils/Events';

const NUMBER_MAP = {
    'equal': '= ${value}',
    'not_equal': '!= ${value}',
    'less': '< ${value}',
    'less_or_equal': '<= ${value}',
    'greater': '> ${value}',
    'greater_or_equal': '>= ${value}'
};

const EXPRESSION_RX = /^([^\s(<>=!]+)\s*((?:[<>!]?=|[<>])|LIKE)\s*(\"[^\.")]+\"|[^\s)]+)/;
const AND_CONDITION_RX = /\s+AND\s+/;
const OR_CONDITION_RX = /\s+OR\s+/;
const IS_WRAPPED_RX = /^\(.*\)$/;
const REMOVE_QUOTES_RX = /[^"']+/;
const REMOVE_LIKE_SIGN_RX = /[^%]+/;


const VALUE_MAP = {
    'integer':NUMBER_MAP,
    'double':NUMBER_MAP,
    'string' : {
        'equal': '= \"${value}\"',
        'not_equal': '!= \"${value}\"',
        'contains': 'LIKE \"%${value}%\"',
        'begins_with': 'LIKE \"${value}%\"',
        'ends_with': 'LIKE \"%${value}\"'
    },
    'date': NUMBER_MAP
};


const QB_OPERATOR_MAP = {
    '=':'equal',
    '!=':'not_equal',
    '<':'less',
    '<=':'less_or_equal',
    '>':'greater',
    '>=':'greater_or_equal'
};

function createFilter(filterObj){
    return _.map(filterObj.rules, (rule)=>{
        if(rule.condition){
            return '(' + createFilter(rule) + ')';
        }
        let val = VALUE_MAP[rule.type][rule.operator].replace('${value}', rule.value);
        return [rule.id, val].join(' ');
    }).join(' ' + filterObj.condition + ' ');
}

function parseFilter(filterStr){
    let counter = 0,
        deepRules = [],
        startIndex = null,
        rules = null,
        rulesObj = {
            condition: '',
            rules: null
        };

    let parsed = _.map(filterStr,(c, i)=>{
        if(c === '('){
            counter++;
            if(_.isNull(startIndex)){
                startIndex = i;
                return c;
            }
        } else if(c === ')'){
            counter--;
            if(counter === 0){
                deepRules.push(parseFilter(filterStr.substring(startIndex+1, i)));
                startIndex = null;
                return c;
            }
        }
        return counter > 0 ? '*' : c;
    }).join('');

    if(AND_CONDITION_RX.test(parsed) || !OR_CONDITION_RX.test(parsed)){
        rules = parsed.split(AND_CONDITION_RX);
        rulesObj.condition = 'AND';
    } else {
        rules = parsed.split(OR_CONDITION_RX);
        rulesObj.condition = 'OR';
    }

    counter = 0;
    rulesObj.rules = _.map(rules, (cond)=>{
        if(IS_WRAPPED_RX.test(cond)){
            return deepRules[counter++];
        } else {
            let exp = cond.match(EXPRESSION_RX);
            let id = exp[1],
                operator = exp[2],
                value = exp[3].match(REMOVE_QUOTES_RX)[0];

            if(operator === 'LIKE'){
                let index = value.indexOf('%');
                if(index === -1){
                    operator = 'contains'
                } else {
                    operator = 'begins_with';
                    if(index === 0){
                        operator = 'ends_with';
                        if(value[value.length-1] === '%'){
                            operator = 'contains'
                        }
                    }
                }
                value = value.match(REMOVE_LIKE_SIGN_RX)[0];
            } else {
                operator = QB_OPERATOR_MAP[operator];
            }

            return { id, operator, value }
        }
    });
    return rulesObj;
}

export default class GridQueryBuilder extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        // if(_.isEmpty(this.__filters))
        let builder = this.refs['builder'],
            filter = this.props.filter ? parseFilter(this.props.filter):undefined;

        builder.innerHTML = '';
        $(builder).queryBuilder({
            filters: this.props.filters,
            rules: filter
        });

        this.builder = builder;
        this.unlistenSearch =
            Events.listen(this.refs['search'], 'click', ()=>{
                let rules = $(builder).queryBuilder('getRules');
                if(rules){
                    let filter = createFilter(rules);
                    this.props.dispatcher.dispatch({
                        action: 'filter',
                        filter
                    });
                }
            });
    }

    componentWillUnmount(){
        this.unlistenSearch();
        $(this.builder).queryBuilder('destroy');
    }

    render(){
        return (
            <div className={this.props.className} style={this.props.style}>
                <div ref="builder" style={{textAlign: 'initial'}} >
                    loading...
                </div>
                <button ref="search">Search</button>
            </div>
        );
    }
}