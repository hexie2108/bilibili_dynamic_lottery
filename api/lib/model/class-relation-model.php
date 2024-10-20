<?php

namespace bilibili_dynamic_lottery;

use DateTime;
use DateTimeZone;
use Exception;

/**
 * 用户关系相关模型
 */
class Relation_Model
{
    /**
     * 关系属性 0：未关注 , 2：已关注 , 6：已互粉 , 128：已拉黑
     * @var string
     */
    public $relation_type;
    public $relation_type_description;

    /**
     * 关注 时间
     * @var string
     */
    public $relation_date;


    /**
     *
     * @param array<string,mixed> $a_data
     * @throws Exception 如果缺少必要参数
     */
    public function __construct($a_data)
    {
        $this->relation_type = $a_data['attribute'] ?? '';
        switch ($this->relation_type)
        {
            case 0:
                $this->relation_type_description = '不是粉丝';
                break;
            case 2:
                $this->relation_type_description = '是粉丝';
                break;
            case 6:
                $this->relation_type_description = '已互粉';
                break;
            case 128:
                $this->relation_type_description = '已被拉黑';
                break;
        }

        $mtime = $a_data['mtime'] ?? '';
        if ($mtime)
        {
            $date = new DateTime();
            //把时间戳转换成时间对象
            $date->setTimestamp($mtime);
            // 设置时区为北京时间（UTC+8）
            $date->setTimezone(new DateTimeZone('Asia/Shanghai'));

            //格式化输出
            $this->relation_date = $date->format('Y-m-d H:i:s');
        }
    }
}
