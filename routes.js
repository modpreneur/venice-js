/**
 * Created by fisa on 7/23/15.
 */

export default [
    {
        path: '/admin/product(/)',
        action: 'Product.index'
    }, {
        path: '/admin/product/new(/)',
        action: 'Product.new'
    }, {
        path: '/admin/product/tabs/:id(/)',
        action: 'Product.tabs'
    },
    {
        path: '/admin/product/content-product/tabs/:id',
        action: 'Product.contentProductTabs'
    },
    {
        path: '/admin/blog',
        action: 'Blog.tabs'
    },
    {
        path: '/admin/blog/article/tabs/:id(/)',
        action: 'BlogArticle.tabs'
    },
    {
        path: '/admin/blog/article/new(/)',
        action: 'BlogArticle.new'
    },
    {
        path: '/admin/blog/article(/)',
        action: 'BlogArticle.index'
    },
    {
        path: '/admin/blog/category/tabs/:id(/)',
        action: 'Category.tabs'
    },
    {
        path: '/admin/blog/category/new(/)',
        action: 'Category.new'
    },
    {
        path: '/admin/blog/category(/)',
        action: 'Category.index'
    },{
        path: '/admin/blog/tag/tabs/:id(/)',
        action: 'Tag.tabs'
    },
    {
        path: '/admin/blog/tag/new(/)',
        action: 'Tag.new'
    },
    {
        path: '/admin/blog/tag(/)',
        action: 'Tag.index'
    },
    {
        path: '/admin/content/tabs/:id(/)',
        action: 'Content.tabs'
    },
    {
        path: '/admin/content(/)',
        action: 'Content.index'
    },
    {
        path: '/admin/content/content-product/tabs/:id(/)',
        action: 'Content.contentProductTabs'
    },
    {
        path: '/admin/content/new(/)',
        action: 'Content.new'
    },
    {
        path: '/admin/content/new/group(/)',
        action: 'Content.newGroup'
    },
    {
        path: '/admin/content/:id/content-product/new(/)',
        action: 'Content.newContentProduct'
    },
    {
        path: '/admin/product/:id/content-product/new(/)',
        action: 'Product.newContentProduct'
    },
    {
        path: '/admin/user(/)',
        action: 'User.index'
    },
    {
        path: '/admin/user/tabs/:id(/)',
        action: 'User.tabs'
    },
    {
        path: '/admin/billing-plan/tabs/:id(/)',
        action: 'BillingPlan.tabs'
    },
    {
        path: '/admin/billing-plan/new/:id(/)',
        action: 'BillingPlan.new'
    },
    {
        path: '/admin/product-access/tabs/:id(/)',
        action: 'ProductAccess.tabs'
    },
    {
        path: '/admin/logger(/)(:tab)',
        action: 'Logger.tab'
    }
];

