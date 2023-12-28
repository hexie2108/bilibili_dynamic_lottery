const md5 = require('md5');
const http = require('./conn.util');
const user_type = require('../class/Users');

//API签名验证接口
const URL_WBI_TOKEN = 'https://api.bilibili.com/x/web-interface/nav';
//评论详情接口
const URL_DYNAMIC_DETAIL = 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail';

//const URL_REPOST_LIST = 'https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost_detail';
//旧版 转发列表
const URL_REPOST_LIST = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail/forward';
//旧版 点赞列表
const URL_LIKE_LIST = 'https://api.vc.bilibili.com/dynamic_like/v1/dynamic_like/spec_item_likes';

//评论列表
const URL_COMMENT_LIST = 'https://api.bilibili.com/x/v2/reply/wbi/main';

//新版 点赞与转发列表
const URL_REACTION_LIST = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail/reaction';

const COMMENT_TYPE_DYNAMIC = 11;
const COMMENT_TYPE_DYNAMIC_OLD = 17;
const COMMENT_TYPE_VIDEO = 1;




/**
 * 获取转发和点赞用户列表
 * @param {number} dynamic_id 
 * @param {string} action_type 
 * @returns 
 */
async function getDynamicRepostAndLikeList(dynamic_id, action_type) {

    let result;
    let hasMore = true;
    let errorTime = 0;
    let blocked = false;
    let users = new user_type.ArrayReactionUser();

    let query = { id: dynamic_id };

    //总用户数
    let totalUserCount = 0;

    do {
        //单次提取20条转发记录
        //console.log(URL_REPOST_LIST+'?dynamic_id='+query.dynamic_id+'&offset='+query.offset);
        let response = await http.get(URL_REACTION_LIST, query);
        const response_data = response.data;

        //console.log(response);

        //如果有错误代码
        if (response_data.code !== 0) {
            //增加错误次数, 然后重新请求
            errorTime++;

            //输出错误信息
            console.error(response_data);

            if (response_data.code === -412) {
                errorTime = 10;
                blocked = true;
            }


        } else {

            //保存新获取到的用户数据到 数组里
            users.add(response_data, action_type);

            //统计总用户数
            if (response_data.hasOwnProperty('data') && response_data.data.hasOwnProperty('items') && Array.isArray(response_data.data.items) && response_data.data.items.length > 0) {
                totalUserCount += response_data.data.items.length;
            }

            //如果还有更多
            if (response_data.hasOwnProperty('data') && response_data.data['has_more'] === true) {
                //设置下一页的变量
                query.offset = response_data.data['offset'];
            } else {
                hasMore = false;
            }

            console.log('当前列表长度' + totalUserCount);
            // //暂停2秒钟
            // await sleep_loop(1000 * 6);
        }


    }
    //还有更多, 并且错误次数低于10
    while (hasMore && errorTime < 10)

    //如果错误次数等于10,  说明有错误
    if (errorTime === 10) {
        result = {
            body: { error: "获取错误, 请重试" },
            status: 400
        };

        if (blocked) {
            result = {
                body: { error: "当前的请求过于频繁, 已触发B站风控, 请改用其他用户类型, 或者请过段时间再尝试," },
                status: 400
            };
        }

    } else {

        //随机排序
        //users.sort(() => Math.random() - 0.5);

        result = {
            body: {
                users,
                totalUserCount,

            },
            status: 200
        }
    }

    return result;
}

