const BACKEND_URL = document.location.href + 'dynamic/';

const BILIBILI_URL = 'bilibili.com';


$(function () {

    $('.get-button').on('click', getRepostUser);
    //监听等级墙变化
    $('#level-filter').on('change', resetLevelFilter);


});

/**
 * 等级墙变更后禁用开始抽选按钮
 */
function resetLevelFilter() {
    //禁用开始抽选按钮
    $('.start-button').attr('disabled', true);
}

/**
 * 获取用户列表
 * @param event
 */
function getRepostUser(event) {

    event.preventDefault();


    let $linkInput = $('#dynamic_link');
    let $inputErrorText = $('#dynamic_link_error_text');

    //获取用户类型
    let user_type = $('input[name="user_type"]:checked').val();

    let $toast = $('.toast1');


    let dynamicLink = $.trim($linkInput.val());
    //如果是空值
    if (!dynamicLink) {
        $linkInput.addClass('is-invalid ');
        $toast.children('.toast-body').html("链接为空");
        $toast.toast('show');
    }
    //如果不是哔哩哔哩
    else if (!dynamicLink.includes(BILIBILI_URL)) {
        $linkInput.addClass('is-invalid ');
        $toast.children('.toast-body').html("链接不属于哔哩哔哩");
        $toast.toast('show');
    }
    else {

        //移除错误提示
        $linkInput.removeClass('is-invalid ');

        //提取出 动态id
        let dynamicId;
        let index = dynamicLink.lastIndexOf("/");
        if (index !== -1) {
            dynamicId = dynamicLink.slice(index + 1);
        }
        index = dynamicId.indexOf("?");
        if (index !== -1) {
            dynamicId = dynamicId.slice(0, index);
        }
        index = dynamicId.indexOf("#");
        if (index !== -1) {
            dynamicId = dynamicId.slice(0, index);
        }

        //如果地址错误
        if (isNaN(dynamicId)) {
            $linkInput.addClass('is-invalid ');
            $toast.children('.toast-body').html("动态链接不正确");
            $toast.toast('show');
        }
        else {

            sendRequest(dynamicId, user_type);
        }

    }


}

/**
 * 发送get请求
 * @param {string} dynamicId 动态id
 * @param {string} user_type 用户类型
 */
function sendRequest(dynamicId, user_type) {

    //将被中断标记置为真
    isInterrupted = true
    let $toast = $('.toast1');
    //列表
    let $userListElement = $('.user-list');
    //清空列表
    $userListElement.empty();

    //清空数据列表
    USER_LIST.length = 0;

    //获取等级墙
    let levelFilter = $('#level-filter').val();
    //关闭抽选进行中的Toast
    $('.toast2').toast('hide');
    //注销按钮
    $('.get-button').attr('disabled', true);
    //显示模态加载窗口
    $('.modal').modal('show');

    console.log("获取动态ID " + dynamicId);


    let data = {
        user_type,
    };


    $.getJSON(BACKEND_URL + dynamicId, data, onSuccess).fail(onError).always(onComplete);

    function onSuccess(data) {

        //如果是空列表
        if (data.users.length === 0) {
            onEmptyError();
        }
        else {

            //遍历每个元素
            data.users.forEach(function (user) {

                // 等级过滤
                if (user.level >= levelFilter) {

                    //保存到全局列表
                    USER_LIST.push(user);

                    //创建插入元素到页面
                    let newElement = `
<div class="border col-3 m-2 rounded">
    <a href="https://space.bilibili.com/${user.uid}" id="user-link" target="_blank" class="text-dark text-decoration-none">
        <img class="img-fluid rounded-circle m-1" src="${user.avatar}" alt="${user.name}" referrerPolicy="no-referrer"/>
        <span class="m-1 name small">${user.name}</span>
    </a>
    <span class="badge ${getBgColorClass(user.level - 1)} m-1">
        Lv ${user.level}
    </span>
</div>`;
                    $userListElement.append(newElement);
                }
            });

            // 激活按钮
            $('.start-button').removeAttr('disabled');

            //显示统计信息
            $('.user-count').show();
            //全部用户数
            $('.user-count .badge').eq(0).html(data.totalUserCount);
            //过滤重复后
            $('.user-count .badge').eq(1).html(data.users.length);
            //过滤等级后
            $('.user-count .badge').eq(2).html(USER_LIST.length);


        }

    }

    function onEmptyError() {

        $('.toast .toast-body').html("用户列表为空");
        $toast.toast('show');
    }

    function onError() {

        $('.toast .toast-body').html("获取错误, 请检查后台服务!");
        $toast.toast('show');
    }

    function onComplete() {
        //重新激活按钮
        $('.get-button').removeAttr('disabled');
        //隐藏模态加载窗口
        $('.modal').modal('hide');
    }


}


/**
 * 根据索引大小获取不同颜色的css类名
 * @param index  索引
 * @return string css类名
 */
function getBgColorClass(index) {

    //背景颜色类名列表
    const BG_CLASSES = [
        'bg-secondary',
        'bg-primary',
        'bg-success',
        'bg-info',
        'bg-warning',
        'bg-danger',
    ];

    //避免index超过范围
    index = index % BG_CLASSES.length;

    return BG_CLASSES[index];

}
