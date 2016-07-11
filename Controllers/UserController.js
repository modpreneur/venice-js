/**
 * Created by Jakub Fajkus on 28.12.15.
 */

import Controller from '../node_modules/trinity/Controller';
import TrinityTab from '../node_modules/trinity/components/TrinityTab';
import VeniceForm from '../Libraries/VeniceForm';
import GridBuilder from '../Libraries/VeniceGridBuilder';
import $ from 'jquery';

export default class ContetntController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($('#user-grid')[0], this.request.query);
    }

    /**
     * @param $scope
     */
    tabsAction($scope) {
        //Tell trinity there is tab to be loaded
        $scope.trinityTab = new TrinityTab();

        //On tabs load
        $scope.trinityTab.addListener('tab-load', function(e) {
            let form = e.element.q('form');
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            if(e.id === 'tab2') {
                $scope.veniceForms['tab2'].success(()=>{
                    $scope.trinityTab.reload('tab1');
                });
            } else if (e.id === 'tab3') {
                let gridConf =  $('#product-access-grid')[0];
                if(gridConf)
                    $scope.userGrid = GridBuilder.build(gridConf, this.request.query);
            }
        }, this);
    }
}