'use strict';

import $ from 'jquery';
import Controller from 'trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';
import {handleHandleGeneration} from '../Libraries/GlobalLib';


export default class TagController extends Controller{

    /**
     * Tab action
     * @param $scope
     */
    tabsAction($scope){
        let app = this.getApp();
        $scope.trinityTab = new TrinityTab();
        $scope.trinityTab.addListener('tab-load', function(e){
            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }

            if(e.id === 'tab2') {
                $scope[e.id] = app.parseScope();

                TagController._handleHandleGeneration();
            }
        });
    }

    /**
     * New tag action
     *
     * @param $scope
     */
    newAction($scope) {
        $scope.form = new VeniceForm($('form[name="tag"]')[0]);

        TagController._handleHandleGeneration();
    }


    /**
     * Shortcut
     * @returns {*}
     * @private
     */
    static _handleHandleGeneration() {
        return handleHandleGeneration(
            $('#tag-form').attr('data-slugify'),
            $.id('tag_name'),
            $.id('tag_handle')
        );
    }
}