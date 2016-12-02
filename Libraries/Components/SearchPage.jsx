'use strict';

import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import {generateView} from '../../Entity/utils';
import ENTITIES from '../../Entity/entities';
import THeader from './SimpleHeader.jsx';
import UnsafeRow from '../Grid/components/UnsafeRow.jsx';
import SearchForm from './SearchForm.jsx';
import Gateway from 'trinity/Gateway';
import History from '../GlobalHistory';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class SearchPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            prevText: props.searchText,
            searchText: props.searchText,
            isFetching: false
        };
    }

    componentDidMount(){
        let $searchInput = $(this.props.globalSearchInput);
        $searchInput.val(this.props.searchText);

        $(this.props.globalSearchForm).on('submit', (e)=>{
            e.preventDefault();
            this.searchRequest($searchInput.val());
        });
        $searchInput.on('input', ()=>{
            this.updateSearch($searchInput.val());
        });
    }

    componentWillUnmount(){
        $(this.props.globalSearchForm).off('submit');
        $(this.props.globalSearchInput).off('input');
    }

    redirect(url){
        window.location.href = url;
    }

    updateSearch(value){
        this.setState({
            searchText:value
        });
    }

    searchRequest(){
        let searchText = this.state.searchText.trim();
        if(this.state.isFetching || _.isEmpty(searchText) || searchText === this.state.prevText){
            return false;
        }

        History.replace({ pathname: window.location.pathname, search:'?search=' + searchText});
        this.setState({
            searchText: searchText, // spaces
            isFetching: true
        });
        // Request search
        Gateway.getJSON(this.props.searchUrl, {q: searchText}, (response) => {
            this.setState({
                isFetching: false,
                prevText: searchText,
                data: response.body
            });
        }, (error) => {
            this.setState({
                isFetching: false
            });
            console.error(error);
            if(DEVELOPMENT){
                console.log(error.response);
            }
        });
    }

    render(){
        // Ensure input has same search text
        this.props.globalSearchInput.value = this.state.searchText;

        let rest = [];
        let tables = _.map(this.state.data, (results, name)=>{
            let entityInfo = ENTITIES[name];
            if(!entityInfo){
                rest.push(name);
                return false;
            }
            let view = generateView(entityInfo, 'search');
            return (
                <div style={{overflow: 'hidden'}} key={name + results.length}>
                    <header className="header">
                        <i className={entityInfo.iconClass}/> {entityInfo.label}
                    </header>

                    <div className="box-table-body">
                        <table className="grid">
                            <THeader columns={view.columns} />
                            <tbody>
                                {_.map(results, (el, i)=>
                                    <UnsafeRow
                                        key={i}
                                        attributes={{
                                            title:'Go to detail',
                                            className: 'pointer',
                                            onClick: () => this.redirect(el._detail)
                                        }}                                        
                                        columns={view.columns}
                                        data={el}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        });

        let others = _(rest).map((entity, i)=>{
            let urls = _(this.state.data[entity])
                .filter((el)=> !!el._detail)
                .map((el, i)=>(
                    <a key={i} href={el._detail}>
                        <li>{el._detail}</li>
                    </a>
                ))
                .value();
            return _.isEmpty(urls) ? false :
                (
                    <div key={i} className="padding-top-5">
                        {entity}
                        <ul className="padding-left-20">
                            {urls}
                        </ul>
                    </div>
                );
        }).filter(el => !!el).value();

        let noResults = _.isEmpty(tables) && _.isEmpty(others);
        return (
            <div>
                { !_.isEmpty(this.state.prevText) && noResults ?
                    <h2 className="text-center">We found nothing</h2> : false
                }
                <div>
                    <ReactCSSTransitionGroup
                        transitionName="example"
                        transitionEnterTimeout={500}
                        transitionAppear={true}
                        transitionAppearTimeout={500}
                        transitionLeave={false}
                    >
                        {tables}
                    </ReactCSSTransitionGroup>
                    <div className="text-center" style={{
                        top: 0,
                        position: 'absolute',
                        width: '100%',
                        height:'100%',
                        minHeight: '120px',
                        display: this.state.isFetching ? '' : 'none',
                        backgroundColor: 'rgba(204, 204, 204, 0.5)'
                    }}>
                        <i className="tiecons tiecons-loading tiecons-rotate font-40"
                           style={{
                               top: '50px'
                           }}
                        />
                    </div>
                </div>
                { _.isEmpty(others) ? false : (
                    <div>
                        <header className="header">
                            <i className=""/> Others
                        </header>
                        <div className="padding-left-20 padding-bottom-20">
                            {others}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <SearchForm
                        attributes={{
                            style: {
                                width: '400px',
                                margin: '30px'
                            },
                            autoComplete: 'off'
                        }}
                        value={this.state.searchText}
                        onChange={(e, val)=>{
                            this.updateSearch(val);
                        }}
                        onSubmit={(e)=>{
                            e.preventDefault();
                            this.searchRequest();
                        }}
                    />
                </div>
            </div>
        );
    }
}

if(DEVELOPMENT){
    SearchPage.propTypes = {
        data: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array])
    };
}