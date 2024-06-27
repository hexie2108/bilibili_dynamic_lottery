<?php

//设置当前项目根目录
define('ROOT_DIR', realpath(__DIR__ . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR);
//配置文件目录
define('CONFIG_DIR', ROOT_DIR . 'config' . DIRECTORY_SEPARATOR);
//COOKIE文件目录
define('COOKIE_FILE', CONFIG_DIR . 'cookie.txt');

//是否开启DEBUG输出
define('DEBUG', false);

