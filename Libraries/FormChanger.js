"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jakub on 09.02.16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Gateway = require("trinity/Gateway");

var _Gateway2 = _interopRequireDefault(_Gateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Used for switching similar forms and copying it's data from form to form

var FormChanger = function () {
    function FormChanger() {
        _classCallCheck(this, FormChanger);
    }

    _createClass(FormChanger, null, [{
        key: "refreshForm",

        /**
         * Call the "url" to get a form which will be inserted into "parentElement".
         * After inserting the form the data from old form are copied to the new form.
         * The "afterFormChange" callback is called after the process.
         *
         * @param {Element}  parentElement    Element which will contain the form which will ge get from url
         * @param {string}   url              Url which will be used to get the form
         * @param {function} afterFormChange  Function which is called after the refreshing is done
         */
        value: function refreshForm(parentElement, url, afterFormChange) {
            //call api and get form
            _Gateway2.default.get(url, {}, function (response) {
                //save data from old form
                var oldHtml = parentElement.innerHTML;

                // If the element already contains a form
                // Change the form to the new form and copy the data
                if (oldHtml.includes("<form")) {
                    var oldForm = parentElement.getElementsByTagName("form")[0];

                    parentElement.innerHTML = response.text;
                    var newForm = parentElement.getElementsByTagName("form")[0];

                    //copy data to new form
                    FormChanger.copyFormData(oldForm, newForm);
                } else {
                    parentElement.innerHTML = response.text;
                }
                if (typeof afterFormChange === 'function') {
                    afterFormChange();
                }
            });
        }
    }, {
        key: "copyFormData",
        value: function copyFormData(oldForm, newForm) {
            var oldInputs = FormChanger.getFormInputs(oldForm);
            var newInputs = FormChanger.getFormInputs(newForm);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = newInputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var newFormInput = _step.value;

                    var newInputName = FormChanger.getShortInputName(newFormInput);

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = oldInputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var oldInput = _step2.value;

                            //if the input names are the same
                            if (newInputName !== "[_token]" && newInputName === FormChanger.getShortInputName(oldInput)) {
                                if ('checkbox' === newFormInput.getAttribute('type')) {
                                    newFormInput.checked = oldInput.checked;
                                } else {
                                    newFormInput.value = oldInput.value;
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "getShortInputName",
        value: function getShortInputName(formInput) {
            // e.g. free_product[name]
            var formInputFullName = formInput.getAttribute('name');

            var leftSquareBracketIndex = formInputFullName.indexOf('[');
            var rightSquareBracketIndex = formInputFullName.indexOf(']');

            // e.g name
            return formInputFullName.substr(leftSquareBracketIndex, rightSquareBracketIndex);
        }
    }, {
        key: "getFormInputs",
        value: function getFormInputs(form) {
            var inputs = Array.prototype.slice.call(form.getElementsByTagName("input"));
            var textAreas = Array.prototype.slice.call(form.getElementsByTagName("textarea"));
            var formName = form.getAttribute('name');
            var formTextAreas = [];
            var formInputs = [];

            inputs.forEach(function (input) {
                //check if the input contains id of the form
                if (input.getAttribute("id") && -1 !== input.getAttribute("id").indexOf(formName)) {
                    formInputs.push(input);
                }
            });

            textAreas.forEach(function (input) {
                //check if the input contains id of the form
                if (input.getAttribute("id") && -1 !== input.getAttribute("id").indexOf(formName)) {
                    formTextAreas.push(input);
                }
            });

            //convert node list of textareas and push it to the end of inputs
            return formInputs.concat(formTextAreas);
        }
    }]);

    return FormChanger;
}();

exports.default = FormChanger;