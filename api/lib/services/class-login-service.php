<?php

namespace bilibili_dynamic_lottery;

use Exception;


class Login_Service extends Base_Service
{

    /**
     * 获取B站登陆二维码URL
     *
     * @return Login_Model
     * @throws Exception
     */
    public function get_login_url()
    {

        //发送请求获取登陆链接
        $response = Curl_Manager::get_json(Bilibili_Api::GET_LOGIN_URL);
        $response_data = $response['data'] ?? null;
        if (empty($response_data))
        {
            throw new Exception('无法获取登陆地址');
        }

        $result = new Login_Model($response_data);

        return $result;
    }

    /**
     * 检测登陆链接是否已完成扫码登陆
     *
     * @param $qrcode_key 登陆链接的ID
     * @return boolean
     * @throws Exception
     */
    public function check_login_status($qrcode_key)
    {

        //发送请求查询登陆状态
        $response = Curl_Manager::get_json(Bilibili_Api::CHECK_LOGIN_STATUS, [
            'qrcode_key' => $qrcode_key,
        ], true);
        $response_data = $response['data'] ?? null;
        if (empty($response_data))
        {
            throw new Exception('无法查询二维码登陆状态');
        }

        $code = $response_data['code'] ?? '';
        //如果状态码不是0, 说明有错误
        if (intval($code) !== 0)
        {
            $message = $response_data['message'] ?? '';
            throw new Exception('登陆错误: ' . $message);
        }

        //从请求的header里 提取出B站返回的 Cookie
        preg_match_all('/^Set-Cookie:\s*([^;]*)/mi', $response['header'] ?? '', $matches);
        $array_cookies = $matches[1] ?? [];

        //如果顺利获取到了 cookie 数组
        if (is_array($array_cookies) && $array_cookies)
        {
            $cookies_string = implode('; ', $array_cookies);
            Session_Cache::set(Session_Cache::BILIBILI_COOKIE, $cookies_string);
        }
        else
        {
            throw new Exception('无法读取到账号COOKIE: ' . json_encode($array_cookies));
        }

        return true;
    }


    /**
     * 获取已登陆用户信息
     *
     * @return Login_User_Model
     */
    public function get_logged_user_info()
    {

        $is_logged = $this->check_is_logged_in();
        if ($is_logged === false)
        {
            throw new Exception('用户未登陆');
        }

        $response = Curl_Manager::get_json(Bilibili_Api::GET_LOGIN_USER_INFO);
        Curl_Manager::check_response_error_code($response);
        $response_data = $response['data'] ?? null;
        if (empty($response_data))
        {
            throw new Exception('无法获取登陆用户信息');
        }

        $result = new Login_User_Model($response_data);
        return $result;
    }


    /**
     * 检测目标用户是否是 已登陆用户的粉丝
     *
     * @param int $user_id
     * @return Relation_Model 
     * @throws Exception
     */
    public function check_is_my_fans($user_id)
    {

        $is_logged = $this->check_is_logged_in();
        if ($is_logged === false)
        {
            throw new Exception('用户未登陆');
        }

        $query_data = ['mid' => $user_id];
        $query_data = Bilibili_Wbi_Token::add_wbi_token($query_data);

        $response = Curl_Manager::get_json(Bilibili_Api::CHECK_IS_MY_FANS, $query_data);
        Curl_Manager::check_response_error_code($response);
        $response_data = $response['data'] ?? null;
        $be_relation = $response_data['be_relation'] ?? null;
        if (empty($response_data) || empty($be_relation))
        {
            throw new Exception('无法获取用户是否关注信息');
        }

        $result = new Relation_Model($be_relation);
        return $result;
    }



    /**
     * 判断用户是否已登陆 (有cookie信息)
     *
     * @return boolean
     */
    private function check_is_logged_in()
    {

        $cookies_string = Session_Cache::get(Session_Cache::BILIBILI_COOKIE);

        // return $cookies_string;
        return $cookies_string ? true : false;
    }
}
