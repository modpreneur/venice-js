/**
 * Created by Jakub Fajkus on 10.12.15.
 */

import Controller from 'trinity/Controller';
import TrinityTab from 'trinity/components/TrinityTab';
import VeniceForm from '../Libraries/VeniceForm';

export default class ProductAccessController extends Controller {

    /**
     * New billing plan action
     * @param $scope
     */
    newAction($scope) {
        //Attach VeniceForm
        $scope.form = new VeniceForm($('form[name="product_access"]')[0]);
    }

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