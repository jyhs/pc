import BillService from '@/services/BillService';

/**
 * 上传订货单
 * @param commit
 * @param formData
 * @returns {Promise.<{}>}
 */
export async function uploadBillFile({commit}, formData) {
    const response = await BillService.uploadBillFile(formData);
    return response.data || {};
}

/**
 * 获取订货单列表
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getBillList({commit}, params) {
    const response = await BillService.getBillList(params);
    return response.data || {};
}

/**
 * 获取出货单通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getBillById({commit}, params) {
    const response = await BillService.getBillById(params);
    return response.data || {};
}

/**
 * 删除出货单通过id和userId
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function deleteBillByIdAndUserId({commit}, params) {
    const response = await BillService.deleteBillByIdAndUserId(params);
    return response.data || {};
}

/**
 * 更新出货单通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function updateBillById({commit}, params) {
    const response = await BillService.updateBillById(params);
    return response.data || {};
}

/**
 * 获取出货单名字根据id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getDetailsByBillId({commit}, params) {
    const response = await BillService.getDetailsByBillId(params);
    return response.data || {};
}

/**
 * 删除明细通过billId及userId
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function deleteDetailByIdAndUserIdAndBillId({commit}, params) {
    const response = await BillService.deleteDetailByIdAndUserIdAndBillId(params);
    return response.data || {};
}

/**
 * 添加明细通过billId及userId
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function addDetailByBillIdAndUserId({commit}, params) {
    const response = await BillService.addDetailByBillIdAndUserId(params);
    return response.data || {};
}

/**
 * 获取明细通过id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getDetailById({commit}, params) {
    const response = await BillService.getDetailById(params);
    return response.data || {};
}

/**
 * 编辑明细通多id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function updateDetailById({commit}, params) {
    const response = await BillService.updateDetailById(params);
    return response.data || {};
}
