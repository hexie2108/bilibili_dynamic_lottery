<?php

namespace bilibili_dynamic_lottery;

use Exception;

class Login_Model
{
    /**
     * 二维码登陆链接
     * @var string
     */
    public $url;

    /**
     * 二维码ID
     * @var string
     */
    public $qrcode_key;


    /**
     *
     * @param array<string,mixed> $a_data
     * @throws Exception 如果缺少必要参数
     */
    public function __construct($a_data)
    {
        $this->url = $a_data['url'] ?? '';
        $this->qrcode_key = $a_data['qrcode_key'] ?? '';

        if (empty($this->url))
        {
            throw new Exception('创建Login Model 缺少 url 参数');
        }

        if (empty($this->qrcode_key))
        {
            throw new Exception('创建Login Model 缺少 qrcode_key 参数');
        }
    }
}
