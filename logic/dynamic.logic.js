const http = require('./conn.util');
const user_type = require('../class/Users');

const URL_REPOST_LIST = 'https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost_detail';
const URL_COMMENT_LIST = 'https://api.bilibili.com/x/v2/reply/main';
const URL_DYNAMIC_DETAIL = 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail';


//获取转发用户列表
async function getDynamicRepostList(dynamic_id) {

    let result;
    let hasMore = true;
    let errorTime = 0;
    let users = new user_type.Users();

    let query = { dynamic_id };

    //总用户数
    let totalUserCount = 0;

    do {
        //单次提取20条转发记录
        //console.log(URL_REPOST_LIST+'?dynamic_id='+query.dynamic_id+'&offset='+query.offset);
        let response = await http.get(URL_REPOST_LIST, query);


        //如果有错误代码
        if (response.data.code > 0) {
            //增加错误次数, 然后重新请求
            errorTime++;
        } else {

            //保存新获取到的用户数据到 数组里
            users.add(response.data);

            //统计总用户数
            if (response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('items') && Array.isArray(response.data.data.items) && response.data.data.items.length > 0) {
                totalUserCount += response.data.data.items.length;
            }

            //如果还有更多
            if (response.data.hasOwnProperty('data') && response.data.data['has_more'] === 1) {
                //设置下一页的变量
                query.offset = response.data.data['offset'];
            } else {
                hasMore = false;
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


        //如果是原创动态
        if (dynamic_response.data.data.card.desc.orig_type === 0) {
            //更改评论列表类型
            type = 11;
            //设置专属OID
            oid = dynamic_response.data.data.card.desc.rid;
        }
        //如果是转发别人动态的动态
        else {
            //更改评论列表类型
            type = 17;
            //更改oid为 动态ID
            oid = dynamic_id;
        }


    } catch (exception) {
        console.log(dynamic_response.data);
        console.error(exception);

        return {
            body: { error: "无法获取该动态的OID数据, 请重试" },
            status: 500
        };
    }

    let query = {
        oid,
        jsonp: 'jsonp',
        type,
        mode: 2, //最新排序
        //mode: 3, //热门排序

        //offset
        next: 0,

    };

    //总用户数
    let totalUserCount = 0;


    do {

        let response = await http.get(URL_COMMENT_LIST, query);


        //如果有错误代码
        if (response.data.code !== 0) {
            //增加错误次数, 然后重新请求
            errorTime++;
            //输出错误信息
            console.error(response.data);
        } else {

            //保存新获取到的用户数据到 数组里
            users.add(response.data);

            if (response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('cursor')) {
                //统计总用户数 (只统计一次)
                /*if (totalUserCount === 0) {
                    totalUserCount = response.data.data.cursor.all_count;
                }*/
                //如果还有后续
                if (response.data.data.cursor.is_end === false) {

                    //query.next++; //mode 3情况的下一个分页为递增
                    query.next = response.data.data.cursor.next; //mode 2情况的下一个分页需要在请求里获取

                } else {
                    hasMore = false;
                }

            }

            //统计一级评论的数量
            if (response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('replies') && Array.isArray(response.data.data.replies) ) {

                totalUserCount += response.data.data.replies.length ;
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


module.exports.getDynamicRepostList = getDynamicRepostList;
module.exports.getDynamicCommentList = getDynamicCommentList;