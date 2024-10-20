<script setup>
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { INJECTION_KEY } from '@/constants/injection-key';
import { Detail_Model } from '@/model/detail-model';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { clear_object, is_empty_object } from '@/utils/utils';
import { inject, reactive, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faComment, faShare, faThumbsUp, faGift } from '@fortawesome/free-solid-svg-icons';
const emit = defineEmits(['get_list', 'clear_list'])

const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)

const video_id = inject(INJECTION_KEY.VIDEO_ID)
const video_detail = inject(INJECTION_KEY.VIDEO_DETAIL)

const url = ref('')


/**
 * 搜索按钮点击事件
 */
function on_click_get_detail() {

    //如果链接为空, 中断运行
    if (!url.value) {
        return;
    }

    const video_id = extra_url_id(url.value);

    //如果无法提取出数据ID
    if (!video_id) {
        const error_message = `
        无法识别链接, 工具目前支持的格式为: <br/> 
        https://www.bilibili.com/video/BV1XXXXX, <br/> 
        https://www.bilibili.com/opus/XXX, <br/> 
        https://t.bilibili.com/XXXXX
        `
        show_error_modal(true, error_message);
        return;
    }


    set_video_id_and_video_detail(video_id);

}



/**
 * 从URL地址中提取中ID
 * @param {string} url 
 * @returns {string}
 */
function extra_url_id(url) {

    let url_id = '';

    //检测是否是视频地址 提取BV号 ES: https://www.bilibili.com/video/BV1uK411Y7zq
    let match = url.match(/\/video\/(BV[a-zA-Z0-9]+)/);
    url_id = match ? match[1] : null;

    //如果还是空的
    if (!url_id) {

        //检测是否是动态地址 提取动态ID ES: https://www.bilibili.com/opus/946564354908618775
        match = url.match(/\/opus\/([0-9]+)/);
        url_id = match ? match[1] : null;
    }

    //如果还是空的
    if (!url_id) {
        //检测是否是旧版动态地址 提取动态ID ES: https://t.bilibili.com/946584094577262596
        match = url.match(/\/t.bilibili.com\/([0-9]+)/);
        url_id = match ? match[1] : null;
    }

    return url_id;

}


/**
 * 发送请求获取视频/动态详情
 * 设置 视频/动态ID和详情信息
 * @param {string} id
 */
function set_video_id_and_video_detail(id) {

    get_by_fetch(
        API_ROOT_URL,
        {
            action: API_ENDPOINT.GET_DETAIL,
            id,
        },
        () => {
            //显示加载框
            show_loading_modal(true);
        },
        (response_data) => {

            video_id.value = id;
            video_detail.assign(response_data);

        },
        (error) => {
            video_id.value = '';
            //清空详情对象属性
            clear_object(video_detail);
            //显示错误框
            show_error_modal(true, error.message);
        },
        () => {
            //隐藏加载框
            show_loading_modal(false);
        }
    )


}

</script>

<template>



    <div class="row justify-content-center gy-3 border-bottom">

        <div class="col-12 text-center">
            <img src="/logo.png" style="width: 150px">

        </div>

        <div class="col-12 text-center">



            <h3>
                <font-awesome-icon :icon="faGift" class="me-1" />
                请输入B站网页版里的视频地址/动态地址 (不支持 b23.tv 短链)
            </h3>

        </div>

        <div class="col-12">
            <!-- 搜索框 -->
            <div class="input-group input-group-lg">
                <input class="form-control text-center text-body-secondary" type="url" v-model.trim="url" placeholder=""
                    @keyup.enter="on_click_get_detail" />
                <button class="btn btn-miku" @click="on_click_get_detail">搜索</button>
            </div>

        </div>


        <div class="col-12 text-center">

            <div class="my-2">
                本工具可以从B站 (视频/动态) 中提取出 (评论/转发/点赞) 用户列表, 然后随机选出中奖者
            </div>

            <div class="my-2">
                <span class="badge text-bg-miku">2024-11</span> 新增检测用户是否完成评论+点赞+转发全部要求的功能: 允许过滤未完成3项的用户
            </div>
            <div class="my-2">
                <span class="badge text-bg-miku">2024-11</span> 新增B站账号登陆功能: 登陆后再查询, 能增加提取数据的成功率, 还能查询目前用户是否为自己的粉丝
            </div>
        </div>

        <div class="col"></div>

    </div>

</template>

<style scoped></style>
