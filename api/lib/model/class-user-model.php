<?php

namespace bilibili_dynamic_lottery;

use DateTime;
use DateTimeZone;

class User_Model
{

    const ACTION_FORWARD = '转发了';
    const ACTION_LIKE = '赞了';

    /**
     * 用户ID
     * @var int
     */
    public $id;

    /**
     * 用户名
     * @var string
     */
    public $user_name;

    /**
     * 用户签名
     *
     * @var string
     */
    public $user_sign;

    /**
     * 用户头像地址
     * @var string
     */
    public $avatar;

    /**
     * 头像框地址
     *
     * @var string
     */
    public $pendant;

    /**
     * 等级
     *
     * @var int
     */
    public $level;

    /**
     * 大会员ID
     *
     * @var string
     */
    public $vip;

    /**
     * 大会员描述
     *
     * @var string
     */
    public $vip_description;

    /**
     * 评论内容
     * @var string
     */
    public $content;

    /**
     * 评论发送时间
     *
     * @var string
     */
    public $date;

    /**
     * 子评论列表
     * @var User_Model[]
     */
    public $array_replies = [];


    /**
     * 点赞/转发列表专用, 用来识别用户所属的来源
     *
     * @var string
     */
    public $action;

    /**
     * 评论列表专用, 评论ID
     *
     * @var int
     */
    public $reply_id;

    // /**
    //  * 如果当前评论非原创, 则记录对应的原创评论ID
    //  *
    //  * @var int
    //  */
    // public $original_comment_id = 0;

    // /**
    //  * 如果当前评论非原创, 则记录重复次数
    //  *
    //  * @var int
    //  */
    // public $duplicate_comment_count = 0;

    //避免被直接创建实例
    private function __construct()
    {
    }

    // /**
    //  * 检测评论是否为原创评论, 并设置相关信息
    //  *
    //  * @return void
    //  */
    // public function set_comment_duplicate_info()
    // {
    //     //创建个本地静态储存映射 用来记录识别评论是否是原创的
    //     static $map_hash_content_to_original_comment_info = [];

    //     $key = md5(trim($this->content));
    //     $original_comment_info = $map_hash_content_to_original_comment_info[$key] ?? [];

    //     //如果当前评论内容已经存在于映射中, 则说明不是原创评论
    //     if (count($original_comment_info) > 0)
    //     {
    //         //重复次数+1
    //         $original_comment_info['count']++;

    //         //设置原创评论ID和重复次数
    //         $this->original_comment_id = $original_comment_info['id'];
    //         $this->duplicate_comment_count = $original_comment_info['count'];
    //     }
    //     //如果不存在, 则说明是原创评论
    //     else
    //     {
    //         //设置原创评论ID
    //         $original_comment_info['id'] = $this->reply_id;
    //         $original_comment_info['count'] = 0;
    //     }

    //     //更新映射里的原创评论信息
    //     $map_hash_content_to_original_comment_info[$key] = $original_comment_info;
    // }

    /**
     * 通过评论数据创建用户对象
     *
     * @param array<string, mixed> $comment
     * @return User_Model
     */
    public static function create_by_comment($comment)
    {

        $model = new self();

        $member = $comment['member'] ?? null;
        throw_exception_if_is_null($member, '无法从评论数据中获取 member');

        $model->id = $member['mid'] ?? 0;
        $model->user_name =  $member['uname'] ?? '';
        $model->user_sign =  $member['sign'] ?? '';

        $model->avatar =  $member['avatar'] ?? '';
        $model->pendant =  $member['pendant']['image_enhance'] ?? '';
        $model->level =  $member['level_info']['current_level'] ?? 0;

        $model->vip = $member['vip']['label']['label_theme'] ?? '';
        $model->vip_description = $member['vip']['label']['text'] ?? '';

        $model->content = $comment['content']['message'] ?? '';

        //获取评论时间
        $ctime = $comment['ctime'] ?? null;
        if ($ctime)
        {
            $date = new DateTime();
            //把时间戳转换成时间对象
            $date->setTimestamp($ctime);
            // 设置时区为北京时间（UTC+8）
            $date->setTimezone(new DateTimeZone('Asia/Shanghai'));

            //格式化输出
            $model->date = $date->format('Y-m-d H:i:s');
        }

        //如果有子评论列表, 批量转换成子评论对象列表
        $array_replies = $comment['replies'] ?? null;
        if (is_array($array_replies))
        {
            foreach ($array_replies as $reply_comment)
            {
                $model->array_replies[] = User_Model::create_by_comment($reply_comment);
            }
        }

        $model->reply_id = $comment['rpid'] ?? 0;

        // $model->set_comment_duplicate_info();

        return $model;
    }

    /**
     * 通过点赞/转发数据创建用户对象
     *
     * @param array<string, mixed> $reaction
     * @return User_Model
     */
    public static function create_by_reaction($reaction)
    {

        $model = new self();

        $model->id = $reaction['mid'] ?? 0;
        $model->user_name =  $reaction['name'] ?? '';
        $model->avatar =  $reaction['face'] ?? '';

        $model->action = $reaction['action'] ?? '';

        return $model;
    }
}
