<?php

namespace bilibili_dynamic_lottery;

use Exception;

require_once __DIR__ . DIRECTORY_SEPARATOR . 'autoload.php';

class Action
{
    const GET_DETAIL = 'get_detail';

    const GET_COMMENT_LIST = 'get_comment_list';
    const GET_REACTION_LIST = 'get_reaction_list';

    // const GET_FORWARD_LIST = 'get_forward_list';
    // const GET_LIKE_LIST = 'get_like_list';

    const GET_REQUEST_STATUS = 'get_request_status';

    const GET_LOGIN_URL = 'get_login_url';
    const CHECK_LOGIN_STATUS = 'check_login_status';

    // const CHECK_IS_LOGGED_IN = 'check_is_logged_in';

    const GET_LOGGED_USER_INFO = 'get_logged_user_info';

    //检测目标用户是否为 当前登陆用户的粉丝
    const CHECK_IS_MY_FANS = 'check_is_my_fans';

    const TEST = 'test';
}

//设置超时时间 3小时
set_time_limit(60 * 60 * 3);

// //启动会话
// Session_Cache::start();

$action = $_REQUEST['action'] ?? null;

//要获取的动态ID/视频BV号
$id = $_REQUEST['id'] ?? null;
//用来实时跟踪进度的请求ID
$id_request = $_REQUEST['id_request'] ?? null;

$qrcode_key = $_REQUEST['qrcode_key'] ?? null;

$user_id = $_REQUEST['user_id'] ?? null;

$url = $_REQUEST['url'] ?? '';



$detail_service = new Detail_Service($id_request);
$comment_list_service = new Comment_List_Service($id_request);
$reaction_service = new Reaction_Service($id_request);
$login_service = new Login_Service();

try
{

    $result = '';

    switch ($action)
    {
        case Action::GET_DETAIL:

            if (empty($id))
            {
                throw new Exception('缺少id参数', 400);
            }

            $result = $detail_service->get_detail($id);
            Response_flusher::flush_data($result);

            break;

        case Action::GET_COMMENT_LIST:

            if (empty($id))
            {
                throw new Exception('缺少id参数', 400);
            }

            $result = $comment_list_service->get_comment_list($id);
            Response_flusher::flush_file($result);

            break;

        case Action::GET_REACTION_LIST:

            if (empty($id))
            {
                throw new Exception('缺少id参数', 400);
            }
            if (is_bvid($id))
            {
                throw new Exception('点赞列表不支持BV号', 400);
            }

            $result = $reaction_service->get_reaction_list($id);
            Response_flusher::flush_file($result);

            break;

            //@deprecated 
        // case Action::GET_LIKE_LIST:

        //     if (empty($id))
        //     {
        //         throw new Exception('缺少id参数', 400);
        //     }
        //     if (is_bvid($id))
        //     {
        //         throw new Exception('点赞列表不支持BV号', 400);
        //     }

        //     $result = $reaction_service->get_like_list($id);
        //     Response_flusher::flush_file($result);

        //     break;

            //@deprecated 
        // case Action::GET_FORWARD_LIST:

        //     if (empty($id))
        //     {
        //         throw new Exception('缺少id参数', 400);
        //     }
        //     if (is_bvid($id))
        //     {
        //         throw new Exception('转发列表不支持BV号', 400);
        //     }

        //     $result = $reaction_service->get_forward_list($id);
        //     Response_flusher::flush_file($result);

        //     break;


        case Action::GET_REQUEST_STATUS:

            if (empty($id_request))
            {
                throw new Exception('缺少id_request参数', 400);
            }


            $result = Base_Service::get_request_progress($id_request);
            Response_flusher::flush_data($result);

            break;

        case Action::GET_LOGIN_URL:

            $result = $login_service->get_login_url();
            Response_flusher::flush_data($result);

            break;

        case Action::CHECK_LOGIN_STATUS:

            if (empty($qrcode_key))
            {
                throw new Exception('缺少qrcode_key参数', 400);
            }

            $result = $login_service->check_login_status($qrcode_key);
            Response_flusher::flush_data($result);

            break;

            //@deprecated 
        // case Action::CHECK_IS_LOGGED_IN:

        //     $result = $login_service->check_is_logged_in();
        //     Response_flusher::flush_data($result);

        //     break;


        case Action::GET_LOGGED_USER_INFO:

            $result = $login_service->get_logged_user_info();
            Response_flusher::flush_data($result);

            break;

        case Action::CHECK_IS_MY_FANS:

            $result = $login_service->check_is_my_fans($user_id);
            Response_flusher::flush_data($result);

            break;

        //     //测试接口用
        // case Action::TEST:

        //     $query_data =  ['mid' => $id];
        //     $query_data = Bilibili_Wbi_Token::add_wbi_token($query_data);
        //     $response = Curl_Manager::get_json($url, $query_data);
        //     Response_flusher::flush_data($response);
        //     break;

        default:
            throw new Exception('缺少Action参数: ' . $action, 400);
    }
}

catch (Exception $e)
{

    Response_flusher::flush_error($e->getMessage(), $e->getCode());
}
