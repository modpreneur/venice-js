'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseController = require("./Controllers/BaseController.js");

var _BaseController2 = _interopRequireDefault(_BaseController);

var _BillingPlanController = require("./Controllers/BillingPlanController.js");

var _BillingPlanController2 = _interopRequireDefault(_BillingPlanController);

var _BlogArticleController = require("./Controllers/BlogArticleController.js");

var _BlogArticleController2 = _interopRequireDefault(_BlogArticleController);

var _ContentController = require("./Controllers/ContentController.js");

var _ContentController2 = _interopRequireDefault(_ContentController);

var _ProductAccessController = require("./Controllers/ProductAccessController.js");

var _ProductAccessController2 = _interopRequireDefault(_ProductAccessController);

var _ProductController = require("./Controllers/ProductController.js");

var _ProductController2 = _interopRequireDefault(_ProductController);

var _UserController = require("./Controllers/UserController.js");

var _UserController2 = _interopRequireDefault(_UserController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controllers = { "BaseController": _BaseController2.default, "BillingPlanController": _BillingPlanController2.default, "BlogArticleController": _BlogArticleController2.default, "ContentController": _ContentController2.default, "ProductAccessController": _ProductAccessController2.default, "ProductController": _ProductController2.default, "UserController": _UserController2.default };
exports.default = controllers;