import EncyService from '@/services/EncyService';

/**
 * 上传图片
 * @param commit
 * @param formData
 * @param progressCallback
 * @returns {Promise.<{}>}
 */
export async function uploadImage({commit}, {formData, progressCallback}) {
    const response = await EncyService.uploadImage(formData, progressCallback);
    return response.data || {};
}

/**
 * 获取分类
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getCategories({commit}) {
    const response = await EncyService.getCategories();
    return response.data || {};
}

/**
 * 获取小类通过分类id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getTypesByCategoryCode({commit}, params) {
    const response = await EncyService.getTypesByCategoryCode(params);
    return response.data || {};
}

/**
 * 获取兼容性
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getCompatibilities({commit}) {
    const response = await EncyService.getCompatibilities();
    return response.data || {};
}

/**
 * 获取饲养难度
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getLevels({commit}) {
    const response = await EncyService.getLevels();
    return response.data || {};
}

/**
 * 通过id获取生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyById({commit}, params) {
    const response = await EncyService.getEncyById(params);
    return response.data || {};
}

/**
 * 获取生物资料
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyList({commit}, params) {
    const response = await EncyService.getEncyList(params);
    return response.data || {};
}

/**
 * 添加生物时检查生物名是否重复
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function checkEncyName({commit}, params) {
    const response = await EncyService.checkEncyName(params);
    return response.data || {};
}

/**
 * 添加生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function addEncy({commit}, params) {
    const response = await EncyService.addEncy(params);
    return response.data || {};
}

/**
 * 删除生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function deleteEncy({commit}, params) {
    const response = await EncyService.deleteEncy(params);
    return response.data || {};
}

/**
 * 获取生物对应的图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getImagesByEncyId({commit}, params) {
    const response = await EncyService.getImagesByEncyId(params);
    return response.data || {};
}

/**
 * 删除生物图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function deleteImageByEncyId({commit}, params) {
    const response = await EncyService.deleteImageByEncyId(params);
    return response.data || {};
}

/**
 * 更新生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function updateEncy({commit}, params) {
    const response = await EncyService.updateEncy(params);
    return response.data || {};
}

/**
 * 随机获取生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyRandomList({commit}, params) {
    const response = await EncyService.getEncyRandomList(params);
    return response.data || {};
}

/**
 * 获取一张图片
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getEncyRandomImage({commit}) {
    const response = await EncyService.getEncyRandomImage();
    return response.data || {};
}

/**
 * 获取某生物的一张图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyImageById({commit}, params) {
    const response = await EncyService.getEncyImageById(params);
    return response.data || {};
}

/**
 * 获取某生物的所有图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyImagesById({commit}, params) {
    const response = await EncyService.getEncyImagesById(params);
    return response.data || {};
}
