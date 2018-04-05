import Vue from 'vue';
import Vuex from 'vuex';
import * as TYPES from '@/constants/types';
import * as CommonAction from '@/actions/CommonAction';
import * as UserAction from '@/actions/UserAction';
import * as EncyAction from '@/actions/EncyAction';
import * as BillAction from '@/actions/BillAction';
import * as GroupAction from '@/actions/GroupAction';
import * as CartAction from '@/actions/CartAction';

Vue.use(Vuex);

const state = {
    currentUser: {},
    loading: false,
    imageInfo: {
        show: false,
        path: ''
    }
};

const getters = {
    currentUser(state) {
        return state.currentUser;
    },

    loading(state) {
        return state.loading;
    },

    imageInfo(state) {
        return state.imageInfo;
    }
};

const mutations = {
    [TYPES.CURRENT_USER](state, currentUser) {
        state.currentUser = currentUser;
    },

    [TYPES.LOADING](state, loading) {
        state.loading = loading;
    },

    [TYPES.IMAGE_INFO](state, imageInfo) {
        state.imageInfo = imageInfo;
    }
};

const actions = {
    ...CommonAction,
    ...UserAction,
    ...EncyAction,
    ...BillAction,
    ...GroupAction,
    ...CartAction
};

export default new Vuex.Store({
	state,
    getters,
    mutations,
    actions
});