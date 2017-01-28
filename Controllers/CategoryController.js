'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Controller from 'trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';
import {handleHandleGeneration} from '../Libraries/GlobalLib';


export default class CategoryController extends Controller{

    /**
     * Tab action
     * @param $scope
     */
    tabsAction($scope){
        let query = _.clone(this.request.query);

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

                CategoryController._handleHandleGeneration();
            }
        });
    }

    /**
     * New category action
     *
     * @param $scope
     */
    newAction($scope) {
        $scope.form = new VeniceForm($('form[name="category"]')[0]);

        CategoryController._handleHandleGeneration();
    }


    /**
     * Shortcut
     * @returns {*}
     * @private
     */
    static _handleHandleGeneration() {
        return handleHandleGeneration(
            $('#category-form').attr('data-slugify'),
            $.id('category_name'),
            $.id('category_handle')
        );
    }
}