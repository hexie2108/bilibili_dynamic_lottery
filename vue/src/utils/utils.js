import moment from 'moment';

/**
 * 判断是否为函数
 * @param {*} variable 
 * @returns {boolean}
 */
function is_function(variable) {
    return typeof variable === 'function';
}

/**
 * 判断对象是否为空
 * @param {object} obj 
 * @returns {boolean}
 */
function is_empty_object(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * 清空对象的所有属性
 * @param {object} obj 
 * @returns {void}
 */
function clear_object(obj) {
    // 使用 Object.keys() 方法清空对象实例的所有属性
    Object.keys(obj).forEach(key => {
        obj[key] = null;
    });
}

/**
 * 生成随机整数
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 解析日期时间字符串
 * @param {string} date_string 
 * @param {string} date_format 
 * @returns {Date|null}
 */
function parse_date_string(date_string, date_format = 'YYYY-MM-DD HH:mm:ss') {
    let result = null;
    if (date_string) {
        result = moment(date_string, date_format).toDate();
    }

    return result;
}

/**
 * 解析时间对象 转换成字符串
 * @param {Date|null} date 
 * @returns {string}
 */
function format_date_to_string(date) {

    let result = '';
    if (date instanceof Date) {
        result = moment(date).format('YYYY-MM-DD HH:mm:ss');
    }

    return result;


}

export {
    is_function,
    is_empty_object,
    clear_object,
    get_random_int,
    parse_date_string,
    format_date_to_string,
}