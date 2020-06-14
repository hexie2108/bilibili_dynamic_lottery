const BACKEND_URL = document.location.href + 'dynamic/';

const BILIBILI_URL = 'bilibili.com';


//背景颜色类名列表
const BG_CLASSES = [
    'badge-secondary',
    'badge-primary',
    'badge-success',
    'badge-info',
    'badge-warning',
    'badge-danger',
];
//职业名列表
const CAREERS = [
    {
        name: '骑士',
        range: {
            attackMin: 25,
            attackMax: 35,
            defendMin: 10,
            defendMax: 15,
            dodgeMin: 0,
            dodgeMax: 10,
            mortalityMin: 0,
            mortalityMax: 5,
        }
    },
    {
        name: '枪兵',
        range: {
            attackMin: 30,
            attackMax: 40,
            defendMin: 5,
            defendMax: 10,
            dodgeMin: 5,
            dodgeMax: 15,
            mortalityMin: 5,
            mortalityMax: 10,
        }
    },
    {
        name: '弓手',
        range: {
            attackMin: 25,
            attackMax: 30,
            defendMin: 0,
            defendMax: 5,
            dodgeMin: 10,
            dodgeMax: 30,
            mortalityMin: 10,
            mortalityMax: 25,
        }
    }
];


$(function () {

    $('#get-button').on('click', getRepostUser);

});

/**
 * 获取用户列表
 * @param event
 */
function getRepostUser(event) {

    event.preventDefault();


    let $linkInput = $('#dynamic_link');
    let $inputErrorText = $('#dynamic_link_error_text');

    let dynamicLink = $.trim($linkInput.val());
    //如果是空值
    if (!dynamicLink) {
        $linkInput.addClass('is-invalid ');
        $inputErrorText.html("链接为空");
        $inputErrorText.fadeIn('slow');
    }
    //如果不是哔哩哔哩
    else if (!dynamicLink.includes(BILIBILI_URL)) {
        $linkInput.addClass('is-invalid ');
        $inputErrorText.html("链接不是哔哩哔哩的");
        $inputErrorText.fadeIn('slow');
    }
    else {


        //移除错误提示
        $linkInput.removeClass('is-invalid ');
        $inputErrorText.fadeOut('slow');

        //提取出 动态id
        let index = dynamicLink.lastIndexOf("/");
        if (index !== -1) {
            dynamicLink = dynamicLink.slice(index + 1);
        }
        index = dynamicLink.indexOf("?");
        if (index !== -1) {
            dynamicLink = dynamicLink.slice(0, index);
        }
        index = dynamicLink.indexOf("#");
        if (index !== -1) {
            dynamicLink = dynamicLink.slice(0, index);
        }

        //如果地址错误
        if (isNaN(dynamicLink)) {
            $linkInput.addClass('is-invalid ');
            $inputErrorText.html("动态地址填写错误");
            $inputErrorText.fadeIn('slow');
        }
        else {

            sendRequest(dynamicLink);
        }

    }


}

/**
 * 发送get请求
 * @param {string} dynamicId 动态id
 */
function sendRequest(dynamicId) {

    //注销按钮
    $('#get-button').attr('disabled', true);

    console.log("获取动态ID " + dynamicId)

    //列表
    let $userListElement = $('.user-list');
    //清空列表
    $userListElement.empty();

    let $loading = $('#loading');
    //现实进度条
    $loading.fadeIn('slow');


    $.getJSON(BACKEND_URL + dynamicId, onSuccess).fail(onError).always(onComplete);

    function onSuccess(data) {

        //如果是空列表
        if (data.length === 0) {
            onEmptyError();
        }
        else {

            //遍历每个元素
            data.forEach(function (user) {

                //添加创建额外数值
                user = Object.assign(user, generateCareer(user));
                //保存到全局列表
                USER_LIST.push(user);

                //创建插入元素到页面
                let newElement = `
<li class='list-group-item' id="user-${user.uid}">
    <img class="img-fluid rounded-circle " src="${user.avatar}" alt="${user.name}" referrerPolicy="no-referrer"/>
    <span class="m-1 name small">
        ${user.name}
    </span>
    <span class="badge ${getBgColorClass(user.level - 1)} m-1">
        Lv ${user.level}
    </span>
    <span class="badge ${getBgColorClass(user.career)} m-1">
    ${getCareerName(user.career)}
    </span>
    
</li>`;
                $userListElement.append(newElement);
            });


            $('#start-button').removeAttr('disabled');
            $('#stop-button').removeAttr('disabled');
            $('#speed-up-button').removeAttr('disabled');

        }

    }

    function onEmptyError() {
        alert("转发用户列表为空!");
    }

    function onError() {
        alert("获取错误, 请检查后台服务!");
    }

    function onComplete() {
        //隐藏进度条
        $loading.fadeOut('slow');
    }


}

/**
 * 设置职业id, 0 = 骑士, 1 = 枪兵, 2 = 射手
 * @return {number}
 */
function generateCareer(user) {

    let gameData = {};

    //随机职业ID
    let careerIndex = getRandomInt(0, CAREERS.length - 1);
    gameData.career = careerIndex;
    gameData.hp = 100;
    gameData.attack = getRandomInt(CAREERS[careerIndex].range.attackMin + user.level * 3, CAREERS[careerIndex].range.attackMax + user.level * 3);
    gameData.defend = getRandomInt(CAREERS[careerIndex].range.defendMin + user.level * 3, CAREERS[careerIndex].range.defendMax + user.level * 3);
    gameData.dodge = getRandomInt(CAREERS[careerIndex].range.dodgeMin + user.level * 1, CAREERS[careerIndex].range.dodgeMax + user.level * 2);
    gameData.mortality = getRandomInt(CAREERS[careerIndex].range.mortalityMin + user.level * 2, CAREERS[careerIndex].range.mortalityMax + user.level * 2);

    return gameData;

}


/**
 * 获取职业名
 * @param {number} careerIndex 职业id
 * @return {string} 职业名
 */
function getCareerName(careerIndex) {
    //避免index超过范围
    careerIndex = careerIndex % CAREERS.length;
    return CAREERS[careerIndex].name;
}

/**
 * 根据索引大小获取不同颜色的css类名
 * @param index  索引
 * @return string css类名
 */
function getBgColorClass(index) {

    //避免index超过范围
    index = index % BG_CLASSES.length;

    return BG_CLASSES[index];

}


