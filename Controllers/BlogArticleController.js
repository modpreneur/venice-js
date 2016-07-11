'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Controller2 = require('trinity/Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _VeniceForm = require('../Libraries/VeniceForm');

var _VeniceForm2 = _interopRequireDefault(_VeniceForm);

var _GlobalLib = require('../Libraries/GlobalLib');

var _TrinityTab = require('trinity/components/TrinityTab');

var _TrinityTab2 = _interopRequireDefault(_TrinityTab);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _DateAndTime = require('../Libraries/Components/DateAndTime.jsx');

var _DateAndTime2 = _interopRequireDefault(_DateAndTime);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('froala-editor/js/froala_editor.min');

var _VeniceGridBuilder = require('../Libraries/VeniceGridBuilder');

var _VeniceGridBuilder2 = _interopRequireDefault(_VeniceGridBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jakub Fajkus on 10.12.15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var BlogArticleController = function (_Controller) {
    _inherits(BlogArticleController, _Controller);

    function BlogArticleController() {
        _classCallCheck(this, BlogArticleController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BlogArticleController).apply(this, arguments));
    }

    _createClass(BlogArticleController, [{
        key: 'indexAction',
        value: function indexAction($scope) {
            $scope.productGrid = _VeniceGridBuilder2.default.build((0, _jquery2.default)('#blog-article-grid')[0], this.request.query);
        }

        /**
         * Tabs action
         * @param $scope
         */

    }, {
        key: 'tabsAction',
        value: function tabsAction($scope) {
            //Tell trinity there is tab to be loaded
            $scope.trinityTab = new _TrinityTab2.default();

            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {

                var form = e.element.q('form');
                if (form) {
                    $scope.veniceForms = $scope.veniceForms || {};
                    $scope.veniceForms[e.id] = new _VeniceForm2.default(form);
                }
                if (e.id == 'tab2') {
                    var article = (0, _jquery2.default)('#blog_article_content');
                    article.froalaEditor(JSON.parse(article[0].getAttribute('data-settings')));

                    var helper = (0, _jquery2.default)('#blog-article-date-format')[0];
                    var dateEl = (0, _jquery2.default)('#blog_article_dateToPublish')[0];
                    var div = document.createElement('div');
                    dateEl.parentNode.appendChild(div);
                    var limits = JSON.parse(dateEl.getAttribute('data-limit'));
                    var min = BlogArticleController._parseDate(limits.min);
                    var max = BlogArticleController._parseDate(limits.max);

                    var fromDate = _react2.default.createElement(_DateAndTime2.default, {
                        minDate: min,
                        maxDate: max,
                        type: 'd',
                        format: helper.value,
                        value: new Date(helper.getAttribute('data-dateVal') * 1000),
                        oldElem: dateEl
                    });

                    _reactDom2.default.render(fromDate, div);

                    BlogArticleController._handleHandleGeneration();
                }
            }, this);
        }

        /**
         * New blog article action
         * @param $scope
         */

    }, {
        key: 'newAction',
        value: function newAction($scope) {
            $scope.form = new _VeniceForm2.default((0, _jquery2.default)('form[name="blog_article"]')[0], _VeniceForm2.default.formType.NEW);

            var format = (0, _jquery2.default)('#blog-article-date-format')[0].value;
            var dateEl = (0, _jquery2.default)('#blog_article_dateToPublish')[0];
            var div = document.createElement('div');
            dateEl.parentNode.appendChild(div);
            var limits = JSON.parse(dateEl.getAttribute('data-limit'));
            var min = BlogArticleController._parseDate(limits.min);
            var max = BlogArticleController._parseDate(limits.max);

            var fromDate = _react2.default.createElement(_DateAndTime2.default, {
                minDate: min,
                maxDate: max,
                type: 'd',
                format: format,
                value: new Date(),
                oldElem: dateEl,
                required: true
            });

            dateEl.required = true;
            _reactDom2.default.render(fromDate, div);

            BlogArticleController._handleHandleGeneration();

            var article = (0, _jquery2.default)('#blog_article_content');
            article.froalaEditor(JSON.parse(article[0].getAttribute('data-settings')));
            var notLicenced = (0, _jquery2.default)('a[href="https://froala.com/wysiwyg-editor"]');
            notLicenced.parent().css('display', 'none');
        }
    }], [{
        key: '_handleHandleGeneration',
        value: function _handleHandleGeneration() {
            return (0, _GlobalLib.handleHandleGeneration)((0, _jquery2.default)('#blog-article-form').attr('data-slugify'), (0, _jquery2.default)('#blog_article_title')[0], (0, _jquery2.default)('#blog_article_handle')[0]);
        }
    }, {
        key: '_parseDate',
        value: function _parseDate(date) {
            if (date === 'now') {
                return new Date();
            } else {
                return new Date(date.year, date.month || 11, date.day || 31);
            }
        }
    }]);

    return BlogArticleController;
}(_Controller3.default);

exports.default = BlogArticleController;