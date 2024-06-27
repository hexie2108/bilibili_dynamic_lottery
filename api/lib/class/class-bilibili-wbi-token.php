<?php

namespace bilibili_dynamic_lottery;

use Exception;

/**
 * B站 Wbi 签名 生成器
 * 原版作者 imPrk0
 * @see https://github.com/SocialSisterYi/bilibili-API-collect/issues/813
 */
class Bilibili_Wbi_Token
{



    //签名加密表
    const MIXIN_ENCODE_TABLE = [
        46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
        33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
        61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
        36, 20, 34, 44, 52
    ];

    /**
     * wbi二次打乱后的密钥
     * @var string
     */
    private static $mixin_key;


    /**
     * 往请求参数里添加 wts 和 w_rid 签名
     *
     * @param array<string,mixed> $query_data
     * @return array<string,mixed> 包含 wbi签名的请求参数
     */
    public static function add_wbi_token($query_data)
    {
        //确保参数里没有w_rid字段
        unset($query_data['w_rid']);
        // 添加 wts 字段
        $query_data['wts'] = time();

        //按照 key 重新排序参数
        ksort($query_data);

        //创建一个 新数组参数 用来计算 w_rid 签名
        $query_data_to_rid = [];
        foreach ($query_data as $key => $value)
        {
            // 过滤 value 中的 "!'()*" 字符
            $value = preg_replace("/[!'()*]/", '', $value);
            //对value进行转义
            $query_data_to_rid[] = urlencode($key) . '=' . urlencode($value);
        }

        //把参数数组转换成字符串, 然后 计算 w_rid
        $query_string_to_rid = implode('&', $query_data_to_rid);
        $query_data['w_rid'] =  md5($query_string_to_rid . self::get_mixin_key());

        return $query_data;
    }



    /**
     * 获取wbi密钥字符串
     *
     * @return string
     * @throws Exception
     */
    private static function get_wbi_keys()
    {

        //发送GET请求
        $response = Curl_Manager::get_json(Bilibili_Api::GET_WBI_KEYS);

        //顺便检测COOKIE是否还有效
        $is_login = $response['data']['isLogin'] ?? false;
        if ($is_login === false)
        {
            // throw new Exception(json_encode($response));
            // throw new Exception('程序使用的COOKIE凭证已失效, 请通知管理员更新凭证');
        }


        $img_url = $response['data']['wbi_img']['img_url'] ?? '';
        $sub_url = $response['data']['wbi_img']['sub_url'] ?? '';

        //从字符串中提取密钥
        $img_url = basename($img_url);
        $img_key = explode('.', $img_url)[0];

        $sub_url = basename($sub_url);
        $sub_key = explode('.', $sub_url)[0];

        //如果密钥获取失败
        if (empty($img_key) || empty($sub_key))
        {
            throw new Exception('密钥 img_key/sub_key 获取失败');
        }

        return $img_key . $sub_key;
    }

    /**
     * 对2个wbi密钥进行二次打乱合并成新的mixin密钥
     *
     * @return string
     */
    private static function get_mixin_key()
    {
        //如果还未生成过mixin密钥
        if (empty(self::$mixin_key))
        {
            $new_mixin_key = '';

            //获取wbi密钥字符串
            $origin_wbi_key = self::get_wbi_keys();

            //使用加密表 打乱旧密钥
            foreach (self::MIXIN_ENCODE_TABLE as $n)
            {
                $new_mixin_key .= $origin_wbi_key[$n];
            }

            //只保存 前32位字符
            self::$mixin_key = substr($new_mixin_key, 0, 32);
        }

        return self::$mixin_key;
    }
}
