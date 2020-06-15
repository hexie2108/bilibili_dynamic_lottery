//全局用户列表
const USER_LIST = [];
//全局记录被中断标志，用于判定抽选过程被中断
let IS_INTERRUPED = false;




/**
 * 获取随机整数
 * @param min
 * @param max
 * @return {number}
 */
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
