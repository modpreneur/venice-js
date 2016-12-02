'use strict';

import _ from 'lodash';
import React from 'react';
import GridSearchContainer from './GridSearchContainer.jsx';
import GridQueryBuilder from './GridQueryBuilder.jsx';
import CSSTransitionGroup from 'react-addons-css-transition-group';


const GridSearch = ({
    transition,
    initialFilter,
    initialSearch,
    filterRules,
    queryBuilder,
    querySearch,
    activeComponent,
    /** callbacks **/
    onClose,
    onSearch,
    onQuerySearch
}) => {
    if(!(queryBuilder || querySearch)){
        return null;
    }

    // Update transition
    let transitionProps = _.extend({
        component: 'div',
        transitionName:'example',
        transitionLeave: false,
        transitionEnterTimeout: 500
    }, transition);

    let activeSearchComponent = activeComponent === 'QUERY_BUILDER' ?
            <GridQueryBuilder
                key="query-builder"
                className={'margin-top-10'}
                rules={filterRules}
                filter={initialFilter}
                onSearch={onQuerySearch}
                onClose={onClose}
            />
            :
            <div key="grid-search">
                <GridSearchContainer
                    className={'margin-top-10'}
                    onSearch={onSearch}
                    search={initialSearch}
                />
                { queryBuilder && // if both, show switcher
                    <a className="row pointer"
                       onClick={onClose}>
                        <div className="button-small">Advanced search</div>
                    </a>
                }
            </div>
        ;

    // Render
    return (
        <CSSTransitionGroup {...transitionProps}>
            {activeSearchComponent}
        </CSSTransitionGroup>
    );
};


/**
 * Property types
 */
if (DEVELOPMENT) {
    GridSearch.propTypes = {
        transition: React.PropTypes.object,
        initialFilter: React.PropTypes.string,
        initialSearch: React.PropTypes.string,
        filterRules: React.PropTypes.array,
        queryBuilder: React.PropTypes.bool,
        querySearch: React.PropTypes.bool,
        activeComponent: React.PropTypes.string,
        onClose: React.PropTypes.func,
        onSearch: React.PropTypes.func,
        onQuerySearch: React.PropTypes.func
    };
}

export default GridSearch;