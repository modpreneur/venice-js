/**
 * Created by Jakub Fajkus on 10.12.15.
 */

import _ from 'lodash';
import $ from 'jquery';
import Gateway from 'trinity/Gateway';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';
import {handleHandleGeneration} from '../Libraries/GlobalLib';
import {messageService} from 'trinity/Services';
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

                    $scope.veniceForms['tab2'].success(()=>{
                        $scope.trinityTab.reload('tab1');
                    });
                } break;
                case 'tab3': {
                    let container = $.id('content-grid');
                    if(container){
                        $scope.productGrid = GridBuilder.build(container, this.request.query);
                    }
                } break;
                case 'tab4':{
                    let container = $.id('billing-plan-grid');
                    if(container){
                        $scope.bilingPlanGrid = GridBuilder.build(container, this.request.query);
                    }

                    window.setAsDefault = function(id){ //this way work in grids so i let it this way
                        let $currentTarget = $('#'+id),
                            billingPlanId = id.substr(id.lastIndexOf('-') + 1),
                            $loadingIcon = $('#loading-icon-for-default-id-' + billingPlanId)
                            ;

                        $currentTarget.css ('display', 'none');
                        $loadingIcon.css('display', 'block');

                        // Request
                        Gateway.putJSON($currentTarget.attr('data-href'), null,
                            (response) => {
                                let pins = $('.set-default');
                                _.each($('.is-default'), (el, i) => {
                                    if(el.style.display === 'block'){
                                        el.style.display = 'none';
                                        pins[i].style.display = 'block';
                                        return false;
                                    }
                                });

                                $(`#is-default-id-${billingPlanId}`).css('display', 'block');

                                messageService(response.body.message,'success');
                                $scope.trinityTab.reload('tab1');
                            },
                            (error) => {
                                messageService(error.response.body.message, 'warning');
                                $currentTarget.css('display', 'block');
                            }
                        );
                        $loadingIcon.css('display', 'none');
                    };
                } break;
                // TODO: WHAT IS TAB 5 ?
                case 'tab5':{
                    $scope.productGrid = GridBuilder.build($.id('blog-article-grid'), this.request.query);
                } break;
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