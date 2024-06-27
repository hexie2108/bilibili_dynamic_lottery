<?php

namespace bilibili_dynamic_lottery;

/**
 * 输出回复内容
 */
class Response_flusher
{
    /**
     * 添加CORS安全的头部 避免请求错误
     *
     * @return void
     */
    private static function add_cors_header()
    {


        // 允许所有来源访问
        header("Access-Control-Allow-Origin: " . FRONT_END_JS_DOMAIN);

        // 允许跨域请求携带凭证
        header('Access-Control-Allow-Credentials: true');

        // 允许的 HTTP 方法
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

        // 允许的 HTTP 头信息
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

        // 如果是预检请求（OPTIONS），返回 200 状态码并终止脚本执行
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
        {
            http_response_code(200);
            exit();
        }
    }

    /**
     * 输出数据
     *
     * @param mixed $data
     * @return void
     */
    public static function flush_data($data)
    {
        self::add_cors_header();

        // 设置内容类型为 JSON
        header('Content-Type: application/json');
        //避免浏览器缓存
        header('Cache-Control: no-cache, must-revalidate');


        echo json_encode($data);
    }

    /**
     * 输出错误
     *
     * @param string $error_message
     * @param int $error_code
     * @return void
     */
    public static function flush_error($error_message, $error_code)
    {
        self::add_cors_header();

        // 设置内容类型为 JSON
        header('Content-Type: application/json');
        //避免浏览器缓存
        header('Cache-Control: no-cache, must-revalidate');

        //如果未设置错误代码 默认500
        if (empty($error_code))
        {
            $error_code = 500;
        }

        $response = [
            'code' => $error_code,
            'message' => $error_message,
        ];

        echo json_encode($response);
    }
}
