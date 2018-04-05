import UserService from '@/services/UserService';

/**
 * 注册
 * @param commit
 * @param params
 * @returns {Promise.<*|{type, alias, describe}|{}>}
 */
export async function register({commit}, params) {
    const response = await UserService.register(params);
    return response.data || {};
}

/**
 * 登录
 * @param commit
 * @param params
 * @returns {Promise.<*|{type, alias, describe}|{}>}
 */
export async function login({commit}, params) {
    const response = await UserService.login(params);
    return response.data || {};
}

/**
 * 登出
 * @param commit
 * @param params
 * @returns {Promise.<*|{type, alias, describe}|{}>}
 */
export async function logout({commit}, params) {
    const response = await UserService.logout(params);
    return response.data || {};
}

/**
 * 验证忘记密码发送的短信验证码
 * @param commit
 * @param params
 * @returns {Promise.<void>}
 */
export async function verifyForgetCode({commit}, params) {
    const response = await UserService.verifyForgetCode(params);
    return response.data;
}

/**
 * 获取当前用户
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getCurrentUser({commit}) {
    const response = await UserService.getCurrentUser();
    return response.data || {};
}

/**
 * 获取用户列表
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUserList({commit}, params) {
    const response = await UserService.getUserList(params);
    return response.data || {};
}

/**
 * 管理人员获取用户列表
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUserListByManage({commit}, params) {
    const response = await UserService.getUserListByManage(params);
    return response.data || {};
}

/**
 * 通过id获取用户
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUserById({commit}, params) {
    const response = await UserService.getUserById(params);
    return response.data || {};
}

/**
 * 检查用户名是否重复
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function checkUsername({commit}, params) {
    const response = await UserService.checkUsername(params);
    return response.data || {};
}

/**
 * 更新用户
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function updateUser({commit}, params) {
    const response = await UserService.updateUser(params);
    return response.data || {};
}

/**
 * 管理员修改密码
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function changePassword({commit}, params) {
    const response = await UserService.changePassword(params);
    return response.data || {};
}

/**
 * 获取用户通过type
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUsersByType({commit}, params) {
    const response = await UserService.getUsersByType(params);
    return response.data || {};
}

/**
 * 上传用户头像
 * @param commit
 * @param formData
 * @param progressCallback
 * @returns {Promise.<{}>}
 */
export async function uploadUserAvatar({commit}, {formData, progressCallback}) {
    const response = await UserService.uploadUserAvatar(formData, progressCallback);
    return response.data || {};
}

/**
 * 上传用户支付二维码
 * @param commit
 * @param formData
 * @param progressCallback
 * @returns {Promise.<{}>}
 */
export async function uploadPayQrCode({commit}, {formData, progressCallback}) {
    const response = await UserService.uploadPayQrCode(formData, progressCallback);
    return response.data || {};
}

/**
 * 获取用户头像路径
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUserAvatar({commit}, params) {
    const response = await UserService.getUserAvatar(params);
    return response.data || {};

}

/**
 * 获取用户支付二维码
 * @param commit
 * @param parmas
 * @returns {Promise.<{}>}
 */
export async function getPayQrCode({commit}, parmas) {
    const response = await UserService.getPayQrCode(parmas);
    return response.data || {};
}

/**
 * 更新用户电话
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function updateUserPhone({commit}, params) {
    const response = await UserService.updateUserPhone(params);
    return response.data || {};
}