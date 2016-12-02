'use strict';

import React from 'react';

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.__onSubmit = props.onSubmit || (props.attributes && props.attributes.onSubmit);
    }

    handleSubmit(e) {
        this.props.onSubmit(e, this.__input.value);
    }

    handleChange(e) {
        this.props.onChange(e, this.__input.value);
    }

    render() {
        let formAtt = this.props.attributes || {};
        formAtt.className = ('grid-search ' + (formAtt.className || '')).trim();
        formAtt.onSubmit = this.__onSubmit ? this.handleSubmit.bind(this) : undefined;

        // input
        let inputAtt = {
            type: 'text',
            name: this.props.name || 'search',
            placeholder: this.props.placeholder,
            onChange: this.props.onChange ? this.handleChange.bind(this) : undefined,
            value: this.props.value,
            defaultValue: this.props.defaultValue
        };

        return (
            <form {...formAtt}>
                <input ref={el => this.__input = el} {...inputAtt}/>
                <button type="submit">
                    <i className="trinity trinity-search"/>
                </button>
                {this.props.children}
            </form>
        );
    }
}

export default SearchForm;

/**
 * Property types
 */
if (DEVELOPMENT) {
    SearchForm.propTypes = {
        attributes: React.PropTypes.shape({
            onSubmit: React.PropTypes.func,
            className: React.PropTypes.string
        }),
        inputName: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        value: React.PropTypes.string,
        defaultValue: React.PropTypes.string
    };
}