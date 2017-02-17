/**
 * Created by Jakub Fajkus on 10.12.15.
 */
'use strict';

import $ from 'jquery';
import Controller from 'trinity/Controller';
import VeniceForm from '../Libraries/VeniceForm';
import {handleHandleGeneration} from '../Libraries/GlobalLib';
import TrinityTab from 'trinity/components/TrinityTab';
import React from 'react';
import ReactDOM from 'react-dom';
import NecktieDateAndTime from '../Libraries/Components/DateAndTime.jsx';
import {startFroala} from 'trinity/utils/FroalaLib';
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

        let app = this.getApp();
        //On tabs load
        $scope.trinityTab.addListener('tab-load', (e) => {

            let form = $('form', e.element)[0];
            if (form) {
                $scope.veniceForms = $scope.veniceForms || {};
                $scope.veniceForms[e.id] = new VeniceForm(form);
            }
            if (e.id === 'tab2') {
                // let article = $('#blog_article_content')[0];
                // startFroala(article);
                $scope[e.id] = app.parseScope();
                startFroala($scope[e.id].froalaInput, null, () => {
                    $($scope[e.id].froalaInput)
                        .find('.fr-element.fr-view')
                        .bind('DOMSubtreeModified', () => {
                            if ($scope.veniceForms[e.id].hasError('blog_article[content]')) {
                                $scope.veniceForms[e.id].removeError('blog_article[content]');
                            }
                        });
                });

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
                    type: 'dt',
                    format: helper.value,
                    value: new Date(helper.getAttribute('data-dateVal') * 1000),
                    oldElem: dateEl,
                    required: 'required'
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
            type: 'dt',
            format: format,
            value: new Date(),
            oldElem: dateEl,
            required: 'required'
        });

        dateEl.required = true;
        ReactDOM.render(fromDate, div);

        BlogArticleController._handleHandleGeneration();

        startFroala($scope.froalaInput, null, () => {
            $($scope.froalaInput)
                .find('.fr-element.fr-view')
                .bind('DOMSubtreeModified', () => {
                    if ($scope.form.hasError('blog_article[content]')) {
                        $scope.form.removeError('blog_article[content]');
                    }
                });
        });


        // HIDE TRIAL VERSION BANNER
        if (DEVELOPMENT) {
            let $notLicenced = $('a[href="https://froala.com/wysiwyg-editor"]');
            if ($notLicenced[0]) {
                $notLicenced.parent().css('display', 'none');
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
    static _parseDate(date) {
        return date === 'now' ?
            new Date() : new Date(date.year, date.month || 11, date.day || 31);
    }
}