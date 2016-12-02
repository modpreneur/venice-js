'use strict';

import React from 'react';

const CustomRowContainer = ({ colSpan, children }) => {
    return (
        <tr className="tjs-grid-custom-row">
            <td colSpan={colSpan}>
                {children}
            </td>
        </tr>
    );
};

/**
 * Property types
 */
if (DEVELOPMENT) {
    CustomRowContainer.propTypes = {
        colSpan: React.PropTypes.number
    };
}

export default CustomRowContainer;