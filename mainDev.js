'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _routes = require('./routes.js');

var _routes2 = _interopRequireDefault(_routes);

var _App = require('trinity/App');

var _App2 = _interopRequireDefault(_App);

var _controllers = require('./controllers.js');

var _controllers2 = _interopRequireDefault(_controllers);

var _Gateway = require('trinity/Gateway');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Gateway configuration - Xdebug purposes
(0, _Gateway.configure)({
    timeout: 60000,
    fileTimeout: 60000
}); /**
     * Created by fisa on 10/16/15.
     */


var Application = new _App2.default(_routes2.default, _controllers2.default, { env: 'dev' });

Application.start(function (isRoute) {
    console.log('App Loaded!');
    if (!isRoute) {
        console.log('INFO: This route doesn\'t have any controller!');
    }
    removeLoadingBar();
}, function (err) {
    console.error(err);
    var bar = q('.header-loader .bar');
    if (bar) {
        bar.style.backgroundColor = "#f00";
    }
});

function removeLoadingBar() {
    var bars = qAll('.header-loader .bar');
    if (bars.length > 0) {
        (function () {
            _lodash2.default.map(bars, function (bar) {
                bar.className += ' bar-end';
            });
            var timeoutID = null;
            timeoutID = setTimeout(function () {
                q('.header-loader').style.display = 'none';
                clearTimeout(timeoutID);
            }, 2000);
        })();
    }
}