'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.slugify = slugify;
exports.handleHandleGeneration = handleHandleGeneration;

var _Gateway = require('trinity/Gateway');

var _Gateway2 = _interopRequireDefault(_Gateway);

var _Events = require('trinity/utils/Events');

var _Events2 = _interopRequireDefault(_Events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param route {string}
 * @param sourceField  {HTMLInputElement}
 * @param outputField {HTMLInputElement}
 */
/**
 * Created by rockuo on 23.6.16.
 */

function slugify(route, sourceField, outputField) {
    _Gateway2.default.postJSON(route, { string: sourceField.value }, function (response) {
        outputField.value = response.body.handle;
    }, function (err) {
        console.error(err);
    });
}

function handleHandleGeneration(route, titleField, handleField) {
    if (titleField && handleField) {
        return _Events2.default.listen(titleField, 'input', function () {
            slugify(route, titleField, handleField);
        });
    } else {
        return function () {};
    }
}