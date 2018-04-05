import Vue from 'vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    sendVerification(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/tools/send/verification`, params);
    },

    getTypes() {
        return Vue.axios.get(`${API_BASE_PATH}/api/users/types`);
    },

    getProvinces() {
        return Vue.axios.get(`${API_BASE_PATH}/api/tools/provinces`);
    },

    getCitiesInProvinces({area}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/tools/citys?`, {
            params: {
                area
            }
        });
    },

    getPayTypes() {
        return Vue.axios.get(`${API_BASE_PATH}/api/tools/paytype`);
    },

    getYesOrNo() {
        return Vue.axios.get(`${API_BASE_PATH}/api/tools/yesno`);
    }
};