<?php

namespace bilibili_dynamic_lottery;

class Config
{

    //每次请求失败的最大重试次数 (不包含链接失败的情况)
    const MAX_REQUEST_ERROR_TIME = 3;
}



class Bilibili_Api
{

    //WBI密钥的API请求接口
    const GET_WBI_KEYS = 'https://api.bilibili.com/x/web-interface/nav';

    //视频详情接口
    const GET_VIDEO_DETAIL = 'https://api.bilibili.com/x/web-interface/view';

    //动态详情接口
    const GET_DYNAMIC_DETAIL = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail';

    //获取评论列表
    const GET_COMMENT_LIST = 'https://api.bilibili.com/x/v2/reply/wbi/main';

    //获取评论区总数
    const GET_COMMENT_TOTAL_COUNT = 'https://api.bilibili.com/x/v2/reply/count';

    //获取点赞与转发列表
    const GET_REACTION_LIST = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/detail/reaction';
}
