
const http = require('./conn.util');
const Users = require('../class/Users');

const URL = process.env.BILIBILI_DYNAMIC_REPOST_API;

async function getDynamicRepostList(dynamic_id) {

    let result;
    let hasMore = true;
    let errorTime = 0;
    let users = new Users();

    let query = {dynamic_id};

    do {
        //单次提取20条转发记录
        let response = await http.get(URL, query);
        //如果有错误代码
        if (response.data.code > 0) {
            //增加错误次数, 然后重新请求
            errorTime++;
        }
        else {
            //保存新获取到的用户数据到 数组里
            users.add(response.data);
            //如果还有更多
            if (response.data.hasOwnProperty('data') && response.data.data['has_more'] === 1) {
                //设置下一页的变量
                query.offset = response.data.data['offset'];
            }
            else {
                hasMore = false;
            }
        }
    }
        //还有更多, 并且错误次数低于5
    while (hasMore && errorTime < 5)

    //如果错误次数等于5,  说明有错误
    if (errorTime === 5) {
        result = {
            body: {error: "获取错误, 请重试"},
            status: 400
        };
    }
    else {
        result = {
            body: users,
            status: 200
        }
    }

    return result;
}


module.exports.getDynamicRepostList = getDynamicRepostList;
