<?php

namespace bilibili_dynamic_lottery;

use Exception;

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

class Reaction_Service  extends Base_Service
{
    //假定一个列表最大长度, 如果单次结果超过这个长度, 说明回复肯定有问题
    const MAX_LIST_LENGTH_FOR_SINGLE_REQUEST = 50;

    /**
     * 转发总数
     * @var int
     */
    private $forward_count = 0;

    /**
     * 点赞总数
     * @var int
     */
    private $like_count = 0;

    /**
     * 对应用户列表的总数
     * @var int
     */
    private $total_count = 0;

    /**
     * @deprecated 
     * 获取转发列表里的用户
     * 
     * @param string $id
     * @return resource 包含请求结果的临时文件路径
     */
    public function get_forward_list($id)
    {

        $result = $this->get_reaction_list($id, User_Model::ACTION_FORWARD);

        // //只保留来自于转发列表的用户
        // $result = array_values(array_filter($result, function (User_Model $user)
        // {
        //     return $user->action === User_Model::ACTION_FORWARD;
        // }));


        return $result;
    }

    /**
     * @deprecated
     * 获取点赞列表里的用户
     * 
     * @param string $id
     * @return resource 包含请求结果的临时文件路径
     */
    public function get_like_list($id)
    {

        $result = $this->get_reaction_list($id, User_Model::ACTION_LIKE);

        // //只保留来自于转发列表的用户
        // $result = array_values(array_filter($result, function (User_Model $user)
        // {
        //     return $user->action === User_Model::ACTION_LIKE;
        // }));


        return $result;
    }


    /**
     * 获取 转发+点赞合并列表的用户
     * 
     * @param string $id
     * @param string $action 用来判断要使用的统计列表 (废弃)
     * @return resource 包含请求结果的临时文件路径
     */
    public function get_reaction_list($id, $action = '')
    {

        //设置 转发总数 和 点赞总数
        $this->set_forward_count_and_like_count($id);

        $query_data = [
            'id' => $id,
        ];

        // $global_array_reaction = [];
        $continue_while_flag = true;
        //统计结果进度
        $result_count = 0;
        // 创建一个临时文件用来储存结果
        $temp_result_file = tmpfile();
        //首次写入
        $first_write = true;

        do
        {
            $query_data = Bilibili_Wbi_Token::add_wbi_token($query_data);

            try
            {
                $response = Curl_Manager::get_json(Bilibili_Api::GET_REACTION_LIST, $query_data);
                $response_data = $response['data'] ?? null;

                //提取转发/点赞列表
                $array_reaction = $response_data['items'] ?? null;
                //如果转发/点赞列表不存在
                if (!is_array($array_reaction))
                {
                    //检测是否触发了B站服务器风控
                    $this->check_is_triggered_bilibili_firewall($response);

                    $url = Bilibili_Api::GET_REACTION_LIST . '?' . http_build_query($query_data);
                    //抛出错误 来增加错误计数
                    throw new Exception('无法获取reaction列表:  ' . $url . ' => ' . json_encode($response));
                }

                //如果请求结果里 出现了异常长度的数据, 直接跳出结束循环
                if (count($array_reaction) > static::MAX_LIST_LENGTH_FOR_SINGLE_REQUEST)
                {
                    break;
                }

                //累计储存结果
                // $global_array_reaction = array_merge($global_array_reaction, $array_reaction);

                //把点赞/转发记录 转换成用户对象
                $array_user_model = array_map(function ($reaction)
                {
                    return User_Model::create_by_reaction($reaction);
                }, $array_reaction);
                // //根据动作只保留对应对应类型的用户
                // $array_user_model_filtered = array_values(array_filter($array_user_model, function (User_Model $user) use ($action)
                // {
                //     return $user->action === $action;
                // }));

                //把结果数据写入临时文件
                write_array_to_file($temp_result_file, $array_user_model, $first_write);
                //累计结果数量
                $result_count += count($array_user_model);
                //不是空数组
                if (count($array_user_model) > 0)
                {
                    $first_write = false;
                }

                //实时把请求进度更新在会话缓存里
                $this->update_request_progress($result_count, $this->total_count);

                $has_more = $response_data['has_more'] ?? false;
                $offset = $response_data['offset'] ?? '';
                //如果还有下一页 并且 结果列表长度还是小于 动态详情里的 转发+点赞总数
                if ($has_more === true && $result_count < ($this->total_count))
                {
                    //更新请求参数
                    $query_data['offset'] = $offset;
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
                //记录错误信息
                error_log($e->getMessage());

                //检测是否触发了B站服务器风控
                $this->check_is_triggered_bilibili_firewall($e->getMessage());
                //记录错误次数, 如果错误次数达到了上限, 抛出错误
                $this->add_error_time_and_check_max_error_time();
            }

            //休息1秒后再请求 避免风控
            sleep(1);
        }
        //持续循环直到有自定义错误抛出或者 触发结束循环的flag
        while ($continue_while_flag);

        write_end_array_to_file($temp_result_file);

        return $temp_result_file;

        // //把点赞/转发数据 转换成用户对象
        // $result = array_map(function ($reaction)
        // {
        //     return User_Model::create_by_reaction($reaction);
        // }, $global_array_reaction);

        // return $result;
    }




    /**
     * 设置 转发总数 和 点赞总数
     *
     * @param string $id
     * @return void
     * @throws Exception
     */
    private function set_forward_count_and_like_count($id)
    {
        //获取详情数据
        $detail_model = $this->get_detail($id);

        //从动态详情中提取 转发总数 和 点赞总数
        $this->forward_count = $detail_model->forward_count;
        $this->like_count = $detail_model->like_count;

        // //根据请求类型, 设置对应用户列表的总数
        // if ($action === User_Model::ACTION_FORWARD)
        // {
        //     $this->total_count =  $this->forward_count;
        // }
        // else
        // {
        //     $this->total_count = $this->like_count;
        // }

        $this->total_count = $this->forward_count + $this->like_count;
    }
}

// $x = new Reaction_Service();
// $result = $x->get_reaction_list('945826101515517976');
// echo json_encode($result);
