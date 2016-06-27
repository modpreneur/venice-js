'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Controller2 = require('trinity/Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _TrinityTab = require('trinity/components/TrinityTab');

var _TrinityTab2 = _interopRequireDefault(_TrinityTab);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _VeniceForm = require('../Libraries/VeniceForm');

var _VeniceForm2 = _interopRequireDefault(_VeniceForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jakub Fajkus on 28.12.15.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ContetntController = function (_Controller) {
    _inherits(ContetntController, _Controller);

    function ContetntController() {
        _classCallCheck(this, ContetntController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ContetntController).apply(this, arguments));
    }

    _createClass(ContetntController, [{
        key: 'tabsAction',


        /**
         * @param $scope
         */
        value: function tabsAction($scope) {
            //Tell trinity there is tab to be loaded
            $scope.trinityTab = new _TrinityTab2.default();

            //On tabs load
            $scope.trinityTab.addListener('tab-load', function (e) {
                if (e.id === 'tab2') {
                    var form = e.element.q('form');
                    $scope.veniceForms = $scope.veniceForms || {};
                    $scope.veniceForms[e.id] = new _VeniceForm2.default(form);
                    $scope.veniceForms['tab2'].success(function () {
                        $scope.trinityTab.reload('tab1');
                    });
                }
            }, this);
        }
    }]);

    return ContetntController;
}(_Controller3.default);

exports.default = ContetntController;