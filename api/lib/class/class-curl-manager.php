<?php

namespace bilibili_dynamic_lottery;

use Exception;

/**
 * CURL请求封装
 */
class Curl_Manager
{

    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';




    /**
     * 发送GET请求+获取JSON回复
     *
     * @param string $url
     * @param array<string,mixed> $data
     * @return array<string,mixed> 回复的JSON内容
     * @throws Exception curl错误
     */
    public static function get_json($url, $data = [])
    {
        if (is_debug())
        {
            var_dump($url, $data);
        }

        $ch = curl_init();

        $options = [
            CURLOPT_URL => self::build_url($url, $data),
        ];

        curl_setopt_array($ch, $options + self::create_default_options());

        //发送请求
        $response = curl_exec($ch);


        //如果未发现错误
        if ($response !== false)
        {
            // $info = curl_getinfo($ch);
            // var_dump($info);

            //注销ch资源
            curl_close($ch);

            //把回复按照JSON格式解析
            $response = json_decode($response, true);
            //如果有错误
            if (json_last_error() !== JSON_ERROR_NONE)
            {
                throw new Exception('Failed to decode JSON response');
            }

            if (is_debug())
            {
                var_dump($response);
            }
        }
        //如果请求失败
        else
        {

            $error_message = curl_error($ch);
            //注销ch资源
            curl_close($ch);

            throw new Exception($error_message);
        }

        return $response;
    }


    /**
     * 创建默认的CURL参数数组
     *
     * @return array<int,mixed>
     * @throws Exception COOKIE文件不存在
     */
    private static function create_default_options()
    {

        // 检查 Cookie 文件是否存在
        if (!file_exists(COOKIE_FILE))
        {
            throw new Exception('COOKIE文件不存在: ' . COOKIE_FILE);
        }

        $options = [
            //添加B站账号COOKIE
            CURLOPT_COOKIE => file_get_contents(COOKIE_FILE),

            //模拟的浏览器信息
            CURLOPT_USERAGENT => static::USER_AGENT,
            //自动跳转
            CURLOPT_AUTOREFERER => true,
            //处理HTTP错误码
            CURLOPT_FAILONERROR => true,
            //返回请求结果 避免直接输出
            CURLOPT_RETURNTRANSFER => true,
            //关闭证书检查
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_DNS_CACHE_TIMEOUT  => 60 * 60, //1小时
            CURLOPT_TIMEOUT => 60,
            CURLOPT_CONNECTTIMEOUT => 10,
            // CURLOPT_NOBODY => true,

        ];

        return $options;
    }

    /**
     * 给请求地址添加上请求参数
     *
     * @param string $url
     * @param array<string,mixed> $data
     * @return string
     */
    private static function build_url($url, $data)
    {
        if (!empty($data))
        {
            $url .= '?' . http_build_query($data);
        }
        return $url;
    }
}
