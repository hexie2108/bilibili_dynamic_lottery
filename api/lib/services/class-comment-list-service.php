<?php

namespace bilibili_dynamic_lottery;

use Exception;

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

class Comment_List_Service extends Base_Service
{


    /**
     * 评论区ID
     *
     * @var int|null
     */
    private $comment_area_id;

    /**
     * 评论类型ID
     *
     * @var int|null
     */
    private $comment_type;

    /**
     * 评论总数
     * @var int
     */
    private $comment_count = 0;

    /**
     * 获取评论列表里的用户
     * 
     * @param string $id
     * @return User_Model[]
     */
    public function get_comment_list($id)
    {
        //设置 评论区ID 和 评论类型
        $this->set_comment_area_id_and_comment_type_id($id);

        $query_data = [
            'type' => $this->comment_type,
            'oid' => $this->comment_area_id,
            'mode' => 2, //只按时间排序,
            'ps' => 30,
        ];


        $global_array_reply = [];
        $continue_while_flag = true;

        do
        {
            $query_data = Bilibili_Wbi_Token::add_wbi_token($query_data);

            try
            {
                $response = Curl_Manager::get_json(Bilibili_Api::GET_COMMENT_LIST, $query_data);
                $response_data = $response['data'] ?? null;

                //提取评论列表
                $array_reply = $response_data['replies'] ?? null;
                //如果评论列表不存在
                if (!is_array($array_reply))
                {
                    //检测是否触发了B站服务器风控
                    $this->check_is_triggered_bilibili_firewall($response['code']);
                    //抛出错误 来增加错误计数
                    throw new Exception('无法获取评论列表');
                }

                //累计储存结果
                $global_array_reply = array_merge($global_array_reply, $array_reply);

                //实时把请求进度更新在会话缓存里
                $this->update_request_progress(count($global_array_reply), $this->comment_count);

                $cursor = $response_data['cursor'] ?? null;
                throw_exception_if_is_null($cursor, '无法获取 cursor 数据');

                //如果还有下一页
                if ($cursor['is_end'] === false)
                {

                    $offset = $cursor['pagination_reply']['next_offset'] ?? null;
                    throw_exception_if_is_null($offset, '无法获取 下一页的 pagination_str 数据');

                    //更新请求参数
                    $query_data['pagination_str'] = json_encode([
                        'offset' => $offset,
                    ]);
                }
                else
                {
                    //更改 结束flag, 退出循环
                    $continue_while_flag = false;
                }
            }
            //如果是自定义错误 直接抛出
            catch (Curl_response_exception $e)
            {
                throw $e;
            }
            //如果出现普通错误
            catch (Exception $e)
            {
                //记录错误次数, 如果错误次数达到了上限, 抛出错误
                $this->add_error_time_and_check_max_error_time();
                //休息2秒后再重试
                sleep(2);
            }
        }
        //持续循环直到有自定义错误抛出或者 触发结束循环的flag
        while ($continue_while_flag);


        $result = [];

        //把评论回复 转换成用户对象
        foreach ($global_array_reply as $reply_comment)
        {
            $model = User_Model::create_by_comment($reply_comment);

            $result[] = $model;

            //如果当前评论有子评论
            foreach ($model->array_replies as $child_reply_user_model)
            {
                //添加到主结果列表
                $result[] = $child_reply_user_model;
            }
            //清空子评论列表
            $model->array_replies = [];
        }

        return $result;
    }


    /**
     * 设置 评论区ID 和 评论类型
     *
     * @param string $id
     * @return void
     * @throws Exception
     */
    private function set_comment_area_id_and_comment_type_id($id)
    {
        //获取详情数据
        $detail_model = $this->get_detail($id);

        //从动态详情中提取 评论区ID 和 评论类型 和 评论总数
        $this->comment_area_id = $detail_model->comment_area_id;
        $this->comment_type = $detail_model->comment_type;
        $this->comment_count = $detail_model->comment_count;
    }
}

// $x = new Comment_List_Service();
// $result = $x->get_comment_list('942831233970208823');
// echo json_encode($result);
