import * as TYPES from '@/constants/types';
import CommonService from '@/services/CommonService';

/**
 * 发送短信验证码
 * @param commit
 * @param params
 * @returns {Promise.<void>}
 */
export async function sendVerification({commit}, params) {
    const response = await CommonService.sendVerification(params);
    return response.data;
}

/**
 * 获取所有用户类型
 * @returns {Promise.<{}>}
 */
export async function getTypes() {
    const response = await CommonService.getTypes();
    return response.data || {};
}

/**
 * 获取所有城市列表
 * @returns {Promise.<Array>}
 */
export async function getProvinces() {
    const provincesObj =  await CommonService.getProvinces();
    const provincesArr = [];

    for (let province of provincesObj.data) {
        provincesArr.push({
            key: province.code,
            value: province.name
        });
    }

    return provincesArr;
}

/**
 * 获取某个省份的所有城市
 * @param commit
 * @param params
 * @returns {Promise.<Array>}
 */
export async function getCitiesInProvinces({commit}, params) {
    const citiesObj =  await CommonService.getCitiesInProvinces(params);
    const citiesArr = [];

    for (let item of citiesObj.data.res) {
        citiesArr.push({
            key: item.mark,
            value: item.name
        });
    }

    return citiesArr;
}

/**
 * 获取所有支付类型
 * @returns {Promise.<{}>}
 */
export async function getPayTypes() {
    const response = await CommonService.getPayTypes();
    return response.data || {};
}

/**
 * 获取是否
 * @returns {Promise.<{}>}
 */
export async function getYesOrNo() {
    const response = await CommonService.getYesOrNo();
    return response.data || {};
}

/**
 * 当前用户
 * @param commit
 * @param currentUser
 */
export function updateCurrentUser({commit}, currentUser) {
    commit(TYPES.CURRENT_USER, currentUser);
}

/**
 * loading: true false
 * @param commit
 * @param loading
 */
export function loading({commit}, loading) {
    commit(TYPES.LOADING, loading);
}

/**
 * 图片预览
 * @param commit
 * @param imageInfo
 */
export function imageIsShowing({commit}, imageInfo) {
    commit(TYPES.IMAGE_INFO, imageInfo);
}

/**
 * 存储生物列表搜索条件
 * @param commit
 * @param encyListSearchName
 */
export function updateEncyListSearchName({commit}, encyListSearchName) {
    commit(TYPES.Ency_List_Search_Name, encyListSearchName);
}

/**
 * 保存一件开团信息
 * @param commit
 * @param addedBill
 */
export function updateAddedBillNameDate({commit}, addedBill) {
    commit(TYPES.Bill_Add_Name_Date, addedBill);
}

/**
 * 获取城市通过code
 * @param commit
 * @param params
 * @returns {Promise<*|{}>}
 */
export async function getCityByCode({commit}, params) {
    const response = await CommonService.getCityByCode(params);
    return response.data || {};
}
