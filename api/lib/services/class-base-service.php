<?php

namespace bilibili_dynamic_lottery;

use Exception;


class Base_Service
{


    /**
     * 请求失败次数
     * @var int
     */
    protected $error_time = 0;

    protected $id_request;


    /**
     * 构造函数
     * @param int|null $id_request
     */
    public function __construct($id_request = null)
    {
        //储存请求ID
        $this->id_request = $id_request;
    }




    /**
     * 获取动态详情对象
     * 
     * @param string $id
     * @return Detail_Model
     * @throws Exception
     */
    public function get_detail($id)
    {
        $result = null;

        //如果是BV视频ID
        if (is_bvid($id))
        {
            //发送请求获取视频详情
            $response = Curl_Manager::get_json(Bilibili_Api::GET_VIDEO_DETAIL, ['bvid' => $id]);
            $response_data = $response['data'] ?? null;
            if (empty($response_data))
            {
                throw new Exception('无法获取视频详情');
            }

            //使用视频数据生成详情数据
            $result = Detail_Model::create_by_video_data($response_data);
        }
        //如果是 动态ID
        else if (intval($id))
        {
            //发送请求获取动态详情
            $response = Curl_Manager::get_json(Bilibili_Api::GET_DYNAMIC_DETAIL, ['id' => $id]);
            $response_data = $response['data'] ?? null;
            if (empty($response_data))
            {
                throw new Exception('无法获取动态详情');
            }

            //使用动态数据生成详情数据
            $result = Detail_Model::create_by_dynamic_data($response_data);
        }
        else
        {
            throw new Exception('ID参数无效, 必须是BV视频号或者动态ID');
        }

        return $result;
    }

    /**
     *  更新会话里对应请求的进度记录
     *
     * @param int $progress
     * @param int $total
     * @return void
     */
    protected function update_request_progress($progress, $total)
    {
        if ($this->id_request)
        {
            $progress_string = "$progress / $total";

            $key = $this->id_request . Session_Cache::kEY_REQUEST_PROGRESS;
            Session_Cache::set($key, $progress_string);
            // Session_Cache::close_write();
        }
    }


    /**
     * 请求失败计数器+1 , 并检测错误次数是否超过了上限
     *
     * @return void
     * @throws Curl_response_exception 如果错误次数超过上限
     */
    protected function add_error_time_and_check_max_error_time()
    {

        $this->error_time++;

        //如果错误次数达到了上限, 说明请求循环是被强行中断的
        if ($this->error_time === Config::MAX_REQUEST_ERROR_TIME)
        {
            throw new Curl_response_exception('目前无法连接到B站服务器, 请过段时间再试试');
        }
    }

    /**
     * 判断是否触发了B站服务器风控 导致请求被拦截
     *
     * @param array<string,mixed>|string $response
     * @return void
     * @throws Curl_response_exception 如果触发了B站服务器风控
     */
    protected function check_is_triggered_bilibili_firewall($response)
    {
        //B站服务器风控错误码
        $firewall_error_code = 412;

        $exception = new Curl_response_exception('请求过于频繁, 导致触发了B站服务器风控, 请过段时间后再重试');

        //如果是正常JSON回复
        if (is_array($response))
        {
            //但是错误码是412
            $code = $response['code'] ?? 0;
            if (abs($code) === $firewall_error_code)
            {
                throw $exception;
            }
        }
        else if (is_string($response))
        {
            //如果是HTML报错页面 并且包含关键词 412 风控
            if (str_contains($response, 'html') && str_contains($response, $firewall_error_code))
            {
                throw $exception;
            }
        }
    }

    /**
     * 获取请求进度
     *
     * @param int $id_request
     * @return array<string, string>
     */
    public static function get_request_progress($id_request)
    {
        $key = $id_request . Session_Cache::kEY_REQUEST_PROGRESS;
        $result = Session_Cache::get($key);
        // Session_Cache::close_write();

        return [
            'data' => $result,
        ];
    }
}
