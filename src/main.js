import "babel-polyfill";
import Vue from 'vue';
import ElementUI, {Message, Notification} from 'element-ui';
import Axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store/';
import 'element-ui/lib/theme-default/index.css';
import './fonts/iconfont.css';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(VueAxios, Axios);

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        const queryParams = window.location.hash.split('?')[1];
        if (queryParams && queryParams.indexOf('private') !== -1) {
            window.sessionStorage.setItem('SEAWATER_TO_PRIVATE', queryParams.split('=')[1]);
        }
        const Authorization = window.localStorage.getItem('Authorization');
        if (Authorization) {
            next();
        } else {
            Message({
                message: '请先登录',
                type: 'error',
                duration: 5000
            });
            next({
                path: '/login'
            })
        }
    }
    else {
        next();
    }
});

// http request 拦截器
Axios.interceptors.request.use(
    config => {
        let accept = window.location.host.split('.')[0];
        if (accept.indexOf('localhost') !== -1) {
            accept = 'www';
        }
        //const accept = 'blueocean';
        //const accept = 'www';
        config.headers.Authorization = window.localStorage.getItem('Authorization');
        config.headers.Accept = accept;
        window.localStorage.setItem('SEAWATER_ACCEPT', accept);
        return config;
    },
    error => {
        Message({
            message: '未知错误，请稍后重试',
            type: 'error',
            duration: 3000
        });
        return Promise.reject(error);
    }
);

// http response 拦截器
Axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const {response} = error;
        const errorCodes = [502, 503, 504];
        const logoutCodes = [401];
        if (errorCodes.includes(response.status)) {
            Message({
                message: '服务器繁忙，请稍后重试',
                type: 'error',
                duration: 3000
            });
        } else if (logoutCodes.includes(response.status)) {
            Message({
                message: '请重新登录',
                type: 'error',
                duration: 3000
            });
            window.localStorage.removeItem('Authorization');
            window.localStorage.removeItem('SEAWATER_USER_ID');
            router.push({name: 'login'});
        } else {
            console.log(response.data);
            if (response.data.statusCode === 400) {
                Notification({
                    message: response.data.message,
                    type: 'error',
                    duration: 0,
                    offset: 100
                });
            } else {
                Message({
                    message: response.data.message,
                    type: 'error',
                    duration: 3000
                });
            }
        }

        return Promise.reject(error);
    }
);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
