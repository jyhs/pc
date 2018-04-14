export const toFormData = (params) => {
    const formData = new FormData();
    for (let key of Object.keys(params)) {
        formData.append(key, params[key]);
    }

    return formData;
};

const randomString = (len = 8) => {
    //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let randomPassword = '';

    for (let i = 0; i < len; i++) {
        randomPassword += $chars.charAt(Math.floor(Math.random() * maxPos));
    }

    return randomPassword;
};

const formatDate = (date) => {
    const dateTime = new Date(date);
    const month = (dateTime.getMonth() + 1) < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1;
    const day = dateTime.getDate() < 10 ? `0${dateTime.getDate()}` : dateTime.getDate();

    return `${dateTime.getFullYear()}${month}${day}235959`;
};

/**
 * 判断是否为空，包括null, undefined, '', {}, []等
 */
export const isEmpty = (val) => {
    if (!val && val !== 0) {
        return true;
    } else if (typeof val === 'string' && !val.trim()) {
        return true;
    } else if (Array.prototype.isPrototypeOf(val) && val.length === 0) {
        return true;
    } else if (Object.prototype.isPrototypeOf(val) && Object.keys(val).length === 0) {
        return true;
    }

    return false;
};

/**
 * 判断localStorage中是否有key
 */
export const localStorageHasKey = (key) => {
    return !isEmpty(window.localStorage.getItem(key));
};

/**
 * 存入localStorage
 */
export const saveToLocalStorage = (key, obj) => {
    if (!isEmpty(obj)) {
        window.localStorage.setItem(key, JSON.stringify(obj));
    }
};

/**
 * 从localStorage取出并解析
 * @param key
 */
export const getFromLocalStorage = (key) => {
    return JSON.parse(window.localStorage.getItem(key));
};

/**
 * 匹配code-name
 * @param code
 * @param items
 * @returns {string}
 */
export const mapCode = (code, items) => {
    for (let item of items) {
        if (item.code === code) {
            return item.name;
        }
    }

    return '';
};

/**
 * 匹配key-value
 * @param key
 * @param items
 * @returns {string}
 */
export const mapKey = (key, items) => {
    for (let item of items) {
        if (item.key === key) {
            return item.value;
        }
    }

    return '';
};

/**
 * 构建时间参数格式
 * @param date
 * @returns {string}
 */
export const formatDateParam = (date) => {
    let dateDate;
    if (typeof date === 'string') {
        dateDate = new Date(date);
    } else {
        dateDate = date;
    }
    const month = (dateDate.getMonth() + 1) < 10 ? `0${dateDate.getMonth() + 1}` : dateDate.getMonth() + 1;
    const day = dateDate.getDate() < 10 ? `0${dateDate.getDate()}` : dateDate.getDate();

    return `${dateDate.getFullYear()}${month}${day}235959`;
};

/**
 * 构建时间参数格式
 * @param date
 * @returns {string}
 */
export const formatDateTimeParam = (date) => {
    let dateDate;
    if (typeof date === 'string') {
        dateDate = new Date(date);
    } else {
        dateDate = date;
    }
    const month = (dateDate.getMonth() + 1) < 10 ? `0${dateDate.getMonth() + 1}` : dateDate.getMonth() + 1;
    const day = dateDate.getDate() < 10 ? `0${dateDate.getDate()}` : dateDate.getDate();
    const hour = dateDate.getHours() < 10 ? `0${dateDate.getHours()}` : dateDate.getHours();
    const min = dateDate.getMinutes() < 10 ? `0${dateDate.getMinutes()}` : dateDate.getMinutes();
    const second = dateDate.getSeconds() < 10 ? `0${dateDate.getSeconds()}` : dateDate.getSeconds();

    return `${dateDate.getFullYear()}${month}${day}${hour}${min}${second}`;
};

/**
 * 代码触发click事件
 * @param id
 */
export const fireClickEventById = id => {
    const fireOnThis = document.getElementById(id);
    const evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent('click', true, true, window, 1, 12, 345, 7, 220, false, false, true, false, 0, null);
    fireOnThis.dispatchEvent(evObj);
};

/**
 * @param code
 * @returns {string}
 */
export const compile = (code) => {
    let c = String.fromCharCode(code.charCodeAt(0)+code.length);
    for(let i = 1; i < code.length; i++){
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    c = escape(c.split('').join(' '));
    return c;
};

/**
 * @param code
 * @returns {string}
 */
export const uncompile = (code) => {
    code = unescape(code).split(' ').join('');
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for(let i = 1; i < code.length; i++){
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
};

export const mapFunctions = {
    mapCode,
    mapKey
};

export default {
    randomString,
    formatDate,
}
