<?php

namespace bilibili_dynamic_lottery;

class Config
{

    //每次请求失败的最大重试次数 (不包含链接失败的情况)
    const MAX_REQUEST_ERROR_TIME = 3;
}



class Bilibili_Api
{
    //B站默认的API域名
    const ROOT_DOMAIN = 'api.bilibili.com';

    //申请登陆二维码地址
    const GET_LOGIN_URL = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate';

    //检查二维码扫码状态
    const CHECK_LOGIN_STATUS = 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll';

    //获取登陆用户的信息
    const GET_LOGIN_USER_INFO = 'https://api.bilibili.com/x/web-interface/nav';

    //查询用户与自己关系（互相关系）
    const CHECK_IS_MY_FANS = 'https://api.bilibili.com/x/space/wbi/acc/relation';


    //WBI密钥的API请求接口
    const GET_WBI_KEYS = 'https://api.bilibili.com/x/web-interface/nav';

    //视频详情接口
    const GET_VIDEO_DETAIL = 'https://api.bilibili.com/x/web-interface/view';

    //动态详情接口
    const GET_DYNAMIC_DETAIL = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail';
    //动态详情接口(旧版)
    const GET_DYNAMIC_DETAIL_OLD = 'https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail';

    //获取评论列表
    const GET_COMMENT_LIST = 'https://api.bilibili.com/x/v2/reply/wbi/main';

    //获取评论区总数
    const GET_COMMENT_TOTAL_COUNT = 'https://api.bilibili.com/x/v2/reply/count';

    //获取点赞与转发列表
    const GET_REACTION_LIST = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail/reaction';


    /**
     * 如果有提供自定义的代理API域名, 则随机使用一个代理域名
     *
     * @param string $url
     * @return string
     */
    public static function use_custom_proxy_api_bilibili_domain($url)
    {

        //如果有提供自定义的代理API域名数组
        if (defined('CUSTOM_PROXY_API_BILIBILI_DOMAIN'))
        {
            $array_proxy_domain = CUSTOM_PROXY_API_BILIBILI_DOMAIN;

            //使用一个计数器来达到能够按顺序平均分配请求到各个代理API域名的目的
            static $count = mt_rand(0, count($array_proxy_domain) - 1);

            //不是空数组
            if (is_array($array_proxy_domain) && count($array_proxy_domain) > 0)
            {
                //随机获取一个代理API域名
                $index = $count % count($array_proxy_domain);
                $proxy_proxy_domain = $array_proxy_domain[$index];
                //替换默认的API域名
                $url = str_replace(self::ROOT_DOMAIN, $proxy_proxy_domain, $url);

                $count++;
            }
        }

        return $url;
    }
}
