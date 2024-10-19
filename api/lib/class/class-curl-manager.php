<?php

namespace bilibili_dynamic_lottery;

use Exception;

/**
 * CURL请求封装
 */
class Curl_Manager
{

    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

    const ORIGIN = 'https://www.bilibili.com';
    const REFERER = 'https://www.bilibili.com';


    /**
     * 发送GET请求+获取JSON回复
     *
     * @param string $url
     * @param array<string,mixed> $data
     * @param boolean $get_header 是否要获取头部信息
     * @return array<string,mixed> 回复的JSON内容
     * @throws Exception curl错误
     */
    public static function get_json($url, $data = [], $get_header = false)
    {
        if (is_debug())
        {
            var_dump($url, $data);
        }

        $ch = curl_init();

        $options = [
            CURLOPT_URL => self::build_url($url, $data),
        ];

        //如果要获取头部信息
        if ($get_header)
        {
            $options[CURLOPT_HEADER] = true;
        }

        curl_setopt_array($ch, $options + self::create_default_options());

        //发送请求
        $response = curl_exec($ch);


        //如果未发现错误
        if ($response !== false)
        {
            // $info = curl_getinfo($ch);
            // var_dump($info);

            //如果要获取头部信息
            if ($get_header)
            {
                // 获取头部大小
                $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
                // 分离头部和内容
                $header = substr($response, 0, $header_size);
                $response = substr($response, $header_size);
            }




            //注销ch资源
            curl_close($ch);

            //把回复按照JSON格式解析
            $response = json_decode($response, true);
            //如果有错误
            if (json_last_error() !== JSON_ERROR_NONE)
            {
                throw new Exception('Failed to decode JSON response');
            }

            //如果要获取头部信息
            if ($get_header)
            {
                //把header添加到结果里
                $response['header'] = $header;
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
     * 检测回复数据里的状态码
     *
     * @param array<string,mixed> $response
     * @return void
     * @throws Exception
     */
    public static function check_response_error_code($response)
    {
        $code = $response['code'] ?? null;
        //如果有状态码 并且不是0
        if ($code !== null && intval($code) !== 0)
        {
            //获取错误信息, 没有错误信息则使用默认错误
            $error_message = $response['message'] ?? '';
            $error_message = $error_message ?: '状态码不是0';
            throw new Exception($error_message);
        }
    }


    /**
     * 创建默认的CURL参数数组
     *
     * @return array<int,mixed>
     * @throws Exception COOKIE文件不存在
     */
    private static function create_default_options()
    {

        $options = [
            //添加B站账号COOKIE
            CURLOPT_COOKIE => self::get_cookie(),

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

            CURLOPT_HTTPHEADER => [
                'Origin: ' . static::ORIGIN,
                'Referer: ' . static::REFERER,
            ],

        ];

        return $options;
    }

    /**
     * 如果用户已登陆,就用用户的COOKIE, 否则使用默认COOKIE
     *
     * @return string
     * @throws Exception 如果没有任何COOKIE
     */
    private static function get_cookie()
    {

        //尝试获取用户的COOKIE
        $result = Session_Cache::get(Session_Cache::BILIBILI_COOKIE);

        //如果没有 就改用默认COOKIE
        if (empty($result))
        {
            // 检查 默认 Cookie 文件是否存在
            if (!file_exists(COOKIE_FILE))
            {
                throw new Exception('COOKIE文件不存在: ' . COOKIE_FILE);
            }

            $result = file_get_contents(COOKIE_FILE);
        }

        return $result;
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
