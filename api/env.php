<?php

//设置当前项目根目录
define('ROOT_DIR', realpath(__DIR__ . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR);
//配置文件目录
define('CONFIG_DIR', ROOT_DIR . 'config' . DIRECTORY_SEPARATOR);
//COOKIE文件目录
define('COOKIE_FILE', CONFIG_DIR . 'cookie.txt');

//是否开启DEBUG输出
define('DEBUG', false);

//是否要关闭CORS跨域安全检测
// define('DISABLE_CORS', true);

//前端JS文件所属的域名 (用来解决CORS问题)
define('FRONT_END_JS_DOMAIN', 'http://localhost:8080');
