//转发用户
class User {

    constructor(item) {

        /*
        if (item.hasOwnProperty('desc') && item['desc'].hasOwnProperty('user_profile') && item['desc']['user_profile'].hasOwnProperty('info')) {
            let userInfo = item['desc']['user_profile']['info'];
            this.id = item['desc']['dynamic_id'];
            this.uid = userInfo["uid"];
            this.name = userInfo["uname"];
            this.avatar = userInfo["face"];
            if (item['desc']['user_profile'].hasOwnProperty('level_info')) {
                this.level = item['desc']['user_profile']['level_info']['current_level'];
            }


        }
        */

        if (item.hasOwnProperty('user')) {

            const user = item['user'];

            this.uid = user["mid"];
            this.name = user["name"];
            this.avatar = user["face"];

            //如果是大会员
            if (user.hasOwnProperty('vip') && user.vip.hasOwnProperty('label')) {

                this.vip = user.vip.label.text || '';

            }
        }


    }

    /**
     * 如果有空值, 说明用户信息获取不完整
     */
    isNull() {
        return !(this.uid && this.name && this.avatar);
    }

}

//转发用户数组
class Users extends Array {

    //ADD METHOD
    //从转发列表获取用户
    add(result) {

        if (result.hasOwnProperty('data') && result.data && result.data.hasOwnProperty('items')) {

            let items = result.data.items;

            if (Array.isArray(items) && items.length > 0) {

                //提取数据, 遍历添加到用户数组
                for (const item of items) {

                    let user = new User(item);

                    //如果用户数据不完整, 或者 已经存在过 (避免重复转发)
                    if (!user.isNull() && !this.find(element => element.uid === user.uid)) {
                        this.push(user);
                    }

                }

            }

        }


    }


}

//评论用户
class CommentUser {

    constructor(member) {

        this.uid = member["mid"];
        this.name = member["uname"];
        this.avatar = member["avatar"];

        if (member.hasOwnProperty('level_info')) {

            this.level = member['level_info']['current_level'];
        }

        //如果是大会员
        if (member.hasOwnProperty('vip') && member.vip.hasOwnProperty('label')) {

            this.vip = member.vip.label.text || '';
        }

    }

    /**
     * 如果有空值, 说明用户信息获取不完整
     */
    isNull() {
        return !(this.uid && this.name && this.avatar);
    }

}

//点赞用户
class LikeUser {

    constructor(member) {

        this.uid = member["uid"];
        this.name = member["uname"];
        this.avatar = member["face_url"];

        if (member.hasOwnProperty('user_info')) {

            const user_info = member['user_info'];

            if (user_info.hasOwnProperty('level_info')) {
                this.level = user_info.level_info.current_level || '';
            }

            //如果是大会员
            if (user_info.hasOwnProperty('vip') && user_info.vip.hasOwnProperty('label')) {

                this.vip = user_info.vip.label.text || '';

            }

        }




    }

    /**
     * 如果有空值, 说明用户信息获取不完整
     */
    isNull() {
        return !(this.uid && this.name && this.avatar);
    }

}



//评论用户数组
class CommentUsers extends Array {



    //从评论列表获取用户
    add(result) {



        if (result.hasOwnProperty('data') && result["data"].hasOwnProperty('replies') && Array.isArray(result["data"]["replies"]) && result["data"]["replies"].length > 0) {



            //提取数据, 遍历添加到用户数组
            let replies = result["data"]["replies"];
            for (let i = 0; i < replies.length; i++) {



                if (replies[i].hasOwnProperty('member')) {

                    let user = new CommentUser(replies[i]['member']);



                    //如果用户数据完整 并且还未保存过 (避免重复转发)
                    if (!user.isNull() && !this.find(element => element.uid === user.uid)) {
                        this.push(user);



                    }
                    else {



                    }


                }


            }

        }





    }

}


//点赞用户数组
class LikeUsers extends Array {


    //从评论列表获取用户
    add(result) {

        if (result.hasOwnProperty('data') && result["data"].hasOwnProperty('item_likes') && Array.isArray(result.data.item_likes) && result.data.item_likes.length > 0) {

            //提取数据, 遍历添加到用户数组
            for (const member of result.data.item_likes) {

                let user = new LikeUser(member);

                //如果用户数据完整 并且还未保存过 (避免重复转发)
                if (!user.isNull() && !this.find(element => element.uid === user.uid)) {
                    this.push(user);
                }

            }


        }



    }

}

/*
============================================================================
*/


//评论用户
class ReactionUser {

    constructor(member) {
        this.uid = member["mid"];
        this.name = member["name"];
        this.avatar = member["face"];
    }

    /**
     * 如果有空值, 说明用户信息获取不完整
     */
    isNull() {
        return !(this.uid && this.name && this.avatar);
    }

}

//点赞和转发用户数组
class ArrayReactionUser extends Array {


    //从评论列表获取用户
    add(result, action_type) {

        if (result.hasOwnProperty('data') && result["data"].hasOwnProperty('items') && Array.isArray(result.data.items) && result.data.items.length > 0) {


            //提取数据, 遍历添加到用户数组
            for (const member of result.data.items) {

                //只记录 执行了对应动作类型的用户
                if (member.action === action_type) {

                    let user = new ReactionUser(member);

                    //如果用户数据完整 并且还未保存过 (避免重复转发)
                    if (!user.isNull() && !this.find(element => element.uid === user.uid)) {
                        this.push(user);
                    }
                }

            }


        }



    }

}


module.exports = {
    Users,
    CommentUsers,
    LikeUsers,
    ArrayReactionUser,
};
