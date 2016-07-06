'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Gateway = require('trinity/Gateway');

var _Gateway2 = _interopRequireDefault(_Gateway);

var _VeniceForm = require('../Libraries/VeniceForm');

var _VeniceForm2 = _interopRequireDefault(_VeniceForm);

var _TrinityTab = require('trinity/components/TrinityTab');

var _TrinityTab2 = _interopRequireDefault(_TrinityTab);

var _GlobalLib = require('../Libraries/GlobalLib');

var _Services = require('trinity/Services');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Controller2 = require('trinity/Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _VeniceGridBuilder = require('../Libraries/VeniceGridBuilder');

var _VeniceGridBuilder2 = _interopRequireDefault(_VeniceGridBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jakub Fajkus on 10.12.15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProductController = function (_Controller) {
    _inherits(ProductController, _Controller);

    function ProductController() {
        _classCallCheck(this, ProductController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ProductController).apply(this, arguments));
    }

    _createClass(ProductController, [{
        key: 'indexAction',
        value: function indexAction($scope) {
            $scope.productGrid = _VeniceGridBuilder2.default.build((0, _jquery2.default)('#product-grid')[0], this.request.query);
        }
    }, {
        key: 'newAction',
        value: function newAction($scope) {
            $scope.form = new _VeniceForm2.default((0, _jquery2.default)('form[name="free_product"]')[0], _VeniceForm2.default.formType.NEW);
            ProductController._handleHandleGeneration();
        }
    }, {
        key: 'tabsAction',
        value: function tabsAction($scope) {
            $scope.trinityTab = new _TrinityTab2.default();
            var unlisteners = [];
            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {

                var form = e.element.q('form');
                if (form) {
                    $scope.veniceForms = $scope.veniceForms || {};
                    $scope.veniceForms[e.id] = new _VeniceForm2.default(form);
                }

                switch (e.id) {
                    // Edit
                    case 'tab2':
                        {
                            unlisteners.push(ProductController._handleHandleGeneration());

                            $scope.veniceForms['tab2'].success(function () {
                                $scope.trinityTab.reload('tab1');
                            });
                        }break;
                    case 'tab3':
                        {
                            var conf = (0, _jquery2.default)('#content-grid')[0];
                            if (conf) $scope.productGrid = _VeniceGridBuilder2.default.build(conf, this.request.query);
                        }
                    case 'tab4':
                        {
                            var gridConf = (0, _jquery2.default)('#billing-plan-grid')[0];
                            if (gridConf) $scope.bilingPlanGrid = _VeniceGridBuilder2.default.build(gridConf, this.request.query);

                            window.setAsDefault = function (id) {
                                //this way work in grids so i let it this way
                                var currentTarget = (0, _jquery2.default)('#' + id)[0];

                                currentTarget.style.display = 'none';

                                var billingPlanId = id.substr(id.lastIndexOf('-') + 1);
                                var loadingIcon = (0, _jquery2.default)('#loading-icon-for-default-id-' + billingPlanId);
                                loadingIcon.css('display', 'block');
                                _Gateway2.default.putJSON(currentTarget.dataset.href, null, function (response) {
                                    var pins = (0, _jquery2.default)('.set-default');
                                    _lodash2.default.each((0, _jquery2.default)('.is-default'), function (isD, id) {
                                        if (isD.style.display === 'block') {
                                            isD.style.display = 'none';
                                            pins[id].style.display = 'block';
                                            return false;
                                        }
                                    });
                                    (0, _jquery2.default)('#is-default-id-' + billingPlanId).css('display', 'block');
                                    (0, _Services.messageService)(response.body.message, 'success');
                                    $scope.trinityTab.reload('tab1');
                                }, function (error) {
                                    (0, _Services.messageService)(error.response.body.message, 'warning');
                                    currentTarget.style.display = 'block';
                                });
                                loadingIcon.css('display', 'none');
                            };
                        }break;
                    case 'tab5':
                        {
                            $scope.productGrid = _VeniceGridBuilder2.default.build((0, _jquery2.default)('#blog-article-grid')[0], this.request.query);
                        }break;
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
         *
         * @param $scope
         */

    }, {
        key: 'newContentProductAction',
        value: function newContentProductAction($scope) {
            $scope.form = new _VeniceForm2.default(q('form[name="content_product_type_with_hidden_product"]'), _VeniceForm2.default.formType.NEW);
        }
    }], [{
        key: '_handleHandleGeneration',
        value: function _handleHandleGeneration() {
            return (0, _GlobalLib.handleHandleGeneration)((0, _jquery2.default)('#product_form').attr('data-slugify'), (0, _jquery2.default)('#free_product_name')[0], (0, _jquery2.default)('#free_product_handle')[0]);
        }
    }]);

    return ProductController;
}(_Controller3.default);

exports.default = ProductController;