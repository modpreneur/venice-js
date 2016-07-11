/**
 * Created by Jakub Fajkus on 10.12.15.
 */


import Gateway from 'trinity/Gateway';
import VeniceForm from '../Libraries/VeniceForm';
import TrinityTab from 'trinity/components/TrinityTab';
import {handleHandleGeneration} from '../Libraries/GlobalLib';
import {messageService} from '/trinity/Services';
import _ from 'lodash';
import Controller from 'trinity/Controller';
import $ from 'jquery';
import GridBuilder from '../Libraries/VeniceGridBuilder';

export default class ProductController extends Controller {

    indexAction($scope) {
       $scope.productGrid = GridBuilder.build($('#product-grid')[0], this.request.query);
    }


    newAction($scope) {
        $scope.form = new VeniceForm($('form[name="free_product"]')[0], VeniceForm.formType.NEW);
        ProductController._handleHandleGeneration();
    }

    tabsAction($scope) {
        $scope.trinityTab = new TrinityTab();
        let unlisteners = [];
        //On tabs load
        $scope.trinityTab.addListener('tab-load', function (e) {

            let form = e.element.q('form');
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
                    let conf =$('#content-grid')[0];
                    if(conf)
                        $scope.productGrid = GridBuilder.build(conf, this.request.query);
                }
                case 'tab4':{
                    let gridConf = $('#billing-plan-grid')[0];
                    if(gridConf)
                        $scope.bilingPlanGrid = GridBuilder.build(gridConf, this.request.query);

                    window.setAsDefault = function(id){ //this way work in grids so i let it this way
                        let currentTarget=$(`#${id}`)[0];

                        currentTarget.style.display='none';

                        let billingPlanId = id.substr(id.lastIndexOf('-')+1);
                        let loadingIcon = $(`#loading-icon-for-default-id-${billingPlanId}`);
                        loadingIcon.css( 'display','block' );
                        Gateway.putJSON(currentTarget.dataset.href, null, function (response) {
                            let pins = $('.set-default');
                            _.each($('.is-default'), (isD,id) => {
                                if(isD.style.display === 'block'){
                                    isD.style.display = 'none';
                                    pins[id].style.display = 'block';
                                    return false;
                                }
                            });
                            $(`#is-default-id-${billingPlanId}`).css( 'display','block' );
                            messageService(response.body.message,'success');
                            $scope.trinityTab.reload('tab1');
                        }, function (error) {
                            messageService(error.response.body.message, 'warning');
                            currentTarget.style.display='block';
                            
                        });
                        loadingIcon.css( 'display','none' );
                    };

                }break;
                case 'tab5':{
                    $scope.productGrid = GridBuilder.build($('#blog-article-grid')[0], this.request.query);
                }break;
            }
        }, this);

        $scope.trinityTab.addListener('tab-unload', function(e) {
            switch(e.id){
                // Edit
                case 'tab2': {
                    _.each(unlisteners,(unListener)=>{unListener();});
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
     *
     * @param $scope
     */
    newContentProductAction($scope) {
        $scope.form = new VeniceForm(q('form[name="content_product_type_with_hidden_product"]'), VeniceForm.formType.NEW);
    }

    static _handleHandleGeneration() {
        return handleHandleGeneration($('#product_form').attr('data-slugify'),$('#free_product_name')[0], $('#free_product_handle')[0]);
    }
}