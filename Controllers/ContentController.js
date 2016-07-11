'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Events = require('trinity/utils/Events');

var _Events2 = _interopRequireDefault(_Events);

var _Controller2 = require('trinity/Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _TrinityTab = require('trinity/components/TrinityTab');

var _TrinityTab2 = _interopRequireDefault(_TrinityTab);

var _Collection = require('trinity/Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _VeniceForm = require('../Libraries/VeniceForm');

var _VeniceForm2 = _interopRequireDefault(_VeniceForm);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _GlobalLib = require('../Libraries/GlobalLib');

var _FormChanger = require('../Libraries/FormChanger');

var _FormChanger2 = _interopRequireDefault(_FormChanger);

var _VeniceGridBuilder = require('../Libraries/VeniceGridBuilder');

var _VeniceGridBuilder2 = _interopRequireDefault(_VeniceGridBuilder);

require('froala-editor/js/froala_editor.min');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jakub on 21.12.15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ContetntController = function (_Controller) {
    _inherits(ContetntController, _Controller);

    function ContetntController() {
        _classCallCheck(this, ContetntController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ContetntController).apply(this, arguments));
    }

    _createClass(ContetntController, [{
        key: 'indexAction',
        value: function indexAction($scope) {
            $scope.productGrid = _VeniceGridBuilder2.default.build((0, _jquery2.default)('#content-grid')[0], this.request.query);
        }
    }, {
        key: 'newAction',
        value: function newAction($scope) {
            var select = (0, _jquery2.default)('#entity_type_select')[0],
                jqFormDiv = (0, _jquery2.default)('#javascript-inserted-form'),
                url = jqFormDiv.attr('data-changer'),
                unlisteners = [];

            var func = function func() {
                _lodash2.default.each(unlisteners, function (unListener) {
                    unListener();
                });
                var type = select.options[select.selectedIndex].value;
                _FormChanger2.default.refreshForm(jqFormDiv[0], url.replace('contentType', type), function () {

                    $scope.form = new _VeniceForm2.default((0, _jquery2.default)('form[name="' + type + '_content"]')[0], _VeniceForm2.default.formType.NEW);
                    if (type == 'html' || type == 'iframe') {
                        var jqueryContElem = (0, _jquery2.default)('#' + type + '_content_html');
                        jqueryContElem.froalaEditor(JSON.parse(jqueryContElem[0].getAttribute('data-settings')));
                    }
                    unlisteners.push(ContetntController._handleHandleGeneration());
                });
            };
            func();

            //render new form after change
            _Events2.default.listen(select, 'change', func);
        }
    }, {
        key: 'tabsAction',
        value: function tabsAction($scope) {
            var _this2 = this;

            $scope.trinityTab = new _TrinityTab2.default();
            var unlisteners = [];
            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {
                var form = e.element.q('form');
                if (form) {
                    $scope.veniceForms = $scope.veniceForms || {};
                    $scope.veniceForms[e.id] = new _VeniceForm2.default(form);
                }

                //Edit tab
                if (e.id === 'tab2') {
                    // Collection
                    $scope.collection = _lodash2.default.map((0, _jquery2.default)('[data-prototype]'), function (node) {
                        return new _Collection2.default(node, { addFirst: false, label: true });
                    });

                    var formName = form.getAttribute('name');
                    var contentType = formName.substr(0, formName.indexOf('_'));
                    var jqFormCont = (0, _jquery2.default)('#' + contentType + '_content_html');

                    if (contentType == 'html' || contentType == 'iframe') {
                        jqFormCont.froalaEditor(JSON.parse(jqFormCont[0].getAttribute('data-settings')));
                    }

                    $scope.veniceForms['tab2'].success(function () {
                        $scope.trinityTab.reload('tab1');
                    });
                    unlisteners.push(ContetntController._handleHandleGeneration());
                } else if (e.id === 'tab3') {
                    var conf = (0, _jquery2.default)('#product-grid')[0];
                    if (conf) $scope.productGrid = _VeniceGridBuilder2.default.build(conf, _this2.request.query);
                }
            }, this);

            $scope.trinityTab.addListener('tab-unload', function (e) {
                switch (e.id) {
                    // Edit
                    case 'tab2':
                        {
                            _lodash2.default.each(unlisteners, function (unListener) {
                                unListener();
                            });
                        }break;
                    default:
                        break;
                }
                // All
                if ($scope.veniceForms[e.id]) {
                    $scope.veniceForms[e.id].detach();
                }
            });
        }

        /**
         * New standard product action
         * @param $scope
         */

    }, {
        key: 'newContentProductAction',
        value: function newContentProductAction($scope) {
            //Attach VeniceForm
            $scope.form = new _VeniceForm2.default((0, _jquery2.default)('form[name="content_product_type_with_hidden_content"]')[0], _VeniceForm2.default.formType.NEW);
        }
    }, {
        key: 'contentProductTabsAction',
        value: function contentProductTabsAction($scope) {
            $scope.trinityTab = new _TrinityTab2.default();
            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {
                if (e.id == 'tab2') {
                    $scope.veniceForms = $scope.veniceForms || {};
                    $scope.veniceForms[e.id] = new _VeniceForm2.default(e.element.q('form'));
                    $scope.veniceForms['tab2'].success(function () {
                        $scope.trinityTab.reload('tab1');
                    });
                }
            }, this);
        }
    }], [{
        key: '_handleHandleGeneration',
        value: function _handleHandleGeneration() {
            return (0, _GlobalLib.handleHandleGeneration)((0, _jquery2.default)('#javascript-inserted-form').attr('data-slugify'), (0, _jquery2.default)('#group_content_name')[0], (0, _jquery2.default)('#group_content_handle')[0]);
        }
    }]);

    return ContetntController;
}(_Controller3.default);

exports.default = ContetntController;