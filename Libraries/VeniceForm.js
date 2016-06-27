/**
 * Created by bures on 06/26/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _TrinityForm2 = require('trinity/components/TrinityForm');

var _TrinityForm3 = _interopRequireDefault(_TrinityForm2);

var _Debug = require('trinity/Debug');

var _Debug2 = _interopRequireDefault(_Debug);

var _Services = require('trinity/Services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultSettings = {
    button: { // Defines which classes add to active button in which state
        ready: 'trinity-form-ready',
        success: 'trinity-form-success',
        timeout: 'trinity-form-timeout trinity-form-error'
    },
    requestTimeout: _Debug2.default.isDev() ? 60000 : 10000
};

var VeniceForm = function (_TrinityForm) {
    _inherits(VeniceForm, _TrinityForm);

    function VeniceForm(element, type, settings) {
        _classCallCheck(this, VeniceForm);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VeniceForm).call(this, element, type, _lodash2.default.defaultsDeep(settings || {}, defaultSettings)));

        _this.success(_this.__onSuccess, _this);
        _this.error(_this.__onError, _this);

        if (_Debug2.default.isDev()) {
            _this.addListener('submit-data', function (data) {
                console.log('JSON DATA:', data);
            });
        }
        return _this;
    }

    /**
     * Success Callback
     * @param response
     * @private
     */


    _createClass(VeniceForm, [{
        key: '__onSuccess',
        value: function __onSuccess(response) {
            (0, _Services.messageService)(response.body['message'], 'success');
            if (_Debug2.default.isDev()) {
                console.log('Success', response);
            }
        }

        /**
         * Error callback
         * @param error
         * @private
         */

    }, {
        key: '__onError',
        value: function __onError(error) {
            var _this2 = this;

            _Debug2.default.error('ERROR', error);
            _Debug2.default.error(error.response);
            if (error.timeout) {
                (0, _Services.messageService)('Request Timed out.<br>Try Again i few seconds.', 'error');
                return;
            }

            // Parse error object
            var response = error.response,
                error_info = response.type.indexOf('json') !== -1 ? response.body.error : response.text;

            // If it is just string, there is no need to continue
            if (_lodash2.default.isString(error_info)) {
                (0, _Services.messageService)(error_info, 'error');
                return;
            }

            // More errors
            var noErrors = true;
            // DB errors
            if (error_info['db']) {
                (function () {
                    noErrors = false;
                    // Special DB error ?
                    var dbErrors = _lodash2.default.isString(error_info['db']) ? [error_info['db']] : error_info['db'];
                    _lodash2.default.each(dbErrors, function (err) {
                        (0, _Services.messageService)(err, 'error');
                    });

                    var id = setTimeout(function () {
                        _this2.state = 'ready';
                        _this2.unlock();
                        clearTimeout(id);
                    }, 2000);
                })();
            }

            // Global errors - CRFS token, etc.
            var globalErrors = error_info['global'];
            if (globalErrors && globalErrors.length !== 0) {
                globalErrors = _lodash2.default.isString(globalErrors) ? [globalErrors] : globalErrors;
                noErrors = false;
                __globalErrors(globalErrors);
            }
            // Fields error
            if (error_info['fields'] && Object.keys(error_info['fields']).length > 0) {
                noErrors = false;
                __fieldErrors.call(this, error_info['fields']);
            } else {
                this.unlock();
            }

            // Some error, but nothing related to Form
            if (noErrors && _Debug2.default.isDev()) {
                (0, _Services.messageService)('DEBUG: Request failed but no FORM errors returned! check server response', 'warning');
            }
        }
    }]);

    return VeniceForm;
}(_TrinityForm3.default);

/**
 * Export same types
 */


exports.default = VeniceForm;
VeniceForm.formType = _TrinityForm3.default.formType;

/**
 * Handles global errors
 * @param errors
 * @private
 */
function __globalErrors(errors) {
    var errLength = errors.length;
    for (var i = 0; i < errLength; i++) {
        if (errors[i].indexOf("The CSRF token is invalid") > -1) {
            (0, _Services.messageService)("Something get wrong, please refresh page.", 'warning');
        } else {
            (0, _Services.messageService)(errors[i], 'warning');
        }
    }
}

/**
 * Handles Field Errors - adds them to form
 * @param fields
 * @private
 */
function __fieldErrors(fields) {
    var keys = Object.keys(fields),
        keysLength = keys.length;

    for (var i = 0; i < keysLength; i++) {
        var k = keys[i];
        this.addError(k, fields[k], document.getElementById(k));
    }
}