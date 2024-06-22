<?php

namespace bilibili_dynamic_lottery;

use Exception;

/**
 * 检测是否属于DEBUG模式
 *
 * @return boolean
 */
function is_debug()
{
    // @phpstan-ignore-next-line
    return defined('DEBUG') && DEBUG === true;
}

/**
 * 检测id参数是否是BV视频ID
 *
 * @param string $id
 * @return boolean
 */
function is_bvid($id)
{
    //如果id参数是以BV1开头 + 长度为12字符串
    return substr($id, 0, 3) === 'BV1' && strlen($id) === 12;
}

/**
 * 把BV号 转换成 AV号
 *
 * @param string $bvid
 * @return int 解析后的AV号数字 (没有'AV'前缀)
 */
function bv_to_av($bvid)
{
    $data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    $xor_code = 23442827791579;
    $mask_code = 2251799813685247;
    $base = 58;

    // 将字符串 $bvid 分割成字符数组
    $bvidArr = str_split($bvid);

    // 交换第 4 个和第 10 个字符的位置
    list($bvidArr[3], $bvidArr[9]) = [$bvidArr[9], $bvidArr[3]];

    // 交换第 5 个和第 8 个字符的位置
    list($bvidArr[4], $bvidArr[7]) = [$bvidArr[7], $bvidArr[4]];

    // 删除数组的前 3 个元素
    array_splice($bvidArr, 0, 3);

    // 使用 array_reduce 函数将字符数组转换为一个整数
    $tmp = array_reduce($bvidArr, function ($carry, $char) use ($data, $base)
    {
        return $carry * $base + strpos($data, $char);
    }, 0);

    return ($tmp & $mask_code) ^ $xor_code;
}

/**
 * 检测数值是否为null, 如果是null 弹出错误
 *
 * @param mixed|null $value
 * @param string $error_message
 * @return void
 * @throws Exception 如果数值为null
 */
function throw_exception_if_is_null($value, $error_message)
{
    if (is_null($value))
    {
        throw new Exception($error_message);
    }
}
