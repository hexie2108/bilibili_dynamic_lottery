<?php

namespace bilibili_dynamic_lottery;

/**
 * 输出回复内容
 */
class Response_flusher
{
    /**
     * 输出数据
     *
     * @param mixed $data
     * @return void
     */
    public static function flush_data($data)
    {
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
    public static function flush_error($error_message, $error_code = 400)
    {
        // 设置内容类型为 JSON
        header('Content-Type: application/json');
        //避免浏览器缓存
        header('Cache-Control: no-cache, must-revalidate');


        $response = [
            'code' => $error_code,
            'message' => $error_message,
        ];

        echo json_encode($response);
    }
}
