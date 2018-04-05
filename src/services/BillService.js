import Vue from 'vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    uploadBillFile(formData) {
        return Vue.axios.post(`${API_BASE_PATH}/api/bill/upload`, formData);
    },

    getBillList({name, page = 1, size = 10, userId}) {
        const params = {page, size};
        name && (params.name = name);
        userId && (params.user_id = userId);

        return Vue.axios.get(`${API_BASE_PATH}/api/bill/list`, {params});
    },

    getBillById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/bill/get`, {
            params: {
                id
            }
        });
    },

    deleteBillByIdAndUserId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/bill/delete`, params);
    },

    updateBillById(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/bill/update`, params);
    },

    getDetailsByBillId({id, name}) {
        const params = {id};
        name && (params.name = name);

        return Vue.axios.get(`${API_BASE_PATH}/api/bill/detail`, {params});
    },

    deleteDetailByIdAndUserIdAndBillId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/bill/delete/detail`, params);
    },

    addDetailByBillIdAndUserId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/bill/add/detail`, params);
    },

    getDetailById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/bill/get/detail`, {
            params: {
                id
            }
        });
    },

    updateDetailById(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/bill/update/detail`, params);
    }
}