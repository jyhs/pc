import Vue from 'vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    getCartById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/get`, {
            params: {
                id
            }
        })
    },

    getCartsByUserId({userId, page = 1, size = 10}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/list`, {
            params: {
                user_id: userId,
                page: page,
                size: size
            }
        });
    },

    getCartByGroupIdAndUserId({groupId, userId}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/get/groupId/userId`, {
            params: {
                group_bill_id: groupId,
                user_id: userId
            }
        });
    },

    getCartUnderUserByGroupId({groupId, userId}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/get/groupIdAndUserId`, {
            params: {
                group_bill_id: groupId,
                user_id: userId
            }
        });
    },

    addCart(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/add`, params);
    },

    updateCart(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/update`, params);
    },

    addDetailToCart(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/add/detail`, params);
    },

    getDetailsByCartId({cartId, page = 1, size = 1000}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/list/detail`, {
            params: {
                cart_id: cartId,
                page,
                size
            }
        })
    },

    updateCartDetail(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/update/detail`, params);
    },

    subDetailById(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/sub/detail`, params);
    },

    getCartCountById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/count`, {
            params: {
                id
            }
        });
    },

    deleteDetailById(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/delete/detail`, params);
    },

    deleteCartById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/cart/delete`, {
            params: {
                id
            }
        });
    },

    checkCartDetail(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/cart/check/detail`, params);
    }
}