/**
 * Created by fisa on 1/15/16.
 */
'use strict';
import _ from 'lodash';


export default class TrinityQueryBuilder {
    static create(baseUrl, select, where, query) {
        // base URL
        baseUrl = _.last(baseUrl) === '/' ? _.initial(baseUrl).join('') : baseUrl;
        // Select
        let buffer = [];
        buffer.push('(' + select.join(',') + ')');

        // Constrains
        let constraintsBuffer = [];
        if (query.limit) {
            constraintsBuffer.push('LIMIT=' + query.limit);
        }
        if (query.offset) {
            constraintsBuffer.push('OFFSET=' + query.offset);
        }
        if (!_.isEmpty(query.orderBy)) {
            let order = query.orderBy.order || 'ASC';
            constraintsBuffer.push(`ORDERBY ${query.orderBy.column} ${order.toUpperCase()}`);
        }
        let filter = query.filter;
        if (where) {
            if (!_.isEmpty(filter)) {
                filter = `${where} AND (${filter})`;
            } else {
                filter = where;
            }
        }
        if (!_.isEmpty(filter)) {
            buffer.push(`{${filter}}`);
        }
        buffer.push(constraintsBuffer.join(' '));
        return baseUrl + '?q=' + buffer.join(' ');
    }

    static createSearch(baseUrl, select, search, query) {
        // base URL
        baseUrl = (_.last(baseUrl) === '/' ? _.initial(baseUrl).join('') : baseUrl);

        let queryParams = [];
        if (query.offset) {
            queryParams.push('offset=' + query.offset);
        }
        if (query.limit) {
            queryParams.push('limit=' + query.limit);
        }
        let queryStr = _.isEmpty(queryParams) ? '' : '&' + queryParams.join('&');

        return `${baseUrl}?q=${search}&c=${select.join(',')}${queryStr}`;
    }
}