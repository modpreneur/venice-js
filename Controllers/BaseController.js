'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _closureEvents = require('trinity/utils/closureEvents');

var _closureEvents2 = _interopRequireDefault(_closureEvents);

var _Controller2 = require('trinity/Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

var _VeniceForm = require('../Libraries/VeniceForm');

var _VeniceForm2 = _interopRequireDefault(_VeniceForm);

var _TrinityTab = require('trinity/components/TrinityTab');

var _TrinityTab2 = _interopRequireDefault(_TrinityTab);

var _FormChanger = require('../Libraries/FormChanger');

var _FormChanger2 = _interopRequireDefault(_FormChanger);

var _Gateway = require('trinity/Gateway');

var _Gateway2 = _interopRequireDefault(_Gateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jakub on 11.02.16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// import Slugify from '../Libraries/Slugify';


var BaseController = function (_Controller) {
    _inherits(BaseController, _Controller);

    function BaseController() {
        _classCallCheck(this, BaseController);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(BaseController).apply(this, arguments));
    }

    _createClass(BaseController, [{
        key: 'handleHandleGeneration',


        //handleFormChanging($scope, containingDiv, url, formElementName) {
        //    console.log("changing in baseController");
        //    var select = q.id('entity_type_select');
        //    var oldType = select.options[select.selectedIndex].value;
        //    var newType;
        //    var controller = this;
        //    var scope = $scope;
        //    var formDiv = containingDiv;
        //    var oldFormName = formElementName.replace(":type", oldType);
        //
        //    FormChanger.refreshForm(formDiv, url + oldType, function () {
        //        scope.form = new VeniceForm(q('form[name="'+oldFormName+'"]'), VeniceForm.formType.NEW);
        //
        //        controller.handleHandleGeneration(oldFormName + '_name', oldFormName + '_handle');
        //    });
        //
        //    //save old value when user clicks the input
        //    events.listen(select, 'click', function (e) {
        //        oldType = select.options[select.selectedIndex].value;
        //    });
        //    //save old value when user uses keyboard
        //    events.listen(select, 'keydown', function (e) {
        //        oldType = select.options[select.selectedIndex].value;
        //    });
        //    //render new form after change
        //    events.listen(select, 'change', function (e) {
        //        newType = select.options[select.selectedIndex].value;
        //        var newFormName = formElementName.replace(":type", newType);
        //
        //        FormChanger.refreshForm(formDiv, url + newType, function () {
        //            scope.form = new VeniceForm(q('form[name="'+newFormName+'"]'), VeniceForm.formType.NEW);
        //
        //            controller.handleHandleGeneration(newFormName + '_name', newFormName + '_handle');
        //        });
        //    });
        //}

        value: function handleHandleGeneration(inputId, outputId) {
            var titleField = q.id(inputId);
            var handleField = q.id(outputId);

            if (titleField && handleField) {
                _closureEvents2.default.listen(titleField, 'input', function () {
                    Slugify.slugify(titleField, handleField);
                });
            }
        }
    }]);

    return BaseController;
}(_Controller3.default);

exports.default = BaseController;