//获取评论用户列表
async function getDynamicCommentList(dynamic_id) {

    let result;
    let hasMore = true;
    let errorTime = 0;
    let blocked = false;
    let users = new user_type.CommentUsers();


    //初始化id和类型
    let oid = 0;
    //默认动态评论列表类型
    let type = 0;

    //需要先获取 评论列表 oid
    let dynamic_response = await http.get(URL_DYNAMIC_DETAIL, {
        dynamic_id,
    });


    try {
        // console.log(dynamic_response.data);

        if (dynamic_response.data.data.hasOwnProperty('card') === false) {
            return {
                body: { error: "登陆凭证已过期, 请联系管理员更新" },
                status: 500
            };
        }


        //如果是原创动态
        //if (dynamic_response.data.data.card.desc.orig_type === 0) {
        //设置评论列表类型
        type = COMMENT_TYPE_DYNAMIC;
        //设置专属OID
        oid = dynamic_response.data.data.card.desc.rid;
        //}



    } catch (exception) {
        console.log(dynamic_response.data);
        console.error(exception);

        return {
            body: { error: "无法获取该动态的详情数据, " },
            status: 500
        };
    }

    let query = {
        oid,
        //jsonp: 'jsonp',
        type,
        mode: 2, //最新排序
        //mode: 3, //热门排序

        //offset
        //next: 0,
        ps: 30, //设置列表长度 (可选)
        pagination_str: JSON.stringify({
            offset: "",
        }),

    };

    //总用户数
    let totalUserCount = 0;


    do {


        //加密参数
        query = await encryptionQueryByWbiToken(query);
        let response = await http.get(URL_COMMENT_LIST, query);
        const response_data = response.data;

        // console.log(query);
        // console.log(response_data);


        //如果有错误代码 或者没有回复记录
        if (response_data.code !== 0 || !response_data.data.replies || (totalUserCount === 0 && !response_data.data.replies.length)) {
            //增加错误次数, 然后重新请求
            errorTime++;
            //输出错误信息
            // console.error(response_data);

            //如果是403错误, 尝试更换 请求参数
            if (response_data.code === -403 || response_data.code === -404 || !response_data.data.replies || (totalUserCount === 0 && !response_data.data.replies.length)) {

                //如果当前参数是默认 
                if (query.type === COMMENT_TYPE_DYNAMIC) {
                    //更改评论列表类型
                    query.type = COMMENT_TYPE_DYNAMIC_OLD;
                    //更改oid为 动态ID
                    query.oid = dynamic_id;
                }
                //如果参数 已经是旧类型 但还是错的
                else if (query.type === COMMENT_TYPE_DYNAMIC_OLD) {

                    //那就改成 视频类型
                    query.type = COMMENT_TYPE_VIDEO;
                    //重置默认oid
                    query.oid = oid;
                }

                query = await encryptionQueryByWbiToken(query);

            }
            else if (response_data.code === -412) {
                errorTime = 10;
                blocked = true;
            }

        } else {

            //保存新获取到的用户数据到 数组里
            users.add(response_data);

            if (response_data.hasOwnProperty('data') && response_data.data.hasOwnProperty('cursor')) {

                const cursor = response_data.data.cursor;

                //统计总用户数 (只统计一次)
                /*if (totalUserCount === 0) {
                    totalUserCount = response_data.data.cursor.all_count;
                }*/
                //如果还有后续
                if (cursor.is_end === false) {

                    //query.next++; //mode 3情况的下一个分页为递增
                    //query.next = cursor.next; //mode 2情况的下一个分页需要在请求里获取


                    //设置下个分页索引
                    // query.pagination_str = JSON.stringify({
                    //     offset: JSON.stringify({
                    //         type: 3,
                    //         direction: 1,
                    //         Data: {
                    //             cursor: cursor.next,
                    //         }
                    //     })
                    // });

                    //复制新版分页参数
                    query.pagination_str = JSON.stringify({
                        offset: cursor.pagination_reply.next_offset
                    });


                    query = await encryptionQueryByWbiToken(query);

                } else {
                    hasMore = false;
                }

            }

            //统计一级评论的数量
            if (response_data.hasOwnProperty('data') && response_data.data.hasOwnProperty('replies') && Array.isArray(response_data.data.replies)) {

                totalUserCount += response_data.data.replies.length;
            }

        }
    }
    //还有更多, 并且错误次数低于10
    while (hasMore && errorTime < 10)

    //如果错误次数等于10,  说明有错误
    if (errorTime === 10) {
        result = {
            body: { error: "获取错误, 请重试" },
            status: 400
        };

        if (blocked) {
            result = {
                body: { error: "当前的请求过于频繁, 已触发B站风控, 请过段时间再尝试," },
                status: 400
            };
        }
    } else {

        //随机排序
        //users.sort(() => Math.random() - 0.5);



        result = {
            body: {
                users,
                totalUserCount,

            },
            status: 200
        }
    }

    return result;
}




/**
 * @deprecated
 * 获取点赞用户列表
 * 
 * @param {number} dynamic_id 
 * @returns 
 */
