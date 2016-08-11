/**
 * Created by Jakub Fajkus on 10.12.15.
 */
'use strict';

import $ from 'jquery';
import Controller from 'trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import {handleHandleGeneration, initializeFroala} from '../Libraries/GlobalLib';
import TrinityTab from 'trinity/components/TrinityTab';
import React from 'react';
import ReactDOM from 'react-dom';
import NecktieDateAndTime from '../Libraries/Components/DateAndTime.jsx';
import 'froala-editor/js/froala_editor.min.js'; // Extends jquery
import GridBuilder from '../Libraries/VeniceGridBuilder';

export default class BlogArticleController extends Controller {

    indexAction($scope) {
        $scope.productGrid = GridBuilder.build($.id('blog-article-grid'), this.request.query);
    }

    /**
     * Tabs action
     * @param $scope
     */
    tabsAction($scope) {
        //Tell trinity there is tab to be loaded
        $scope.trinityTab = new TrinityTab();

        //On tabs load
        $scope.trinityTab.addListener('tab-load', (e)=>{

            let form = $('form', e.element)[0];
            if(form){
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            if(e.id === 'tab2') {
                let $article = $('#blog_article_content');
                $article.froalaEditor(JSON.parse($article.attr('data-settings')));

                let helper = $.id('blog-article-date-format'),
                    dateEl = $.id('blog_article_dateToPublish'),
                    div = document.createElement('div')
                    ;

                dateEl.parentNode.appendChild(div);

                let limits = JSON.parse(dateEl.getAttribute('data-limit')),
                    min = BlogArticleController._parseDate(limits.min),
                    max = BlogArticleController._parseDate(limits.max)
                    ;

                let fromDate = React.createElement(NecktieDateAndTime, {
                        minDate: min,
                        maxDate: max,
                        type: 'd',
                        format: helper.value,
                        value: new Date(helper.getAttribute('data-dateVal') * 1000),
                        oldElem: dateEl
                    });

                ReactDOM.render(fromDate, div);
                BlogArticleController._handleHandleGeneration();
            }
        });
    }

    /**
     * New blog article action
     * @param $scope
     */
    newAction($scope) {
        $scope.form = new VeniceForm($('form[name="blog_article"]')[0]);

        let format = $.id('blog-article-date-format').value,
            dateEl = $.id('blog_article_dateToPublish');

        let div = document.createElement('div');
        dateEl.parentNode.appendChild(div);

        let limits = JSON.parse(dateEl.getAttribute('data-limit')),
            min = BlogArticleController._parseDate(limits.min),
            max = BlogArticleController._parseDate(limits.max)
            ;

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

        let $article = $('#blog_article_content');
        initializeFroala($article, JSON.parse($article.attr('data-settings')));

        // HIDE TRIAL VERSION BANNER
        if(DEVELOPMENT){
            let $notLicenced = $('a[href="https://froala.com/wysiwyg-editor"]');
            if($notLicenced[0]){
                $notLicenced.parent().css('display','none');
            }
        }
    }

    /**
     * Shortcut
     * @returns {*}
     * @private
     */
    static _handleHandleGeneration() {
        return handleHandleGeneration(
            $('#blog-article-form').attr('data-slugify'),
            $.id('blog_article_title'),
            $.id('blog_article_handle')
        );
    }

    /**
     * Parse date object from venice
     * @param date
     * @returns {Date}
     * @private
     */
    static _parseDate(date){
        return date === 'now' ?
            new Date() : new Date(date.year, date.month || 11, date.day || 31);
    }
}