<?php

namespace bilibili_dynamic_lottery;

use Exception;

class Login_User_Model
{
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
     * 用户头像地址
     * @var string
     */
    public $avatar;


    /**
     *
     * @param array<string,mixed> $a_data
     * @throws Exception 如果缺少必要参数
     */
    public function __construct($a_data)
    {
        $this->id = $a_data['mid'] ?? '';
        $this->user_name = $a_data['uname'] ?? '';
        $this->avatar = $a_data['face'] ?? '';

        if (empty($this->id))
        {
            throw new Exception('创建Login user Model 缺少 mid 参数');
        }

        if (empty($this->user_name))
        {
            throw new Exception('创建Login user Model 缺少 uname 参数');
        }

        if (empty($this->avatar))
        {
            throw new Exception('创建Login user Model 缺少 face 参数');
        }
    }
}
