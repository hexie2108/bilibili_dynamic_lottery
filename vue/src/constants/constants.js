


//从env文件里读取API根目录地址
const API_ROOT_URL = import.meta.env.VITE_API_ROOT_URL;
// const ROOT_URL = window.location.origin + '/api/';

const API_ENDPOINT = {

    GET_DETAIL: 'get_detail',
    GET_COMMENT_LIST: 'get_comment_list',
    GET_REACTION_LIST: 'get_reaction_list',

    // GET_FORWARD_LIST: 'get_forward_list',
    // GET_LIKE_LIST: 'get_like_list',
    GET_REQUEST_STATUS: 'get_request_status',

    GET_LOGIN_URL: 'get_login_url',
    CHECK_LOGIN_STATUS: 'check_login_status',

    CHECK_IS_LOGGED_IN: 'check_is_logged_in',

    GET_LOGGED_USER_INFO: 'get_logged_user_info',

    CHECK_IS_MY_FANS: 'check_is_my_fans',
}

//动态互动类型
const REACTION_TYPE = {
    FORWARD: '转发了',
    LIKE: '赞了',
}

const RELATION_TYPE = {
    NOT_FOLLOWING: 0,
    FOLLOWING: 2,
    MUTUAL_FOLLOWING: 6,
    BLOCKED: 128,
}

/**
 * 重复评论过滤选项
 */
const REPEAT_COMMENT_FILTER_OPTIONS = {
    NONE: 'none',
    ONLY_FIRST_USER_COMMENT: 'only_first_comment_of_user',
    ONLY_ORIGINAL_COMMENT: 'only_original_comment',

    /**
     * 获取过滤选项的描述
     * 
     * @param {string} option 
     * @returns {string}
     */
    get_description: function (option) {
        let result = '';
        switch (option) {
            case this.NONE:
                result = '不限制';
                break;
            case this.ONLY_FIRST_USER_COMMENT:
                result = '只保留每个用户的首条评论';
                break;
            case this.ONLY_ORIGINAL_COMMENT:
                result = '只保留相同内容的首条评论';
                break;
        }
        return result;
    }
}


export { API_ROOT_URL, API_ENDPOINT, REACTION_TYPE, RELATION_TYPE, REPEAT_COMMENT_FILTER_OPTIONS }