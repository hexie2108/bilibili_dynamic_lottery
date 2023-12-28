let winnerNumber;
const SPEED = 300;


$(function () {

    $('.start-button').on('click', function (event) {

        event.preventDefault();
        //注销按钮
        $(event.target).attr('disabled', true);

        //获取抽选人数
        winnerNumber = $('#winner-number').val();

        $('.toast2 .toast-title').html("抽选进行中... ");
        $('.toast2').toast('show');

        // 开始新的抽选, 中断结束
        isInterrupted = false;

        startGame();

    });


});


/**
 * 开启游戏
 */
function startGame() {

    //没有发生中断才继续执行抽选
    if (!isInterrupted) {

        //如果剩余人数大于要抽选的人数, 继续抽选
        if (USER_LIST.length > winnerNumber) {

            //随机生成index
            let randomIndex = getRandomInt(0, USER_LIST.length - 1);

            let $element = $('.user-list > div').eq(randomIndex);

            //从全局INDEX数组中移除
            USER_LIST.splice(randomIndex, 1);


            //如果数量大于500 并且 不是500的整除, 或者 大于50 , 并且不是50的整除, 直接进入下一个循环
            if ((USER_LIST.length >= 500 && USER_LIST.length % 500 !== 0 ) || (USER_LIST.length < 500 && USER_LIST.length >= 50 && USER_LIST.length % 50 !== 0)) {

                //从页面移除元素
                $element.remove();

                //直接删除
                startGame();
            }
            else {

                //更新剩余数量显示
                $('.toast2 .toast-body').html("剩余: " + USER_LIST.length);

                //运行淡出动画 之后再继续删除
                $element.fadeOut(SPEED, function () {

                    //从页面移除元素
                    $element.remove();

                    //下个循环
                    startGame();

                    //定时下个循环
                    //setTimeout(startGame, SPEED);

                });

            }




        }
        else {
            endGame();
        }

    }


}

/**
 * 结束游戏
 */
function endGame() {


    let winnerName = '';

    for (let i = 0; i < USER_LIST.length; i++) {
        winnerName += USER_LIST[i].name + " , ";
    }

    console.log("抽奖已结束");

    $('.toast2 .toast-title').html("抽选已结束");
    $('.toast2 .toast-body').html("恭喜中奖者: " + winnerName);

    //高量中奖者
    $('.user-list .user-item').addClass('border-success border-2');
    $('.user-list .user-item .name').addClass('text-success fw-bold');
    
}

