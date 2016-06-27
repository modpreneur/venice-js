'use strict';

var _routes = require('./routes.js');

var _routes2 = _interopRequireDefault(_routes);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _controllers = require('./controllers.js');

var _controllers2 = _interopRequireDefault(_controllers);

var _App = require('trinity/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by fisa on 10/16/15.
 */

var Application = new _App2.default(_routes2.default, _controllers2.default);

Application.start(function () {
    console.log('App Loaded!');
    removeLoadingBar();
}, function (err) {
    console.error(err);
    var bar = document.querySelector('.header-loader .bar');
    if (bar) {
        bar.style.backgroundColor = "#f00";
    }
});

function removeLoadingBar() {
    var bars = document.querySelectorAll('.header-loader .bar');
    if (bars.length > 0) {
        (function () {
            _lodash2.default.map(bars, function (bar) {
                bar.className += ' bar-end';
            });
            var timeoutID = null;
            timeoutID = setTimeout(function () {
                document.querySelector('.header-loader').style.display = 'none';
                clearTimeout(timeoutID);
            }, 2000);
        })();
    }
}