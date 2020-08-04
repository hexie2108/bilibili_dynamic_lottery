const http = require('./conn.util');
const Users = require('../class/Users');

const URL = process.env.BILIBILI_DYNAMIC_REPOST_API || 'https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/repost_detail';

async function getDynamicRepostList(dynamic_id) {

    let result;
    let hasMore = true;
    let errorTime = 0;
    let users = new Users();

    let query = {dynamic_id};

    //总用户数
    let totalUserCount = 0;

    do {
        //单次提取20条转发记录
        console.log(URL+'?dynamic_id='+query.dynamic_id+'&offset='+query.offset);
        let response = await http.get(URL, query);
        //如果有错误代码
        if (response.data.code > 0) {
            //增加错误次数, 然后重新请求
            errorTime++;
        } else {

            //保存新获取到的用户数据到 数组里
            users.add(response.data);

            //统计总用户数
            if (response.data.hasOwnProperty('data') && response.data.data.hasOwnProperty('items') && Array.isArray(response.data.data.items) && response.data.data.items.length > 0) {
                totalUserCount+= response.data.data.items.length;
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
            body: {error: "获取错误, 请重试"},
            status: 400
        };
    } else {

        //随机排序
        users.sort(() => Math.random() - 0.5);

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
