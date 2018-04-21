import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const login = r => require.ensure([], () => r(require('@/page/user/login/index')), 'login');
const register = r => require.ensure([], () => r(require('@/page/user/register/index')), 'register');
const passForget = r => require.ensure([], () => r(require('@/page/password/index')), 'passForget');
const userList = r => require.ensure([], () => r(require('@/page/user/list/index')), 'userList');
const recentSellerList = r => require.ensure([], () => r(require('@/page/user/seller/recent/index')), 'recentSellerList');
const provinceSellerList = r => require.ensure([], () => r(require('@/page/user/seller/province/index')), 'provinceSellerList');
const userEdit = r => require.ensure([], () => r(require('@/page/user/edit/index')), 'userEdit');
const userRePass = r => require.ensure([], () => r(require('@/page/user/rePass/index')), 'userRePass');
const userDistribute = r => require.ensure([], () => r(require('@/page/user/distribute/index')), 'userDistribute');
const userDetail = r => require.ensure([], () => r(require('@/page/user/detail/index')), 'userDetail');
const encyList = r => require.ensure([], () => r(require('@/page/ency/list/index')), 'encyList');
const encyAdd = r => require.ensure([], () => r(require('@/page/ency/add/index')), 'encyAdd');
const encyPicture = r => require.ensure([], () => r(require('@/page/ency/picture/index')), 'encyPicture');
const encyEdit = r => require.ensure([], () => r(require('@/page/ency/edit/index')), 'userEdit');
const encyDetail = r => require.ensure([], () => r(require('@/page/ency/detail/index')), 'encyDetail');
const billAdd = r => require.ensure([], () => r(require('@/page/bill/add/index')), 'billAdd');
const billList = r => require.ensure([], () => r(require('@/page/bill/list/index')), 'billList');
const billEdit = r => require.ensure([], () => r(require('@/page/bill/edit/index')), 'billEdit');
const billDetail = r => require.ensure([], () => r(require('@/page/bill/detail/index')), 'billDetail');
const detailList = r => require.ensure([], () => r(require('@/page/detail/list/index')), 'detailList');
const detailAdd = r => require.ensure([], () => r(require('@/page/detail/add/index')), 'detailAdd');
const detailEdit = r => require.ensure([], () => r(require('@/page/detail/edit/index')), 'detailEdit');
const groupList = r => require.ensure([], () => r(require('@/page/group/list/index')), 'groupList');
const groupAdd = r => require.ensure([], () => r(require('@/page/group/add/index')), 'groupAdd');
const groupEdit = r => require.ensure([], () => r(require('@/page/group/edit/index')), 'groupEdit');
const groupDetail = r => require.ensure([], () => r(require('@/page/group/detail/index')), 'groupDetail');
const cartList = r => require.ensure([], () => r(require('@/page/cart/list/index')), 'cartList');
const cartEdit = r => require.ensure([], () => r(require('@/page/cart/edit/index')), 'cartEdit');
const cartDetail = r => require.ensure([], () => r(require('@/page/cart/detail/index')), 'cartDetail');
const cartGroup = r => require.ensure([], () => r(require('@/page/cart/group/index')), 'cartGroup');
const mainPage = r => require.ensure([], () => r(require('@/page/my/main/index')), 'mainPage');
const buyPage = r => require.ensure([], () => r(require('@/page/my/buy/index')), 'buyPage');
const myCarts = r => require.ensure([], () => r(require('@/page/my/carts/index')), 'myCarts');
const myBills = r => require.ensure([], () => r(require('@/page/my/bills/index')), 'myBills');
const myGroups = r => require.ensure([], () => r(require('@/page/my/groups/index')), 'myGroups');
const mySetting = r => require.ensure([], () => r(require('@/page/my/setting/index')), 'mySetting');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const about = r => require.ensure([], () => r(require('@/page/about/index')), 'explain');
const aboutFirst = r => require.ensure([], () => r(require('@/page/about/first')), 'aboutFirst');
const aboutSecond = r => require.ensure([], () => r(require('@/page/about/second')), 'aboutSecond');
const aboutThird = r => require.ensure([], () => r(require('@/page/about/third')), 'aboutThird');
const aboutFourth = r => require.ensure([], () => r(require('@/page/about/fourth')), 'aboutFourth');
const wechatEncyList = r => require.ensure([], () => r(require('@/page/wechat/encyList/index')), 'wechatEncyList');

