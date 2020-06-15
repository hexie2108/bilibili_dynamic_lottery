let winnerNumber;
const SPEED = 400;


$(function () {

    $('.start-button').on('click', function (event) {

        event.preventDefault();
        //注销按钮
        $(event.target).attr('disabled', true);

        //获取抽选人数
        winnerNumber = $('#winner-number').val();

        $('.toast2 .toast-title').html("抽选进行中... ");
        $('.toast2').toast('show');

        startGame();

    });


});


/**
 * 开启游戏
 */
function startGame() {

    // 开始新的抽选, 中断结束
    IS_INTERRUPED = false
    //如果剩余人数大于要抽选的人数, 继续抽选
    if (USER_LIST.length > winnerNumber) {

        //随机生成index
        let randomIndex = getRandomInt(0, USER_LIST.length - 1);

        //从页面列表隐藏元素, 然后运行回调函数
        $('.user-list div').eq(randomIndex).fadeOut(removeSpeed(), function () {
            //从页面移除元素
            $(this).remove();
            //从全局INDEX数组中移除
            USER_LIST.splice(randomIndex, 1);
            //更新剩余数量显示
            $('.toast2 .toast-body').html("剩余: " + USER_LIST.length);
            //定时下个循环, 发生中断后中止循环
            if (!IS_INTERRUPED) {
                setTimeout(startGame, removeSpeed());
            }
        });

    //没有发生中断才能正常结束
    } else if (!IS_INTERRUPED) {
        endGame();
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
}

/**
 * 根据列表长度动态设置速度
 * @returns {number}
 */
function removeSpeed() {

    let speedRation = USER_LIST.length / 10;

    if (speedRation > 1) {
        return SPEED / speedRation;
    } else {
        return SPEED;
    }


}
