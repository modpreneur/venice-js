/**
 * Created by fisa on 11/3/15.
 */
'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Controller from 'trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';
import GridBuilder from '../Libraries/VeniceGridBuilder';
import {connectTrinityTabMenu} from '../Libraries/GlobalLib';

/**
 * tab id to element query map
 * @type {{}}
 */
const IDMAP = {
    '1':'exception-grid',
    '2':'notification-grid',
    '3':'ipn-grid',
    '4':'entity-action-grid',
    '5':'access-log-grid',
    '6':'payment-error-grid',
    '7':'ban-log-grid',
    '8':'message-log-grid'
};

export default class LoggerController extends Controller{

    /**
     * Tab action
     * @param $scope
     */
    tabAction($scope){
        let query = _.clone(this.request.query);

        $scope.trinityTab = new TrinityTab();
        $scope.trinityTab.addListener('tab-load', function(e){
            let form = $('form', e.element)[0];
            if (form) {
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            // Little trick to omit both switch and if statements
            // replaces bellow code
            let gridID = IDMAP[e.id.substring(3)];
            let gridContainer = $.id(gridID);
            if(gridContainer){
                $scope[gridID] = GridBuilder.build(gridContainer, query);
            } else {
                console.warn('Missing grid container!');
            }
        });

        // connect Sidebar navigation
        connectTrinityTabMenu($scope['logger-menu'], $scope.trinityTab);
    }
}