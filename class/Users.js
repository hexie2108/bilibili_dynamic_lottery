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

//自定义数组
class Users extends Array {
    //ADD METHOD
    add(result) {

        if (result.hasOwnProperty('data') && result["data"].hasOwnProperty('items') && Array.isArray(result["data"]["items"]) && result["data"]["items"].length > 0) {

            //提取数据, 遍历添加到用户数组
            let items = result["data"]["items"];
            for (let i = 0; i < items.length; i++) {
                let user = new User(items[i]);

                if (!user.isNull()) {
                    this.push(user);
                }
            }

        }
    }

}

module.exports = Users;