async function getDynamicLikeList(dynamic_id) {

    let result;
    let hasMore = true;
    let errorTime = 0;
    let blocked = false;
    let users = new user_type.LikeUsers();


    let query = {
        dynamic_id,
        //offset
        pn: 1,

    };

    //总用户数
    let totalUserCount = 0;


    do {

        let response = await http.get(URL_LIKE_LIST, query);
        const response_data = response.data;


        //如果有错误代码
        if (response_data.code !== 0) {
            //增加错误次数, 然后重新请求
            errorTime++;
            //输出错误信息
            console.error(response_data);

            if (response_data.code === -412) {
                errorTime = 10;
                blocked = true;
            }

        } else {

            //保存新获取到的用户数据到 数组里
            users.add(response_data);

            //统计总用户数
            if (response_data.hasOwnProperty('data') && response_data.data.hasOwnProperty('item_likes') && Array.isArray(response_data.data.item_likes) && response_data.data.item_likes.length > 0) {
                totalUserCount += response_data.data.item_likes.length;
            }

            //如果还有更多
            if (response_data.hasOwnProperty('data') && response_data.data['has_more'] === 1) {
                //设置下一页的变量
                query.pn++;
            } else {
                hasMore = false;
            }

            console.log('暂停: 当前列表长度' + totalUserCount);
            //暂停3秒钟
            await sleep_loop(1000 * 3);

        }
    }
    //还有更多, 并且错误次数低于10
    while (hasMore && errorTime < 10)

    //如果错误次数等于10,  说明有错误
    if (errorTime === 10) {
        result = {
            body: { error: "获取错误, 请重试" },
            status: 400
        };

        if (blocked) {
            result = {
                body: { error: "当前的请求过于频繁, 已触发B站风控, 请过段时间再尝试," },
                status: 400
            };
        }

    } else {

        //随机排序
        //users.sort(() => Math.random() - 0.5);



        result = {
            body: {
                users,
                totalUserCount,

            },
            status: 200
        }
    }

    return result;
}




/**
 * 获取最新的 img_key 和 sub_key
 * @returns {object}
 * {
 *    img_key,
 *    sub_key,
 * }
 */
async function getWbiToken() {

    let result = {};

    //如果有缓存
    if (getWbiToken.img_key && getWbiToken.sub_key) {
        result = {
            img_key: getWbiToken.img_key,
            sub_key: getWbiToken.sub_key
        };
    }
    //否则重新获取
    else {

        let response = await http.get(URL_WBI_TOKEN);
        const response_data = response.data;
        if (response_data.hasOwnProperty('data')) {
            let img_url = response_data.data.wbi_img.img_url || '';
            let sub_url = response_data.data.wbi_img.sub_url || '';
            if (img_url && sub_url) {

                //保存到缓存
                getWbiToken.img_key = img_url.slice(
                    img_url.lastIndexOf('/') + 1,
                    img_url.lastIndexOf('.')
                );
                getWbiToken.sub_key = sub_url.slice(
                    sub_url.lastIndexOf('/') + 1,
                    sub_url.lastIndexOf('.')
                );

                result = {
                    img_key: getWbiToken.img_key,
                    sub_key: getWbiToken.sub_key
                };
            }
        }
    }

    return result;

}

/**
 * 对 imgKey 和 subKey 进行字符顺序打乱编码
 * @param {string} orig 
 * @returns {string}
 */
function getMixinWbiToken(orig) {

    //加密Wbi的表
    const wbi_mixin_table = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ];

    let temp = '';
    wbi_mixin_table.forEach((n) => {
        temp += orig[n]
    });
    return temp.slice(0, 32);
}


/**
 * 使用wbi签名对参数进行加密
 * @param {object} query 
 * @returns  {object} 新的参数对象
 */
async function encryptionQueryByWbiToken(query) {

    const wbi_token = await getWbiToken();
    if (!wbi_token.img_key || !wbi_token.sub_key) {
        throw new Error('wbi签名获取失败');
    }

    const mixin_key = getMixinWbiToken(wbi_token.img_key + wbi_token.sub_key);
    const curr_time = Math.round(Date.now() / 1000);
    const chr_filter = /[!'()*]/g;

    //删除w_rid字段
    delete query.w_rid;
    // 添加 wts 字段
    query.wts = curr_time;


    const new_query = [];
    // 按照 key 重排参数
    Object.keys(query).sort().forEach((key) => {
        new_query.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(
                // 过滤 value 中的 "!'()*" 字符
                query[key].toString().replace(chr_filter, '')
            )}`
        );
    });

    // console.log(new_query.join('&'));

    // 计算 w_rid
    const wbi_sign = md5(new_query.join('&') + mixin_key);

    query.w_rid = wbi_sign;

    return query;
}

/**
 * 暂停运行, 避免触发风控
 */
async function sleep_loop(time) {
    await delay_by_promise(time);
}

function delay_by_promise(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

module.exports.getDynamicRepostAndLikeList = getDynamicRepostAndLikeList;
module.exports.getDynamicCommentList = getDynamicCommentList;
module.exports.getDynamicLikeList = getDynamicLikeList;
