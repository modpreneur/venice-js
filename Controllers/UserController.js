/**
 * Created by Jakub Fajkus on 28.12.15.
 */

import $ from 'jquery';
import Controller from 'trinity/Controller';
import TrinityTab from 'trinity/components/TrinityTab';
import VeniceForm from '../Libraries/VeniceForm';
import GridBuilder from '../Libraries/VeniceGridBuilder';

export default class ContetntController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($.id('user-grid'), this.request.query);
    }

    /**
     * @param $scope
     */
    tabsAction($scope) {
        //Tell trinity there is tab to be loaded
        $scope.trinityTab = new TrinityTab();

        //On tabs load
        $scope.trinityTab.addListener('tab-load', (e) => {
            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            if(e.id === 'tab2') {
                $scope.veniceForms['tab2'].success(()=>{
                    $scope.trinityTab.reload('tab1');
                });
            } else if (e.id === 'tab3') {
                let gridConf = $.id('product-access-grid');
                if(gridConf){
                    $scope.userGrid = GridBuilder.build(gridConf, this.request.query);
                }
            }
        });
    }
}