const routes = [
	{
		path: '/login',
		component: login,
        name: 'login'
	}, {
		path: '/register',
        component: register,
        name: 'register'
	}, {
        path: '/forget/pass',
        component: passForget,
        name: 'passForget'
    }, {
		path: '/',
		component: manage,
		children: [{
            path: '/user/list',
            component: userList,
            name: 'userList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/seller/recent/list',
            component: recentSellerList,
            name: 'recentSellerList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/seller/province/list',
            component: provinceSellerList,
            name: 'provinceSellerList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/user/:id/edit',
            component: userEdit,
            name: 'userEdit',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/user/reset/:id/pass',
            component: userRePass,
            name: 'userRePass',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/user/distribute',
            component: userDistribute,
            name: 'userDistribute',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/user/:id/detail',
            component: userDetail,
            name: 'userDetail',
            meta: {
                //requireAuth: true
            }
        }, {
			path: '',
			component: mainPage,
            name: 'mainPage',
            meta: {
                breadcrumb: [],
                //requireAuth: true
            }
		}, {
            path: '/ency/list',
            component: encyList,
            name: 'encyList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/ency/add',
            component: encyAdd,
            name: 'encyAdd',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/ency/:id/:category/:code/pictures',
            component: encyPicture,
            name: 'encyPicture',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/ency/:id/edit',
            component: encyEdit,
            name: 'encyEdit',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/ency/:id/detail',
            component: encyDetail,
            name: 'encyDetail',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/bill/add',
            component: billAdd,
            name: 'billAdd',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/bill/list',
            component: billList,
            name: 'billList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/bill/:id/edit',
            component: billEdit,
            name: 'billEdit',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/bill/:id/detail',
            component: billDetail,
            name: 'billDetail',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/bill/:id/detail/list',
            component: detailList,
            name: 'detailList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/bill/:id/detail/add',
            component: detailAdd,
            name: 'detailAdd',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/bill/:billId/detail/:detailId/edit',
            component: detailEdit,
            name: 'detailEdit',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/group/list',
            component: groupList,
            name: 'groupList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/bill/:id/group/add',
            component: groupAdd,
            name: 'groupAdd',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/group/:id/edit',
            component: groupEdit,
            name: 'groupEdit',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/group/:id/detail',
            component: groupDetail,
            name: 'groupDetail',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/:id/cart/list',
            component: cartList,
            name: 'cartList',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/cart/:id/edit',
            component: cartEdit,
            name: 'cartEdit',
            meta: {
                requireAuth: true
            }
        }, {
            path: '/cart/:id/detail',
            component: cartDetail,
            name: 'cartDetail',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/group/:groupId/user/:userId/cart',
            component: cartGroup,
            name: 'cartGroup',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/buy/:groupId/page',
            component: buyPage,
            name: 'buyPage',
            meta: {
                requireAuth: true,
            }
        }, {
            path: '/myCarts',
            component: myCarts,
            name: 'myCarts',
            meta: {
                requireAuth: true,
            }
        }, {
            path: '/myGroups',
            component: myGroups,
            name: 'myGroups',
            meta: {
                requireAuth: true,
            }
        }, {
            path: '/myBills',
            component: myBills,
            name: 'myBills',
            meta: {
                requireAuth: true,
            }
        }, {
            path: '/mySetting',
            component: mySetting,
            name: 'mySetting',
            meta: {
                requireAuth: true,
            }
        }, {
			path: '/about',
			component: about,
            name: 'about',
            meta: {
                //requireAuth: true
            }
		}, {
            path: '/aboutFirst',
            component: aboutFirst,
            name: 'aboutFirst',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/aboutSecond',
            component: aboutSecond,
            name: 'aboutSecond',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/aboutThird',
            component: aboutThird,
            name: 'aboutThird',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/aboutFourth',
            component: aboutFourth,
            name: 'aboutFourth',
            meta: {
                //requireAuth: true
            }
        }, {
            path: '/wechat/encyList/:type',
            component: wechatEncyList,
            name: 'wechatEncyList',
            meta: {
                //requireAuth: true
            }
        }]
	}
];

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
