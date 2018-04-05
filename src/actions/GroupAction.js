import GroupService from '@/services/GroupService';

/**
 * 添加团购通过billId及userId
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function addGroupByBillIdAndUserId({commit}, params) {
    const response = await GroupService.addGroupByBillIdAndUserId(params);
    return response.data || {};
}

/**
 * 获取团购列表
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getGroupList({commit}, params) {
    const response = await GroupService.getGroupList(params);
    return response.data || {};
}

/**
 * 获取团购通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getGroupById({commit}, params) {
    const response = await GroupService.getGroupById(params);
    return response.data || {};
}

/**
 * 结束团购清单根据id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function finishGroupByIdAndUserId({commit}, params) {
    const response = await GroupService.finishGroupByIdAndUserId(params);
    return response.data || {};
}

/**
 * 重新开始团单
 * @param commit
 * @param params
 * @returns {Promise.<void>}
 */
export async function reopenGroupByIdAndUserId({commit}, params) {
    const response = await GroupService.reopenGroupByIdAndUserId(params);
    return response.data;
}

/**
 * 删除团单根据id
 * @param commit
 * @param params
 * @returns {Promise.<void>}
 */
export async function deleteGroupById({commit}, params) {
    const response = await GroupService.deleteGroupById(params);
    return response.data;
}

/**
 * 更新团购清单
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function updateGroup({commit}, params) {
    const response = await GroupService.updateGroup(params);
    return response.data || {};
}

/**
 * 获取已团购金额通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getCountById({commit}, params) {
    const response = await GroupService.getCountById(params);
    return response.data || {};
}

/**
 * 下载用户团单
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function downloadGroupByIdAndUserId({commit}, params) {
    const response = await GroupService.downloadGroupByIdAndUserId(params);
    return response.data || {};
}

/**
 * 获取QrCode通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getQrCodeByGroupId({commit}, params) {
    const response = await GroupService.getQrCodeByGroupId(params);
    return response.data || {};
}