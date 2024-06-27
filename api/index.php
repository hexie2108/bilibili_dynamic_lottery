<?php

namespace bilibili_dynamic_lottery;

use Exception;

require_once __DIR__ . DIRECTORY_SEPARATOR . 'autoload.php';

class Action
{
    const GET_DETAIL = 'get_detail';

    const GET_COMMENT_LIST = 'get_comment_list';
    const GET_FORWARD_LIST = 'get_forward_list';
    const GET_LIKE_LIST = 'get_like_list';

    const GET_REQUEST_STATUS = 'get_request_status';
}

//启动会话
// Session_Cache::start();

$action = $_REQUEST['action'] ?? null;

//要获取的动态ID/视频BV号
$id = $_REQUEST['id'] ?? null;
//用来实时跟踪进度的请求ID
$id_request = $_REQUEST['id_request'] ?? null;

// //等级过滤器
// $level_filter = $_REQUEST['level_filter'] ?? null;
// //会员过滤器
// $vip_filter = $_REQUEST['vip_filter'] ?? null;
// //评论内容过滤器
// $content_filter = $_REQUEST['content_filter'] ?? null;


$detail_service = new Detail_Service($id_request);
$comment_list_service = new Comment_List_Service($id_request);
$reaction_service = new Reaction_Service($id_request);

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

            break;

        case Action::GET_COMMENT_LIST:

            if (empty($id))
            {
                throw new Exception('缺少id参数', 400);
            }

            $result = $comment_list_service->get_comment_list($id);

            break;

        case Action::GET_FORWARD_LIST:

            if (empty($id))
            {
                throw new Exception('缺少id参数', 400);
            }
            if (is_bvid($id))
            {
                throw new Exception('转发列表不支持BV号', 400);
            }

            $result = $reaction_service->get_forward_list($id);

            break;

        case Action::GET_LIKE_LIST:

            if (empty($id))
            {
                throw new Exception('缺少id参数', 400);
            }
            if (is_bvid($id))
            {
                throw new Exception('点赞列表不支持BV号', 400);
            }

            $result = $reaction_service->get_like_list($id);

            break;

        case Action::GET_REQUEST_STATUS:

            if (empty($id_request))
            {
                throw new Exception('缺少id_request参数', 400);
            }


            $result = Base_Service::get_request_progress($id_request);

            break;

        default:
            throw new Exception('缺少Action参数', 400);
    }

    Response_flusher::flush_data($result);
}

catch (Exception $e)
{

    Response_flusher::flush_error($e->getMessage(), $e->getCode());
}
