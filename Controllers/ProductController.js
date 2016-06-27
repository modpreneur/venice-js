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
        key: 'newAction',


        //indexAction($scope) {
        //    $scope.productGrid = GridBuilder.build(q.id('product-grid'), this.request.query);
        //}

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

                $scope.veniceForms = $scope.veniceForms || {};
                switch (e.id) {
                    // Edit
                    case 'tab2':
                        {
                            var form = e.element.q('form');
                            $scope.veniceForms[e.id] = new _VeniceForm2.default(form);

                            unlisteners.push(ProductController._handleHandleGeneration());

                            $scope.veniceForms['tab2'].success(function () {
                                $scope.trinityTab.reload('tab1');
                            });
                        }break;
                    case 'tab4':
                        {
                            window.setAsDefault = function (id) {
                                //this way work in grids so i let it this way
                                var currentTarget = (0, _jquery2.default)('#' + id)[0];

                                currentTarget.style.display = 'none';

                                var billingPlanId = id.substr(id.lastIndexOf('-') + 1);
                                q.id('loading-icon-for-default-id-' + billingPlanId).style.display = 'block';

                                _Gateway2.default.putJSON(currentTarget.dataset.href, null, function (response) {
                                    var pins = (0, _jquery2.default)('.set-default');
                                    _lodash2.default.each((0, _jquery2.default)('.is-default'), function (isD, id) {
                                        if (isD.style.display === 'block') {
                                            isD.style.display = 'none';
                                            pins[id].style.display = 'block';
                                            return false;
                                        }
                                    });
                                    (0, _jquery2.default)('#loading-icon-for-default-id-' + billingPlanId).css('display', 'none');
                                    (0, _jquery2.default)('#is-default-id-' + billingPlanId).css('display', 'block');
                                    (0, _Services.messageService)(response.body.message, 'success');
                                    $scope.trinityTab.reload('tab1');
                                }, function (error) {
                                    (0, _Services.messageService)('Default billing plan could not be changed.', 'warning');
                                    (0, _jquery2.default)('#loading-icon-for-default-id-' + billingPlanId).style.display = 'none';
                                    currentTarget.style.display = 'block';
                                });
                            };
                        }
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