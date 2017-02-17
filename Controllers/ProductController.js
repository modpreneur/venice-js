/**
 * Created by Jakub Fajkus on 10.12.15.
 */

import _ from 'lodash';
import $ from 'jquery';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';
import {handleHandleGeneration} from '../Libraries/GlobalLib';
import BillingPlanGrid from '../CustomGrids/BillingPlanGrid.jsx';
import Controller from 'trinity/Controller';
import GridBuilder from '../Libraries/VeniceGridBuilder';

export default class ProductController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($.id('product-grid'), this.request.query);
    }


    newAction($scope) {
        $scope.form = new VeniceForm($('form[name="free_product"]')[0]);
        ProductController._handleHandleGeneration();
    }

    tabsAction($scope) {
        $scope.trinityTab = new TrinityTab();
        let unlisteners = [];
        //On tabs load
        $scope.trinityTab.addListener('tab-load', (e) => {

            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            
            switch(e.id){
                // Edit
                case 'tab2': {
                    unlisteners.push(ProductController._handleHandleGeneration());

                    $scope.veniceForms['tab2'].success(() => {
                        $scope.trinityTab.reload('tab1');
                    });
                } break;
                case 'tab3': {
                    let container = $.id('content-grid');
                    if(container){
                        $scope.contentGrid = GridBuilder.build(container, this.request.query);
                    }
                } break;
                case 'tab4':{
                    let container = $.id('billing-plan-grid');
                    if(container){
                        $scope.bilingPlanGrid = GridBuilder.buildCustom(container, this.request.query, BillingPlanGrid);
                    }
                } break;
                case 'tab5':{
                    $scope.articleGrid = GridBuilder.build($.id('blog-article-grid'), this.request.query);
                } break;
                default: break;
            }
        });

        $scope.trinityTab.addListener('tab-unload', (e) => {
            switch(e.id){
                // Edit
                case 'tab2': {
                    _.each(unlisteners, fn => fn());
                } break;
                default : break;
            }
            // All
            if($scope.veniceForms[e.id]){
                $scope.veniceForms[e.id].detach();
            }
        });
    }

    /**
     * TODO: @RichardBures
     * @param $scope
     */
    newContentProductAction($scope) {
        $scope.form = new VeniceForm($('form[name="content_product_type_with_hidden_product"]')[0]);
    }

    static _handleHandleGeneration() {
        return handleHandleGeneration(
            $('#product_form').attr('data-slugify'),
            $.id('free_product_name'),
            $.id('free_product_handle'));
    }
}