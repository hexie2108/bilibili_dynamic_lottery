<?php

//设置当前项目根目录
define('ROOT_DIR', realpath(__DIR__ . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR);
//配置文件目录
define('CONFIG_DIR', ROOT_DIR . 'config' . DIRECTORY_SEPARATOR);
//未登陆用户使用的默认COOKIE文件目录
define('COOKIE_FILE', CONFIG_DIR . 'cookie.txt');

//会话存活时间 1小时
define('SESSION_TIMEOUT', 3600);

//自定义代理API域名的列表, 请自行配置一个访问api.bilibili.com的代理服务器, 配置后在请求数据的过程中将会被随机使用, 这样可以降低默认API域名的使用频率, 减少本程序的请求被B站防火墙屏蔽的几率 (可选)
define('CUSTOM_PROXY_API_BILIBILI_DOMAIN', [
    // 'api.example.com',
    // 'api.example2.com',
]); 

//是否开启DEBUG输出请求信息到error_log日志
define('DEBUG', false);



