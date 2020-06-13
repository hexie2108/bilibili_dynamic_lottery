var leftPlayer;
var rightPlayer;

//计时
var time = 0;
//时间周期管理器
var timeInterval;
//攻击周期暂停
var stopAttack = false;

var actionInterval = 500;

var leftFirstAttack;

$(function () {

    $('#start-button').on('click', function (event) {

        event.preventDefault();
        //注销按钮
        $(event.target).attr('disabled', true);

        //开启计时, 每秒更新时间
        timeInterval = setInterval(updateTime, 1000);
        //重置暂停
        stopAttack = false;

        startGame();
    });

    $('#stop-button').on('click', function (event) {
        event.preventDefault();
        //中断攻击
        stopAttack = true;
        //中断计时
        clearInterval(timeInterval);
        //重选激活开始按钮
        $('#start-button').removeAttr('disabled');

    })

    //加速按钮
    $('#speed-up-button').on('click', function (event) {
        event.preventDefault();
        //减少等待时间
        actionInterval -= 100;
    });

});


/**
 * 开启游戏
 */
function startGame() {


    let $leftPlayerElement = $('.main .left-player');
    let $rightPlayerElement = $('.main .right-player');

    //如果未填充或 已阵亡
    if ($leftPlayerElement.find('.avatar img:not(.death)').length === 0) {
        selectNewPlayer($leftPlayerElement, true);
    }
    //如果未填充或 已阵亡
    if ($rightPlayerElement.find('.avatar img:not(.death)').length === 0) {
        selectNewPlayer($rightPlayerElement, false);
    }

    //重置生命
    changeHp(leftPlayer, $leftPlayerElement, 100);
    changeHp(rightPlayer, $rightPlayerElement, 100);

    //显示主体
    $('.main').fadeIn('fast');

    //更新用户数
    $('.user-number').html('剩余用户数: ' + USER_LIST.length);

    //初始化攻击先手
    //生成 0~1
    let randomNumber = getRandomInt(0, 1);
    leftFirstAttack = randomNumber === 1;

    //定时1秒后开始攻击
    setTimeout(function () {
        attack();
    }, actionInterval * 5);
}


/**
 * 填充新玩家
 * @param {Object} $playerElement 玩家主体元素
 * @param {boolean} isLeft 是否是左边玩家
 */
function selectNewPlayer($playerElement, isLeft) {

    let randomIndex = getRandomInt(0, USER_LIST.length - 1);

    //提取被选中用户
    let user = USER_LIST[randomIndex];

    //根据方向, 把用户存储到全局变量中
    if (isLeft) {
        leftPlayer = user;
    }
    else {
        rightPlayer = user
    }

    //从全局数组中移除
    USER_LIST.splice(randomIndex, 1);
    //从页面列表移除
    $('.user-list li').eq(randomIndex).remove();

    //创建图片元素
    let avatar = `<img src="${user.avatar}" class="img-fluid rounded-circle" alt=""/>`;
    //创建等级元素
    let badgeLevel = `
    <span class="badge ${getBgColorClass(user.level - 1)}">Lv ${user.level}</span>`;
    let badgeCareer = `
    <span class="badge ${getBgColorClass(user.career)}">   ${getCareerName(user.career)}</span>
`;

    //更新玩家显示数据
    $playerElement.find('.name').html(user.name);
    $playerElement.find('.avatar').empty().append(avatar);
    $playerElement.find('.attack').html(user.attack);
    $playerElement.find('.defend').html(user.defend);
    $playerElement.find('.dodge').html(user.dodge);
    $playerElement.find('.mortality').html(user.mortality);

    $playerElement.find('.badge-level').empty().append(badgeLevel);
    $playerElement.find('.badge-career').empty().append(badgeCareer);

    printMessage(`"<b class="text-info">${user.name}</b>" 进入战场`);

}

/**
 * 进行攻击动作
 */
