


//从env文件里读取API根目录地址
const API_ROOT_URL = import.meta.env.VITE_API_ROOT_URL;
// const ROOT_URL = window.location.origin + '/api/';

const API_ENDPOINT = {

    GET_DETAIL: 'get_detail',
    GET_COMMENT_LIST: 'get_comment_list',
    GET_FORWARD_LIST: 'get_forward_list',
    GET_LIKE_LIST: 'get_like_list',
    GET_REQUEST_STATUS: 'get_request_status',

    GET_LOGIN_URL: 'get_login_url',
    CHECK_LOGIN_STATUS: 'check_login_status',

    CHECK_IS_LOGGED_IN: 'check_is_logged_in',

    GET_LOGGED_USER_INFO: 'get_logged_user_info',
}

export { API_ROOT_URL, API_ENDPOINT }