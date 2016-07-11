/**
 * Created by Jakub Fajkus on 10.12.15.
 */
import Controller from '../node_modules/trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import {handleHandleGeneration} from '../Libraries/GlobalLib';
import TrinityTab from '../node_modules/trinity/components/TrinityTab';
import React from 'react';
import ReactDOM from 'react-dom';
import NecktieDateAndTime from '../Libraries/Components/DateAndTime.jsx';
import $ from 'jquery';
import '../node_modules/froala-editor/js/froala_editor.min.js';
import GridBuilder from '../Libraries/VeniceGridBuilder';

export default class BlogArticleController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($('#blog-article-grid')[0], this.request.query);
    }

    /**
     * Tabs action
     * @param $scope
     */
    tabsAction($scope) {
        //Tell trinity there is tab to be loaded
        $scope.trinityTab = new TrinityTab();

        //On tabs load
        $scope.trinityTab.addListener('tab-load', function (e) {

            let form = e.element.q('form');
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            if(e.id == 'tab2') {
                let article = $('#blog_article_content');
                article.froalaEditor(JSON.parse(article[0].getAttribute('data-settings')));

                let helper = $('#blog-article-date-format')[0];
                let dateEl = $('#blog_article_dateToPublish')[0];
                let div = document.createElement('div');
                dateEl.parentNode.appendChild(div);
                let limits = JSON.parse(dateEl.getAttribute('data-limit'));
                let min = BlogArticleController._parseDate(limits.min);
                let max = BlogArticleController._parseDate(limits.max);

                let fromDate = React.createElement(NecktieDateAndTime, {
                    minDate: min,
                    maxDate: max,
                    type: 'd',
                    format: helper.value,
                    value: new Date(helper.getAttribute('data-dateVal')*1000),
                    oldElem: dateEl
                });

                ReactDOM.render(fromDate, div);
                
                BlogArticleController._handleHandleGeneration();
            }
        }, this);
    }

    /**
     * New blog article action
     * @param $scope
     */
    newAction($scope) {
        $scope.form = new VeniceForm($('form[name="blog_article"]')[0], VeniceForm.formType.NEW);

        let format = $('#blog-article-date-format')[0].value;
        let dateEl = $('#blog_article_dateToPublish')[0];
        let div = document.createElement('div');
        dateEl.parentNode.appendChild(div);
        let limits = JSON.parse(dateEl.getAttribute('data-limit'));
        let min = BlogArticleController._parseDate(limits.min);
        let max = BlogArticleController._parseDate(limits.max);

        let fromDate = React.createElement(NecktieDateAndTime, {
            minDate: min,
            maxDate: max,
            type: 'd',
            format: format,
            value: new Date(),
            oldElem: dateEl,
            required: true
        });

        dateEl.required = true;
        ReactDOM.render(fromDate, div);

        BlogArticleController._handleHandleGeneration();

        let article = $('#blog_article_content');
        article.froalaEditor(JSON.parse(article[0].getAttribute('data-settings')));
        var notLicenced = $('a[href="https://froala.com/wysiwyg-editor"]');
        notLicenced.parent().css('display','none');
    }

    static _handleHandleGeneration() {
        return handleHandleGeneration($('#blog-article-form').attr('data-slugify'),$('#blog_article_title')[0], $('#blog_article_handle')[0]);
    }

    static _parseDate(date){
        if(date === 'now'){
            return new Date();
        } else {
            return new Date(date.year,date.month || 11, date.day || 31);
        }
    }
}