/**
 * Created by Bures on 23/4/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _moment3 = require('react-widgets/lib/localizers/moment');

var _moment4 = _interopRequireDefault(_moment3);

var _DateTimePicker = require('react-widgets/lib/DateTimePicker');

var _DateTimePicker2 = _interopRequireDefault(_DateTimePicker);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dateFormMap = {
    'd': 'YYYY-MM-DD',
    't': 'hh-mm-ss',
    'dt': 'YYYY-MM-DD hh:mm:ss'
};

var NecktieDateAndTime = function (_React$Component) {
    _inherits(NecktieDateAndTime, _React$Component);

    function NecktieDateAndTime(props) {
        _classCallCheck(this, NecktieDateAndTime);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NecktieDateAndTime).call(this, props));

        (0, _moment4.default)(_moment2.default);
        _this.state = { value: _this.props.value }; // Initial state
        if (_this.props.func) {
            _this.props.func(_this);
        }
        _this.props.oldElem.style.display = 'none';
        return _this;
    }

    _createClass(NecktieDateAndTime, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(_DateTimePicker2.default, {
                value: this.state.value || null,
                format: getLongFormat(this.props.format),
                className: this.props.className,
                id: this.props.id,
                name: this.props.name,
                min: this.props.minDate || new Date(1900, 0, 1) // new Date(1900, 0, 1) is react-widgets default
                , max: this.props.maxDate || new Date(2099, 11, 31) // new Date(2099, 11, 31) is react-widgets default
                , required: this.props.required,
                time: this.props.type.indexOf('t') > -1,
                calendar: this.props.type.indexOf('d') > -1,
                onChange: function onChange(value) {
                    _this2.setState({ value: value });
                    _this2.props.oldElem.value = (0, _moment2.default)(value).format(dateFormMap[_this2.props.type]);
                },
                __self: this
            });
        }
    }]);

    return NecktieDateAndTime;
}(_react2.default.Component);

exports.default = NecktieDateAndTime;

NecktieDateAndTime.defaultProps = {
    type: 'dt',
    format: 'Y-M-D H:m',
    required: 'required',
    value: null
};

var changeTo = {
    Y: 'YYYY',
    y: 'YY',
    i: 'mm',
    h: 'hh',
    D: 'ddd',
    d: 'DD',
    M: 'MMM',
    m: 'MM',
    H: 'HH',
    s: 'ss'
};

/**
 * Get moment format from user format
 * @param format {string}
 * @return {string}
 */
function getLongFormat(format) {
    var longFormat = '';
    _lodash2.default.each(Array.from(format), function (char) {
        longFormat += changeTo[char] ? char.replace(char, changeTo[char]) : char;
    });
    return longFormat;

    // return format
    //     .replace(/Y/, 'YYYY')
    //     .replace(/i/, 'mm')
    //     .replace(/h/, 'hh')
    //     .replace(/D/, 'ddd')
    //     .replace(/d/, 'DD')
    //     .replace(/M/, 'MMM')
    //     .replace(/m/, 'MM')
    //     .replace(/H/, 'HH')
    //     .replace(/s/, 'ss');
}