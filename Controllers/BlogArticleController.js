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

var _Events = require('trinity/utils/Events');

var _Events2 = _interopRequireDefault(_Events);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

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
        key: 'tabsAction',


        /**
         * Tabs action
         * @param $scope
         */
        value: function tabsAction($scope) {
            //Tell trinity there is tab to be loaded
            $scope.trinityTab = new _TrinityTab2.default();

            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {

                $scope.veniceForms = $scope.veniceForms || {};
                if (e.id == 'tab2') {
                    var form = e.element.q('form');

                    $scope.veniceForms[e.id] = new _VeniceForm2.default(form);
                    var article = (0, _jquery2.default)('#blog_article_content');
                    article.froalaEditor(JSON.parse(article[0].getAttribute('data-settings')));

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

            var article = (0, _jquery2.default)('#blog_article_content');
            console.log(article);
            // article.froalaEditor(JSON.parse(article[0].getAttribute('data-settings')));
            //
            BlogArticleController._handleHandleGeneration();
        }
    }], [{
        key: '_handleHandleGeneration',
        value: function _handleHandleGeneration() {
            return (0, _GlobalLib.handleHandleGeneration)((0, _jquery2.default)('#blog-article-form').attr('data-slugify'), (0, _jquery2.default)('#blog_article_title')[0], (0, _jquery2.default)('#blog_article_handle')[0]);
        }
    }]);

    return BlogArticleController;
}(_Controller3.default);

exports.default = BlogArticleController;