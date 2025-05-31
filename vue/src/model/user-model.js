import { get_random_int } from "@/utils/utils";

export class User_Model {

    /**
     * 构造函数，接收一个对象参数
     * @param {Object} data - 用户数据对象
     */
    constructor(data = {}) {
        /**
         * 用户ID
         * @type {number}
         */
        this.id = data.id || null;

        /**
         * 用户名
         * @type {string}
         */
        this.user_name = data.user_name || '';

        /**
         * 用户签名
         * @type {string}
         */
        this.user_sign = data.user_sign || '';

        /**
         * 用户头像地址
         * @type {string}
         */
        this.avatar = data.avatar || '';

        /**
         * 头像框地址
         * @type {string}
         */
        this.pendant = data.pendant || '';

        /**
         * 等级
         * @type {number}
         */
        this.level = data.level || 0;

        /**
         * 大会员ID
         * @type {string}
         */
        this.vip = data.vip || '';

        /**
         * 大会员描述
         * @type {string}
         */
        this.vip_description = data.vip_description || '';

        /**
         * 评论内容
         * @type {string}
         */
        this.content = data.content || '';

        /**
         * 评论发送时间
         * @type {string}
         */
        this.date = data.date || '';

        /**
         * 点赞/转发列表专用, 用来识别用户所属的来源
         * @type {string}
         */
        this.action = data.action || '';

        /**
         * 评论列表专用, 回复ID地址, 用来定位回复位置
         *
         * @type {number}
        */
        this.reply_id = data.reply_id || 0;

        /**
         * 如果当前评论非原创, 则记录对应的原创评论ID (JS端属性)
         *
         * @type {number}
         */
        this.original_comment_id = data.$original_comment_id || 0;

        /**
         * 如果当前评论非原创, 则记录重复次数 (JS端属性)
         *
         * @type {number}
         */
        this.duplicate_comment_count = data.$duplicate_comment_count || 0;


        //用户关系相关
        this.relation_type = null;
        this.relation_type_description = '';
        this.relation_date = '';

        //生成一个随机KEY, 用来避免vue重复渲染
        this.key = this.id + '' + get_random_int(1, 1000)
    }
}
