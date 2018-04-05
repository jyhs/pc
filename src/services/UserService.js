import Vue from 'vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    register(params = {}) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/register`, params);
    },

    login(params = {}) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/login`, params);
    },

    logout(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/logout`, params)
    },

    verifyForgetCode(params) {
          return Vue.axios.post(`${API_BASE_PATH}/api/users/forget`, params);
    },

    getCurrentUser() {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/current`);
    },

    getUserList({name, province, type1, type2, page = 1, size = 10}) {
        const params = {page, size};
        name && (params.name = name);
        province && (params.province = province);
        type1 && (params.type1 = type1);
        type2 && (params.type2 = type2);

        return Vue.axios.get(`${API_BASE_PATH}/api/users/list`, {params});
    },

    getUserListByManage({name, province, type1, type2, page = 1, size = 10}) {
        const params = {page, size};
        name && (params.name = name);
        province && (params.province = province);
        type1 && (params.type1 = type1);
        type2 && (params.type2 = type2);

        return Vue.axios.get(`${API_BASE_PATH}/api/users/manage/list`, {params});
    },

    getUserById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/get`, {
            params: {
                id
            }
        });
    },

    checkUsername({name}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/checkName`, {
            params: {
                name
            }
        });
    },

    updateUser(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/update`, params);
    },

    changePassword(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/changPassword`, params);
    },

    getUsersByType({type, city}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/getByType`, {
           params: {
               type,
               city
           }
        });
    },

    uploadUserAvatar(formData, progressCallback) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/upload`, formData, {
            onUploadProgress: progressEvent => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressCallback(percent);
            }
        });
    },

    uploadPayQrCode(formData, progressCallback) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/upload/pay`, formData, {
            onUploadProgress: progressEvent => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressCallback(percent);
            }
        });
    },

    getUserAvatar({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/get/logo`, {
            params: {
                id
            }
        });
    },

    getPayQrCode({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/get/pay`, {
            params: {
                id
            }
        });
    },

    updateUserPhone(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/users/bind/phone`, params);
    }
};