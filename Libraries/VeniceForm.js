/**
 * Created by bures on 06/26/16.
 */
'use strict';

import $ from 'jquery';
import _ from 'lodash';
import TrinityForm from 'trinity/components/TrinityForm';
import {messageService} from 'trinity/Services';

const defaultSettings = {
    button : { // Defines which classes add to active button in which state
        ready: 'trinity-form-ready',
        success: 'trinity-form-success',
        timeout: 'trinity-form-timeout trinity-form-error'
    },
    requestTimeout: 10000
};

if(DEVELOPMENT){
    defaultSettings.requestTimeout = 60000;
}

export default class VeniceForm extends TrinityForm {
    constructor(element, settings){
        super(element, _.defaultsDeep(settings || {}, defaultSettings));
        this.success(this.__onSuccess, this);
        this.error(this.__onError, this);

        if(DEVELOPMENT){
            this.addListener('submit-data', (data)=>{
                console.log('JSON DATA:', data);
            });
        }
    }

    /**
     * Success Callback
     * @param e {Object} Event
     * @private
     */
    __onSuccess(e){
        let response = e.data;
        messageService(response.body['message'],'success');
        if(DEVELOPMENT){
            console.log('Success', response);
        }
    }

    /**
     * Error callback
     * @param e {Object} Event
     * @private
     */
    __onError(e){
        let error = e.data;
        if(DEVELOPMENT){
            console.error('ERROR', error);
            console.log(error.response);
        }
        if(error.timeout){
            messageService('Request Timed out.<br>Try Again i few seconds.', 'error');
            return;
        }

        // Parse error object
        let response = error.response,
            error_info = ~response.type.indexOf('json') ? response.body.error : response.text;

        // If it is just string, there is no need to continue
        if(_.isString(error_info)){
            messageService(error_info, 'error');
            return;
        }

        // More errors
        let noErrors = true;
        // DB errors
        if(error_info.db){
            noErrors = false;
            // Special DB error ?
            _.each([].concat(error_info.db), (err)=>{
                messageService(err, 'error');
            });

            let id = setTimeout(()=>{
                this.state = 'ready';
                this.unlock();
                clearTimeout(id);
            }, 2000);
        }

        // Global errors - CRFS token, etc.
        if(!_.isEmpty(error_info.global)){
            noErrors = false;
            __globalErrors([].concat(error_info.global));
        }
        // Fields error
        if(!_.isEmpty(error_info.fields)){
            noErrors = false;
            _.each(error_info.fields, (message, key) => {
                this.addError($.id(key), {
                    key,
                    message
                });
            });
        } else {
            this.unlock();
        }

        // Some error, but nothing related to Form
        if(noErrors && DEVELOPMENT){
            messageService('DEBUG: Request failed but no FORM errors returned! check server response', 'warning');
        }
    }
}

/**
 * Handles global errors
 * @param errors
 * @private
 */
function __globalErrors(errors){
    _.each(errors, (err)=>{
        if(err.indexOf("The CSRF token is invalid") > -1) {
            messageService("Something get wrong, please refresh page.", 'warning');
        } else {
            messageService(err, 'warning');
        }
    });
}
