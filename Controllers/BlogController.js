'use strict';

import $ from 'jquery';
import _ from 'lodash';
import Controller from 'trinity/Controller';
import TrinityTab from 'trinity/components/TrinityTab';
import GridBuilder from '../Libraries/VeniceGridBuilder';
import {connectTrinityTabMenu} from '../Libraries/GlobalLib';

/**
 * tab id to element query map
 * @type {{}}
 */
const IDMAP = {
    '1':'blog-article-grid',
    '2':'category-grid',
    '3':'tag-grid'
};

export default class BlogController extends Controller{

    /**
     * Tab action
     * @param $scope
     */
    tabsAction($scope){
        let query = _.clone(this.request.query);

        $scope.trinityTab = new TrinityTab();
        $scope.trinityTab.addListener('tab-load', function(e){
            let gridID = IDMAP[e.id.substring(3)];
            let gridContainer = $.id(gridID);
            if(gridContainer){
                $scope[gridID] = GridBuilder.build(gridContainer, query);
            } else {
                console.warn('Missing grid container!');
            }
        });

        // connect Sidebar navigation
        connectTrinityTabMenu($scope['blog-menu'], $scope.trinityTab);
    }
}