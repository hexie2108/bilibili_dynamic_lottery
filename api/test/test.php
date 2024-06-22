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

    $url = $_REQUEST['url'] ?? '';

    $output = send_request($url);


    $content = <<<HTML

        <form>
            <div class="form-group">
                <label for="exampleInputText">B站API地址</label>
                <input type="text" id="" class="form-control"  placeholder="地址" name="url" value="{$url}">
            </div>
            <button type="submit" class="btn btn-primary">提交</button>
        </form>

        <hr/>

        <div class="raw-output d-none">
            {$output}
        </div>

        <div class="mt-5">
            <div class="output">
            </div>
        </div>

       

HTML;

    return $content;
}

function send_request($url)
{

    $result = '';

    if ($url)
    {
        $result = Curl_Manager::get_json($url);

        $result = json_encode($result);
        // ob_start();
        // var_dump($result);
        // $result = ob_get_clean();
    }


    return $result;
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
            <title>测试页</title>
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
        <script src="test.js"></script>
    </body>
    </html>
HTML;
}
