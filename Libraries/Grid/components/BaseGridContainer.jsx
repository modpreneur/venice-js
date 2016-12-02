'use strict';

import React from 'react';

export default class BaseGridContainer extends React.Component {
    constructor(props){
        super(props);
        this.store = props.store;
        this.dispatch = props.store.dispatch.bind(props.store);


        this.state = {
            ...this.store.getState(),
            isEditMode: false,
            showDetailId: null,
            showQueryBuilder: this.__showQueryBuilder && !!props.filter
        };
    }

    /**
     * After mount (initial render) react callback
     */
    componentDidMount(){
        // Attach main listener
        this.store.addListener(this.onStateChange.bind(this));
        // Initial call
        this.onStateChange();
    }

    /**
     * Update view start point
     */
    onStateChange(){
        this.setState(this.store.getState());
    }

    render(){
        return 'Not implemented';
    }
}
