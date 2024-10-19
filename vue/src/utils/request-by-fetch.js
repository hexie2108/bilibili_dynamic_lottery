import { is_empty_object, is_function } from "./utils";



/**
 * 通过 fetch 发送请求
 * @param {string} method 
 * @param {string} url 
 * @param {object} data 
 * @param {function|null} pre_callback 
 * @param {function|null} done_callback 
 * @param {function|null} fail_callback 
 * @param {function|null} always_callback 
 */
function request_by_fetch(method, url, data, pre_callback, done_callback, fail_callback, always_callback) {

    // 如果存在前置回调
    if (is_function(pre_callback)) {
        pre_callback();
    }

    let fetchOptions = {
        method,
        credentials: 'include', //请求需要包含cookie 才能跟踪查询请求进度
    };

    //如果有请求参数
    if (is_empty_object(data) === false) {
        // 如果是 GET 请求 
        if (method === 'GET') {

            //把请求参数加入到url里
            const url_object = new URL(url);
            url_object.search = new URLSearchParams(data).toString();
            url = url_object.toString();
        }
        // 如果是 POST 或 PUT 请求，设置请求体
        else if (method === 'POST' || method === 'PUT') {
            fetchOptions.headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(data);
        }
    }


    fetch(url, fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //如果回复里包含了code 并且不是200 
            if (data instanceof Object && data.code && data.code !== 200) {
                //抛出错误
                throw new Error(data.message);
            }
            if (is_function(done_callback)) {
                done_callback(data);
            }
        })
        .catch(error => {
            if (is_function(fail_callback)) {
                fail_callback(error);
            } else {
                console.error('Fetch error:', error);
            }
        })
        .finally(() => {
            if (is_function(always_callback)) {
                always_callback();
            }
        });
}

/**
 * 发送GET请求
 * @param {string} url 
 * @param {object} data 
 * @param {function|null} pre_callback 
 * @param {function|null} done_callback 
 * @param {function|null} fail_callback 
 * @param {function|null} always_callback 
 */
function get_by_fetch(url, data, pre_callback = null, done_callback = null, fail_callback = null, always_callback = null) {
    request_by_fetch(
        'GET',
        url,
        data,
        pre_callback,
        done_callback,
        fail_callback,
        always_callback
    );
}


export { get_by_fetch }