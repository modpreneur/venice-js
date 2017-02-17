/**
 * Created by Jakub Fajkus on 10.12.15.
 */
'use strict';

import $ from 'jquery';
import Controller from 'trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';

export default class BillingPlanController extends Controller {
    
    tabsAction($scope) {
        $scope.trinityTab = new TrinityTab();

        //On tabs load
        $scope.trinityTab.addListener('tab-load', (e) => {
            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
        });
    }
}