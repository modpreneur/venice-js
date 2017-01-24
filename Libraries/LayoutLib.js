/**
 * Created by rockuo on 24.1.17.
 */
/**
 * Created by bures on 29.3.16.
 */
'use strict';

import _ from 'lodash';
import $ from 'jquery';
import Events from 'trinity/utils/Events';
import Gateway from 'trinity/Gateway';
import Dom from 'trinity/utils/Dom';

let LayoutMenu = {

    /**
     * Set current layout menu
     * @param menu
     */
    setCurrent(menu) {
        let url = window.location.href,
            $directBars = $('.js-direct-item', menu),
            $dropBars = $('.drop-down', menu),
            found = false;

        _.each($directBars, (val, i) => {
            if (i > 0 && ~url.indexOf($('a', val)[0].href)) {
                Dom.classlist.add(val, 'active');
                found = true;
                return false; // break
            }
        });

        if (found) return; //stop function

        _.each($dropBars, val => {
            _.each($('li', val), inVal => {
                let inHref = $('a', inVal)[0].href;
                if (~inHref.lastIndexOf('#')) {
                    inHref = inHref.substring(0, inHref.lastIndexOf('#'));
                }

                if (~url.indexOf(inHref)) {
                    Dom.classlist.add(val, 'active');
                    $(':checkbox', val)[0].checked = true;
                    //   TODO: @DavidCzernin  if you want add class to item inside drobdown menu then do "Dom.classlist.add(inVal,'someClass');"

                    found = true;
                    return false; // break
                }
            });
            if (found) return false; // break
        });

    },

    /**
     * Make all radio buttons in array uncheckable
     * @param radios {NodeList}
     */
    unCheckRadio(radios){
        let checkedRadioButton;
        _.each(radios, (radio) => {
            Events.listen(radio, 'click', () => {
                if (checkedRadioButton === radio) {
                    radio.checked = false;
                    checkedRadioButton = null;
                } else {
                    checkedRadioButton = radio;
                }
            });
        });
    },

    /**
     * Moves inner html
     * @param from {HTMLElement}
     * @param to {HTMLElement}
     */
    moveInvisibleInnerHtml(from, to) {
        let st = $(window).scrollTop(), // Scroll Top
            y = $(from).offset().top,
            multi = 2.5;


        if (y <= (st * multi)) {
            if (to.innerHTML !== from.innerHTML) {
                to.innerHTML = from.innerHTML;
            }
            if (!Dom.classlist.contains(to, 'slideInUp')) {
                Dom.classlist.remove(to, 'slideOutDown');
                Dom.classlist.add(to, 'slideInUp');
            }
        } else {
            if (!Dom.classlist.contains(to, 'slideOutDown')) {
                Dom.classlist.remove(to, 'slideInUp');
                Dom.classlist.add(to, 'slideOutDown');
            }
        }
    }
};

let BarMsg = {

    /**
     * Adds sidebar message listeners
     */
    addBarMsgListeners() {
        //array of notification messages
        let messageList = $.id('redis-list'),
            messageCount = messageList.children.length;

        // Removes Notification counter icon
        Events.listen($('#notifications-label')[0], 'click', function() {
            let children = $(this).children();
            if (children.length === 2) {
                this.removeChild(children[1]);
            }
        });

        // Attach remove actions to notification messages
        for (let i = 0; i < messageCount; i++) {
            let btn_id = 'sidebar_remove_btn_' + i,
                btn = $.id(btn_id);
            if (!btn) {
                //skip if no btn was rendered
                continue;
            }
            btn.onclick = () => BarMsg.removeMsg(btn_id, messageList);
        }
    },

    /**
     * function calling api for msg removing
     * @param btn_id {string}
     * @param list
     */
    removeMsg(btn_id, list){
        let child = $.id(btn_id),
            redisAPIInput = $.id('api-remove-redis-msg');

        if (!redisAPIInput) {
            console.warn('Could not send request for removing');
            return;
        }

        let url = redisAPIInput.value,
            data = {
                redisKey: child.children[0].value
            };

        Gateway.deleteJSON(url, data, () => {
            list.removeChild(child.parentElement);

            if (list.children.length === 0) {
                list.innerHTML =
                    `<li class='info noaction'>
                        <i class='tiecons tiecons-info-circle'>
                        </i> 
                        <div class='message-group'>
                            <span>You don\'t have any new notification.</span>
                        </div>
                    </li>`;
            }
        }, (error) => {
            console.error(error);
            console.log(error.response);
        });
    }
};


class LoaderManager {
    constructor() {
        this.loaderCounter = 1; //one is there by render
        this.$headerLoader = $('.header-loader');
        this.$bars = this.$headerLoader.find('.bar');
        this.errorCounter = 0;
        this.timeoutID = null;
        this.timeoutDelay = 5000;
    }

    /**
     * add loader
     * return current count of loaders
     * @returns {number}
     */
    add() {
        this._add();
        this.loaderCounter++;
        return this.loaderCounter;
    }

    /**
     * remove loader
     * return current count of loaders
     * @returns {number}
     */
    remove() {
        if (this.loaderCounter) {
            this.loaderCounter--;
            this._remove();
        }
        return this.loaderCounter;
    }

    /**
     * remove all loaders and errors
     */
    removeAll() {
        this.loaderCounter = 0;
        this.errorCounter = 0;
        this._remove(true);
    }

    /**
     * add error
     * return current count of errors
     * @returns {number}
     */
    addError() {
        this._add(true);
        this.errorCounter++;
        return this.errorCounter;
    }

    /**
     * remove error
     * return current count of errors
     * @returns {number}
     */
    removeError() {
        if (this.errorCounter) {
            this.errorCounter--;
            this._remove(true);
        }
        return this.errorCounter;
    }

    /**
     *
     * @param timeout
     * @returns {number}
     */
    timeout(timeout) {
        return timeout ? this.timeoutDelay = timeout : this.timeoutDelay;
    }

    //TODO: fix loader
    /**
     * show loader or error (error has precedence) also add only what is needed (reason of that much of if's)
     * @param error
     * @private
     */
    _add(error = false) {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
        if (!this.errorCounter && !this.loaderCounter) { // add only when neither error or loader are set
            this.$headerLoader.css('display', 'block');
            this.$bars.removeClass('bar-end');
        }
        if (error && !this.errorCounter) { //add error color (only for the first time)
            this.$bars[1].style.backgroundColor = '#f00';
        }
    }

    /**
     * remove loader or error
     * @param error
     * @private
     */
    _remove(error = false) {
        if (!this.loaderCounter && !this.errorCounter) {
            this.$bars.addClass('bar-end');
            this.timeoutID = setTimeout(
                () => this.$headerLoader.css('display', 'none'),
                this.timeoutDelay);
        }
        if (error && !this.errorCounter) {
            this.$bars[1].style.backgroundColor = '#40ADC2';
        }
    }
}


const NEW_LOADER_MANAGER = new LoaderManager();

export {LayoutMenu, BarMsg, NEW_LOADER_MANAGER as LoaderManager};