function attack() {

    //如果是默认未暂停状态
    if (!stopAttack) {

        let attacker, defender, $attackElement, $defenderElement, moveAnimationStart, moveAnimationEnd;


        if (leftFirstAttack) {
            attacker = leftPlayer;
            defender = rightPlayer;
            $attackElement = $('.main .left-player');
            $defenderElement = $('.main .right-player');
            moveAnimationStart = {marginLeft: '200px'};
            moveAnimationEnd = {marginLeft: '0px'};
        }
        else {
            attacker = rightPlayer;
            defender = leftPlayer;
            $attackElement = $('.main .right-player');
            $defenderElement = $('.main .left-player');
            moveAnimationStart = {marginRight: '100px'};
            moveAnimationEnd = {marginRight: '0px'};
        }


        printMessage(`"<b class="text-info">${attacker.name}</b>" 发动了攻击`);

        //攻击动画
        $attackElement.find('img').animate(moveAnimationEnd, actionInterval, function () {
            //插入攻击音效
            $('audio.attack').eq(attacker.career).trigger('play');
        }).animate(moveAnimationStart, actionInterval / 2).animate(moveAnimationEnd, actionInterval / 2);


        //手动延时
        setTimeout(function () {

            //闪避判断, 随机命中 大于 闪避值 说明攻击成功
            if (getRandomInt(0, 100) > defender.dodge) {

                //伤害判断
                let damage = attacker.attack - defender.defend;
                //如果不破防 强制扣血
                if (damage <= 0) {
                    damage = 1;
                }
                //如果有职业相克 双倍伤害,  骑士 克 弓手, 枪兵 克 骑士, 弓手 克 骑士
                if (attacker.career === (defender.career + 1) % CAREERS.length) {
                    damage *= 2;
                }

                //必杀伤害 加倍
                if (getRandomInt(0, 100) < attacker.mortality) {
                    damage *= 2;
                    printMessage(`<p class="text-danger">"${attacker.name}" 使出了必杀一击, 对 "${defender.name}" 造成了 <b>${damage}</b> 点 必杀伤害</p>`);
                }
                else {
                    printMessage(`"<b class="text-info">${defender.name}</b>" 受到了 <b class="text-danger">${damage}</b> 点 伤害`);
                }


                //受伤害特效
                $defenderElement.find('img').fadeOut(actionInterval / 5).fadeIn(actionInterval / 5).fadeOut(actionInterval / 5).fadeIn(actionInterval / 5);

                //血量更新
                changeHp(defender, $defenderElement, -damage);

                //如果防守方死亡
                if (defender.hp === 0) {

                    //头像变黑白
                    $defenderElement.find('img').addClass('death').css('filter', 'grayscale(1)');
                    //插入死亡音效
                    $('audio.death').eq(getRandomInt(0, 1)).trigger('play');
                    //1秒后退出通知
                    setTimeout(function () {
                        printMessage(`"<b class="text-info">${defender.name}</b>" 已退出战场`);
                    }, actionInterval * 2);


                    //2秒后重选开始新游戏
                    setTimeout(function () {
                        //还有其他用户
                        if (USER_LIST.length > 0) {
                            startGame(attacker);
                        }
                        else {
                            win(attacker);
                        }
                    }, actionInterval * 5);

                }
                else {
                    //插入受伤音效
                    $('audio.hurt').eq(getRandomInt(0, 2)).trigger('play');
                    //等待下一轮攻击
                    setTimeout(attack, actionInterval * 2);
                }
            }
            else {

                //闪避动画
                $defenderElement.find('img').animate(moveAnimationStart, actionInterval / 2).animate(moveAnimationEnd, actionInterval / 2);

                printMessage(`攻击未命中`);
                //等待下一轮攻击
                setTimeout(attack, actionInterval * 2);
            }

            //下轮让对方攻击
            leftFirstAttack = !leftFirstAttack;
        }, actionInterval * 2)
    }

}

/**
 * 输出胜利者信息
 * @param {Object}winner
 */
function win(winner) {
    let $text = `胜利者出现了~ 恭喜 "<b class="text-danger">${winner.name}</b>" 获得了最终的胜利, 稍后将会私信联系您</b>`;
    printMessage($text);
    //暂停时间计时
    clearInterval(timeInterval);
}

/**
 * 输出消息信息
 * @param {string} text
 */
function printMessage(text) {
    $('.message').html(text);

}

/**
 * 设置生命值
 * @param {Object}player
 * @param {Object}$playerElement
 * @param value
 */
function changeHp(player, $playerElement, value) {

    //更新血量
    player.hp += value;
    //避免出现负数 或超过上限
    if (player.hp < 0) {
        player.hp = 0
    }
    if (player.hp > 100) {
        player.hp = 100;
    }
    //更新血量条
    $playerElement.find('.hp').css('width', player.hp + '%').html(player.hp);
}


/**
 * 计算游戏时间
 */
function updateTime() {

    $('.time').html('游戏时间: ' + time + " 秒");
    time++;
}

