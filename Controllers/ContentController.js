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
import 'froala-editor/js/froala_editor.min.js';

export default class ContetntController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($.id('content-grid'), this.request.query);
    }

    newAction($scope) {
        let selectEl = $('#entity_type_select')[0],
            $jqFormDiv = $('#javascript-inserted-form'),
            url = $jqFormDiv.attr('data-changer'),
            unlisteners = [];

        let handleFormChange = () => {
            _.each(unlisteners, fn => fn());

            let type = selectEl.options[selectEl.selectedIndex].value;
            FormChanger.refreshForm($jqFormDiv[0], url.replace('contentType', type), () => {

                $scope.form = new VeniceForm($(`form[name="${type}_content"]`)[0]);
                if(type === 'html' || type === 'iframe') {
                    let $froalaContainer = $(`#${type}_content_html`);
                    $froalaContainer.froalaEditor(JSON.parse($froalaContainer.attr('data-settings')));
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
        $scope.trinityTab.addListener('tab-load', (e) => {
            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }

            //Edit tab
            if (e.id === 'tab2') {
                // Collection
                $scope.collection = _.map($('[data-prototype]', e.element), (node)=> {
                    return new Collection(node, {
                        addFirst: false,
                        label: true
                    });
                });

                let formName = form.getAttribute('name'),
                    contentType = formName.substr(0, formName.indexOf('_')),
                    $jqFormCont = $(`#${contentType}_content_html`);

                if(contentType === 'html' || contentType === 'iframe') {
                    $jqFormCont.froalaEditor(JSON.parse($jqFormCont.attr('data-settings')));
                }

                $scope.veniceForms['tab2'].success(()=>{
                    $scope.trinityTab.reload('tab1');
                });

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
            if(e.id === 'tab2') {
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm($('form', e.element)[0]);
                $scope.veniceForms['tab2'].success(()=> {
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