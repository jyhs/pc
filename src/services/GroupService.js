import Vue from 'vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    addGroupByBillIdAndUserId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/group/add`, params);
    },

    getGroupList({name, userId, province, page = 1, size = 10}) {
        const params = {
            page,
            size
        };
        name && (params.name = name);
        userId && (params.user_id = userId);
        province && (params.province = province);

        return Vue.axios.get(`${API_BASE_PATH}/api/group/list`, {params});
    },

    getGroupById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/group/get`, {
            params: {
                id
            }
        });
    },

    finishGroupByIdAndUserId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/group/finish`, params);
    },

    reopenGroupByIdAndUserId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/group/reopen`, params);
    },

    deleteGroupById(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/group/delete`, params);
    },

    updateGroup(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/group/update`, params);
    },

    getCountById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/group/count`, {
            params: {
                id
            }
        });
    },

    downloadGroupByIdAndUserId(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/group/dowload`, params);
    },

    getQrCodeByGroupId(params) {
        return Vue.axios.get(`${API_BASE_PATH}/api/group/get/private/qr`, {
            params
        });
    }
};