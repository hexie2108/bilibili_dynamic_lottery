<?php

namespace bilibili_dynamic_lottery;

//导入环境变量
require_once 'env.php';

//导入函数
foreach (array_merge(
    glob(__DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'constants' . DIRECTORY_SEPARATOR . '*.php'),
    glob(__DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'functions' . DIRECTORY_SEPARATOR . '*.php')
) as $file_path)
{
    require_once $file_path;
}

//导入类
spl_autoload_register(function ($class)
{
    //rimuovere eventuale namespace dalla nome di classe
    $array_file_name = explode('\\', $class);
    $file_name = array_pop($array_file_name);

    //替换成小写
    $file_name = strtolower($file_name);
    //把下划线 替换成破折号
    $file_name = 'class-' . str_replace("_", "-", $file_name);

    //cercare class file nei percorsi specificati
    foreach (array_merge(
        //glob($theme_lib_directory . 'old_class' . DIRECTORY_SEPARATOR . $file_name . '.php'),
        glob(__DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'class' . DIRECTORY_SEPARATOR . $file_name . '.php'),
        glob(__DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'services' . DIRECTORY_SEPARATOR . $file_name . '.php'),
        glob(__DIR__ . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'model' . DIRECTORY_SEPARATOR . $file_name . '.php')
    ) as $php_file)
    {
        //effettua require se trova 
        require_once $php_file;
    }
});
