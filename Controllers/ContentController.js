/**
 * Created by Jakub on 21.12.15.
 */
import _ from 'lodash';
import $ from 'jquery';
import Events from 'trinity/utils/Events';
import Controller from 'trinity/Controller';
import TrinityTab from 'trinity/components/TrinityTab';
import Collection from 'trinity/Collection';
import VeniceForm from '../Libraries/VeniceForm';
import {handleHandleGeneration} from '../Libraries/GlobalLib';
import FormChanger from '../Libraries/FormChanger';
import GridBuilder from '../Libraries/VeniceGridBuilder';
import {startFroala} from 'trinity/utils/FroalaLib';

export default class ContetntController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($.id('content-grid'), this.request.query);
    }

    newAction($scope) {
        let selectEl = $('#entity_type_select')[0],
            $jqFormDiv = $('#javascript-inserted-form'),
            url = $jqFormDiv.attr('data-changer'),
            unlisteners = [];
        let app = this.getApp();
        let handleFormChange = () => {
            _.each(unlisteners, fn => fn());

            let type = selectEl.options[selectEl.selectedIndex].value;
            FormChanger.refreshForm($jqFormDiv[0], url.replace('contentType', type), () => {

                $scope.form = new VeniceForm($(`form[name="${type}_content"]`)[0]);
                if(type === 'html' || type === 'iframe') {
                    // let froalaContainer = $(`#${type}_content_html`)[0];
                    // startFroala(froalaContainer);
                    let formScope = app.parseScope();
                    startFroala(formScope.froalaInput);
                }
                unlisteners.push(
                    ContetntController._handleHandleGeneration()
                );
            });
        };
        // Initial
        handleFormChange();
        //render new form after change
        Events.listen(selectEl, 'change', handleFormChange);
    }

    tabsAction($scope) {
        $scope.trinityTab = new TrinityTab();
        let unlisteners = [];
        //On tabs load
        let app = this.getApp();
        $scope.trinityTab.addListener('tab-load', (e) => {
            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            //Edit tab
            if (e.id === 'tab2') {
                // Collection
                $scope.collection = _.map($('[data-prototype]', e.element), (node) => {
                    return new Collection(node, {
                        addFirst: false,
                        label: true,
                        onAdd: el => {
                            _.each($(el).find(':input'), input =>  $scope.veniceForms[e.id].addInput(input));
                        },
                        onDelete: () => {
                            $scope.veniceForms[e.id].detach();
                            $scope.veniceForms[e.id] = new VeniceForm(form);
                        }
                    });
                });
                let formName = form.getAttribute('name'),
                    contentType = formName.substr(0, formName.indexOf('_'));

                if(contentType === 'html' || contentType === 'iframe') {
                    $scope[e.id] = app.parseScope();
                    startFroala($scope[e.id].froalaInput);
                }

                $scope.veniceForms['tab2'].success(() => $scope.trinityTab.reload('tab1'));

                unlisteners.push(ContetntController._handleHandleGeneration());

            } else if(e.id === 'tab3') {
                let container = $.id('product-grid');
                if(container){
                    $scope.productGrid = GridBuilder.build(container, this.request.query);
                }
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
     * New standard product action
     * @param $scope
     */
    newContentProductAction($scope) {
        //Attach VeniceForm
        $scope.form = new VeniceForm($('form[name="content_product_type_with_hidden_content"]')[0]);
    }

    contentProductTabsAction($scope) {
        $scope.trinityTab = new TrinityTab();
        //On tabs load
        $scope.trinityTab.addListener('tab-load',  e => {
            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }

            if(e.id === 'tab2') {
                $scope.veniceForms['tab2'].success(() => {
                    $scope.trinityTab.reload('tab1');
                });
            }
        });
    }

    static _handleHandleGeneration() {
        return handleHandleGeneration(
            $('#javascript-inserted-form').attr('data-slugify'),
            $.id('group_content_name'),
            $.id('group_content_handle')
        );
    }
}