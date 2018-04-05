import Vue from 'vue';
import {API_BASE_PATH} from '@/constants/index';

export default {
    uploadImage(formData, progressCallback) {
        return Vue.axios.post(`${API_BASE_PATH}/api/material/upload`, formData, {
            onUploadProgress: progressEvent => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                progressCallback(percent);
            }
        });
    },

    getCategories() {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/category`);
    },

    getTypesByCategoryCode({categoryCode}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/types`, {
            params: {
                pc: categoryCode
            }
        });
    },

    getCompatibilities() {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/compatibility`);
    },

    getLevels() {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/level`);
    },

    getEncyById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/get`, {
            params: {
                id
            }
        });
    },

    getEncyList({name, type, page = 1, size = 10}) {
        const params = {page, size};
        name && (params.name = name);
        type && (params.type = type);

        return Vue.axios.get(`${API_BASE_PATH}/api/material/list`, {params});
    },

    addEncy(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/material/add`, params);
    },

    deleteEncy({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/delete`, {
            params: {id}
        })
    },

    getImagesByEncyId({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/imageList`, {
            params: {id}
        })
    },

    deleteImageByEncyId(params) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/deleteImage`, {params});
    },

    checkEncyName({name}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/checkName`, {
            params: {
                name
            }
        });
    },

    updateEncy(params) {
        return Vue.axios.post(`${API_BASE_PATH}/api/material/update`, params);
    },

    getEncyRandomList({number}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/random/list`, {
            params: {number}
        });
    },

    getEncyRandomImage() {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/random/image`);
    },

    getEncyImageById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/image`, {
            params: {id}
        });
    },

    getEncyImagesById({id}) {
        return Vue.axios.get(`${API_BASE_PATH}/api/material/imageList`, {
            params: {id}
        })
    }
}