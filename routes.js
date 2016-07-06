'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fisa on 7/23/15.
 */

exports.default = [{
    path: '/admin/product(/)',
    action: 'Product.index'
}, {
    path: '/admin/product/new(/)',
    action: 'Product.new'
}, {
    path: '/admin/product/tabs/:id(/)',
    action: 'Product.tabs'
}, {
    path: '/admin/product/content-product/tabs/:id',
    action: 'Product.contentProductTabs'
}, {
    path: '/admin/blogArticle/tabs/:id(/)',
    action: 'BlogArticle.tabs'
}, {
    path: '/admin/blogArticle/new(/)',
    action: 'BlogArticle.new'
}, {
    path: '/admin/blogArticle(/)',
    action: 'BlogArticle.index'
}, {
    path: '/admin/content/tabs/:id(/)',
    action: 'Content.tabs'
}, {
    path: '/admin/content(/)',
    action: 'Content.index'
}, {
    path: '/admin/content/content-product/tabs/:id(/)',
    action: 'Content.contentProductTabs'
}, {
    path: '/admin/content/new(/)',
    action: 'Content.new'
}, {
    path: '/admin/content/new/group(/)',
    action: 'Content.newGroup'
}, {
    path: '/admin/content/:id/content-product/new(/)',
    action: 'Content.newContentProduct'
}, {
    path: '/admin/product/:id/content-product/new(/)',
    action: 'Product.newContentProduct'
}, {
    path: '/admin/user(/)',
    action: 'User.index'
}, {
    path: '/admin/user/tabs/:id(/)',
    action: 'User.tabs'
}, {
    path: '/admin/billing-plan/tabs/:id(/)',
    action: 'BillingPlan.tabs'
}, {
    path: '/admin/billing-plan/new/:id(/)',
    action: 'BillingPlan.new'
}, {
    path: '/admin/product-access/tabs/:id(/)',
    action: 'ProductAccess.tabs'
}];