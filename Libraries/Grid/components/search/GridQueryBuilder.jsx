'use strict';

/**
 * http://querybuilder.js.org/
 */

import _ from 'lodash';
import $ from 'jquery';
import '../../../Extensions/ExtendedQueryBuilder';
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
const REMOVE_QUOTES_RX = /[^'"].+[^'"]/;
const REMOVE_LIKE_SIGN_RX = /[^%"']+/;


const VALUE_MAP = {
    'integer': NUMBER_MAP,
    'double': NUMBER_MAP,
    'string': {
        'equal': '= \"${value}\"',
        'not_equal': '!= \"${value}\"',
        'contains': 'LIKE \"%${value}%\"',
        'begins_with': 'LIKE \"${value}%\"',
        'ends_with': 'LIKE \"%${value}\"'
    },
    'date': NUMBER_MAP,
    'boolean': {
        'equal': '= \"${value}\"'
    },
    'array': {
        'is': 'LIKE %\"${value}\"%'
    },
    'enum': {
        'equal': '= \"${value}\"',
        'not_equal': '!= \"${value}\"',
        'contains': 'LIKE \"%${value}%\"',
        'begins_with': 'LIKE \"${value}%\"',
        'ends_with': 'LIKE \"%${value}\"'
    }
};


const QB_OPERATOR_MAP = {
    '=': 'equal',
    '!=': 'not_equal',
    '<': 'less',
    '<=': 'less_or_equal',
    '>': 'greater',
    '>=': 'greater_or_equal'
};

function createFilter(filterObj) {
    return _.map(filterObj.rules, (rule) => {
        if (rule.condition) {
            return '(' + createFilter(rule) + ')';
        }
        let val = VALUE_MAP[rule.type][rule.operator].replace('${value}', rule.value);
        return [rule.id, val].join(' ');
    }).join(' ' + filterObj.condition + ' ');
}

function parseFilter(filterStr, specialRules) {
    let counter = 0,
        deepRules = [],
        startIndex = null,
        rules = null,
        rulesObj = {
            condition: '',
            rules: null
        };

    let parsed = _.map(filterStr, (c, i) => {
        if (c === '(') {
            counter++;
            if (_.isNull(startIndex)) {
                startIndex = i;
                return c;
            }
        } else if (c === ')') {
            counter--;
            if (counter === 0) {
                deepRules.push(parseFilter(filterStr.substring(startIndex + 1, i)));
                startIndex = null;
                return c;
            }
        }
        return counter > 0 ? '*' : c;
    }).join('');

    if (AND_CONDITION_RX.test(parsed) || !OR_CONDITION_RX.test(parsed)) {
        rules = parsed.split(AND_CONDITION_RX);
        rulesObj.condition = 'AND';
    } else {
        rules = parsed.split(OR_CONDITION_RX);
        rulesObj.condition = 'OR';
    }

    counter = 0;
    rulesObj.rules = _.map(rules, (cond) => {

        if (IS_WRAPPED_RX.test(cond)) {
            return deepRules[counter++];
        }
        let exp = cond.match(EXPRESSION_RX),
            id = exp[1],
            operator = exp[2],
            value = exp[3].match(REMOVE_QUOTES_RX);

        value = value && value[0] || exp[3];
        if (specialRules[id].necktie && specialRules[id].necktie.unix) {
            value = (new window.DateFormatter()).formatDate(new Date(value * 1000), specialRules[id].plugin.format);
        }

        if (operator === 'LIKE') {
            let index = value.indexOf('%');
            if (index === -1) {
                operator = 'contains';

            } else {
                operator = 'begins_with';
                if (index === 0) {
                    operator = 'ends_with';
                    if (value[value.length - 1] === '%') {
                        operator = 'contains';
                        if (value[(index + 1)] === '"') {
                            operator = 'is';
                        }
                    }
                }
            }
            value = value.match(REMOVE_LIKE_SIGN_RX)[0];
        } else {
            operator = QB_OPERATOR_MAP[operator];
        }

        return {id, operator, value};
    });
    return rulesObj;
}

function modifyRules(rules, filters) {
    let modified = $.extend({}, rules);
    _.each(modified.rules, rule => {
        if (filters[rule.id].necktie && filters[rule.id].necktie.unix) {
            let date = (new window.DateFormatter()).parseDate(rule.value, filters[rule.id].plugin.format),
                timeZone = -date.getTimezoneOffset() * 60; //in seconds (do not remove -)

            rule.value = Math.floor((date.getTime() / 1000)) + timeZone;
        } else if (rule.type === 'date') {
            rule.value = `"${rule.value}"`;
        }else if (
            (rule.value[0] === '\"' && rule.value[rule.value.length - 1] === '\"') ||
            (rule.value[0] === '\'' && rule.value[rule.value.length - 1] === '\'')
        ) {
            rule.value = rule.value.substring(1, rule.value.length - 1);
        }

    });
    return modified;
}

export default class GridQueryBuilder extends React.Component {
    componentDidMount() {
        let specialRules = {};
        _.each(this.props.rules, r => {
            return specialRules[r.id] = {plugin: r.plugin_config, necktie: r.necktie_config};
        });

        let initialRules = this.props.filter ? parseFilter(this.props.filter, specialRules) : undefined;

        // Clear element
        this.__builder.innerHTML = '';
        // Attach query builder
        $(this.__builder).queryBuilder({
            filters: this.props.rules,
            rules: initialRules,
            operators: [
                'equal', 'not_equal',
                'less', 'less_or_equal',
                'greater', 'greater_or_equal',
                'contains', 'begins_with', 'ends_with',
                {
                    type: 'is',
                    nb_inputs: 1,
                    apply_to: ['array']
                }
            ],
            icons: {
                add_group: 'trinity-plus',
                add_rule: 'trinity-plus',
                remove_group: 'trinity-minus',
                remove_rule: 'trinity-minus',
                error: 'trinity-warning'
            }
        });

        // Attach listener
        this.unlistenSearch = Events.listen(this.__searchBtn, 'click',
            (e) => {
                e.preventDefault();

                if (!this.__builder.queryBuilder.validate()) {
                    return false;
                }
                this.props.onSearch(createFilter(modifyRules(this.__builder.queryBuilder.getRules(), specialRules)));
            }
        );
    }

    componentWillUnmount() {
        this.unlistenSearch();
        this.__builder.queryBuilder.destroy();
    }

    render() {
        return (
            <form className={this.props.className} style={this.props.style}>
                <div ref={el => this.__builder = el} style={{textAlign: 'initial'}}>
                    loading...
                </div>
                {/*<div className="padding-10">*/}
                    {/*<button type="submit" className="button-medium button-search" ref={el => this.__searchBtn = el}>*/}
                        {/*Advanced search*/}
                        {/*<i className="trinity-search pull-right"/>*/}
                    {/*</button>*/}
                    {/*{ this.props.onClose ?*/}
                        {/*<a className="button-small" onClick={this.props.onClose}>*/}
                            {/*Close*/}
                        {/*</a> : false*/}
                    {/*}*/}
                {/*</div>*/}
            </form>
        );
    }
}