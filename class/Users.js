//转发用户
class User {

    constructor(item) {


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


    }

    /**
     * 如果有空值, 说明用户信息获取不完整
     */
    isNull() {
        return !(this.id && this.uid && this.name && this.avatar);
    }

}

//转发用户数组
class Users extends Array {

    //ADD METHOD
    //从转发列表获取用户
    add(result) {

        if (result.hasOwnProperty('data') && result["data"].hasOwnProperty('items') && Array.isArray(result["data"]["items"]) && result["data"]["items"].length > 0) {

            //提取数据, 遍历添加到用户数组
            let items = result["data"]["items"];
            for (let i = 0; i < items.length; i++) {
                let user = new User(items[i]);


                //如果用户数据不完整, 或者 已经存在过 (避免重复转发)
                if (!user.isNull() && !this.find(element => element.uid === user.uid)) {
                    this.push(user);
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
        if (member['level_info'].hasOwnProperty('current_level')) {
            this.level = member['level_info']['current_level'];
        }



    }

    /**
     * 如果有空值, 说明用户信息获取不完整
     */
    isNull() {
        return !( this.uid && this.name && this.avatar);
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


                    //如果用户数据不完整, 或者 已经存在过 (避免重复转发)
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
};
