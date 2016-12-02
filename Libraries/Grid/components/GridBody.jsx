'use strict';

import _ from 'lodash';
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import CustomRowContainer from './CustomRowContainer.jsx';

const GridBody = ({
    colSpan,
    error,
    emptyData,
    transition,
    /** loading? **/
    // isFetching,

    /** Children **/
    children
}) => {
    let content = null;
    if(error || !children || children.length === 0){
        content = (
            <CustomRowContainer colSpan={colSpan} >
                {error || emptyData}
            </CustomRowContainer>
        );
    } else {
        content = children;
    }

    let transitionProps = _.extend({
        transitionName: 'example',
        transitionEnterTimeout: 200,
        transitionLeave: false
    }, transition);
    // Important!
    transitionProps.component = 'tbody';

    return (
        <CSSTransitionGroup {...transitionProps}>
            {content}
        </CSSTransitionGroup>
    );
};

/**
 * Default Properties
 */
GridBody.defaultProps = {
    isFetching: false,
    emptyData: 'No Data'
};

/**
 * Property types
 */
if (DEVELOPMENT) {
    GridBody.propTypes = {
        colSpan: React.PropTypes.number,
        transition: React.PropTypes.object,
        /** loading? **/
        isFetching: React.PropTypes.bool
    };
}

export default GridBody;