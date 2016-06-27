'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Controller2 = require('trinity/Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _VeniceForm = require('../Libraries/VeniceForm');

var _VeniceForm2 = _interopRequireDefault(_VeniceForm);

var _TrinityTab = require('trinity/components/TrinityTab');

var _TrinityTab2 = _interopRequireDefault(_TrinityTab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jakub Fajkus on 10.12.15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BillingPlanController = function (_Controller) {
    _inherits(BillingPlanController, _Controller);

    function BillingPlanController() {
        _classCallCheck(this, BillingPlanController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BillingPlanController).apply(this, arguments));
    }

    _createClass(BillingPlanController, [{
        key: 'tabsAction',
        value: function tabsAction($scope) {
            $scope.trinityTab = new _TrinityTab2.default();

            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {
                var form = e.element.q('form');
                if (form) {
                    $scope.veniceForms = $scope.veniceForms || {};
                    $scope.veniceForms[e.id] = new _VeniceForm2.default(form);
                }
            }, this);
        }
    }]);

    return BillingPlanController;
}(_Controller3.default);

exports.default = BillingPlanController;