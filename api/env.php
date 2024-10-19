<?php

//设置当前项目根目录
define('ROOT_DIR', realpath(__DIR__ . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR);
//配置文件目录
define('CONFIG_DIR', ROOT_DIR . 'config' . DIRECTORY_SEPARATOR);
//未登陆用户使用的默认COOKIE文件目录
define('COOKIE_FILE', CONFIG_DIR . 'cookie.txt');

//会话存活时间 1小时
define('SESSION_TIMEOUT', 3600);

//是否开启DEBUG输出
define('DEBUG', false);



