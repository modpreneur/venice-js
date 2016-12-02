'use strict';

import React from 'react';
import Header from './HeaderNew.jsx';
import GridBody from './GridBody.jsx';
import GridSearch from '../components/search/GridSearch.jsx';
import PaginateComponent from 'react-paginate';
import {glueRowAndDetail} from '../utils.jsx';

const GridWrapper = ({
    detail,
    isEditMode,
    isFetching,

    orderBy,
    columns,
    tableOptions,

    pagination,
    page,
    maxPages,
    paginateOptions,

    /** search **/
    showSearch,
    searchProperties,

    /** content **/
    emptyData,
    error,

    /** Callbacks **/
    onSelectAll,
    onOrderBy,
    onPageSelect,

    /** Children **/
    children
}) => {
    let colSpan = columns.length,
        isEmpty = !!children && maxPages === 0,
        SHOW_PAGINATION = pagination && maxPages > 1
        ;

    if(isEditMode){
        colSpan += 1;
    }

    return (
        <div className="wrapper-grid">
            {showSearch && <GridSearch {...searchProperties} />}
            <table className="grid">
                <Header
                    columns={columns}
                    isEmpty={isEmpty}
                    isEditMode={isEditMode}
                    orderBy={orderBy}
                    orderByCallback={onOrderBy}
                    onSelect={onSelectAll}
                    {...tableOptions}
                />
                <GridBody
                    colSpan={colSpan}
                    error={error}
                    emptyData={emptyData}
                    isFetching={isFetching}
                >
                    {detail ? glueRowAndDetail(children, colSpan) : children}
                </GridBody>
            </table>

            { SHOW_PAGINATION && (
                <div className="pagination-wrapper">
                    <PaginateComponent
                        clickCallback={onPageSelect}
                        initialSelected={page}
                        forceSelected={page}
                        pageNum={maxPages}
                        {...paginateOptions}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Default Properties
 */
GridWrapper.defaultProps = {
    detail: true,
    isEditMode: false,
    page: 0,
    maxPages: 1
};

/**
 * Property types
 */
if (DEVELOPMENT) {
    GridWrapper.propTypes = {
        emptyData: React.PropTypes.element,
        error: React.PropTypes.element,
        detail: React.PropTypes.bool,
        isEditMode: React.PropTypes.bool,
        orderBy: React.PropTypes.shape({
            column: React.PropTypes.string,
            order: React.PropTypes.string
        }),
        columns: React.PropTypes.array,
        tableOptions: React.PropTypes.shape({
            orderByClassName: React.PropTypes.string,
            ascClassName: React.PropTypes.string,
            descClassName: React.PropTypes.string
        }),

        /** Pagination **/
        pagination: React.PropTypes.bool,
        page: React.PropTypes.number,
        maxPages: React.PropTypes.number,
        paginateOptions: React.PropTypes.shape({
            marginPagesDisplayed: React.PropTypes.number,
            pageRangeDisplayed: React.PropTypes.number,
            containerClassName: React.PropTypes.string,
            subContainerClassName: React.PropTypes.string,
            activeClassName: React.PropTypes.string,
            nextLinkClassName: React.PropTypes.string,
            previousLinkClassName: React.PropTypes.string,
            breakLabel: React.PropTypes.element,
            previousLabel: React.PropTypes.element,
            nextLabel: React.PropTypes.element
        }),

        /** search **/
        showSearch: React.PropTypes.bool,
        searchProperties: React.PropTypes.shape({
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
        }),

        /** Callbacks **/
        onOrderBy: React.PropTypes.func,
        onPageSelect: React.PropTypes.func
    };
}

export default GridWrapper;

