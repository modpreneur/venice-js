'use strict';

import _ from 'lodash';
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

const DetailRowContainer = ({
    id,
    isActive,
    colSpan,
    transition,
    buttons,
    children
}) => {
    isActive = isActive || !!children;
    let transitionProps = _.extend({
        transitionName: 'detail',
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 500
    }, transition);
    return (
        <tr className={'tjs-grid-detail-row' + (isActive ? ' active' : '')}>
            <td colSpan={colSpan}>

                {/* arrow that bites into another row  */}
                {/*<div className="grid-detail-arrow-up"><i /></div>*/}

                {/* Data field */}
                <CSSTransitionGroup {...transitionProps}>
                    { isActive ?
                        <div className="tjs-grid-detail" key={id || '1'} style={{overflow: 'hidden'}}>
                            {children}
                        </div> : null
                    }
                </CSSTransitionGroup>
                <div className="tjs-grid-detail-buttons">
                    {/*TODO: Rewrite to be custom*/}
                    {buttons}
                    {/*<button className="button-small">Click Me</button>*/}
                    {/*<button className="button-small">Click Me2</button>*/}
                </div>
            </td>
        </tr>
    );
};

if(DEVELOPMENT){
    DetailRowContainer.propTypes = {
        id: React.PropTypes.string,
        isActive: React.PropTypes.bool,
        colSpan: React.PropTypes.number,
    };
}

export default  DetailRowContainer;