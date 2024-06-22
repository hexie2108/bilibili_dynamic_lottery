<?php

namespace bilibili_dynamic_lottery;

use Exception;

require_once __DIR__ .DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

try
{
    // 输出页面内容
    echo_page(get_content());
}
catch (Exception $e)
{
    echo($e->getMessage());
}

function get_content()
{


    $content = <<<HTML

        <form>
            <div class="form-group">
                <label>JSON字符串</label>
                <textarea class="raw-output form-control"></textarea>
            </div>
            <div class="submit btn btn-primary">提交</div>
        </form>

        <hr/>

        <div class="mt-5">
            <div class="output">
            </div>
        </div>

       

HTML;

    return $content;
}



// 定义一个函数来输出页面头部和引入 Bootstrap 库
function echo_page($content)
{

    echo <<<HTML
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>JSON解析</title>
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
        <div class="container py-3">
            {$content}
        </div> <!-- 关闭 container -->
        
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/pgrabovets/json-view@master/dist/jsonview.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
        <script src="json.js"></script>
    </body>
    </html>
HTML;
}
