<script setup>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock, faCrown, faLink } from "@fortawesome/free-solid-svg-icons";
import { computed, inject } from 'vue';
import { INJECTION_KEY } from '@/constants/injection-key';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { API_ENDPOINT, API_ROOT_URL, RELATION_TYPE } from '@/constants/constants';

const props = defineProps({
    list: {
        type: Array,
        default() {
            return []
        }
    },
    result_status: {
        type: Boolean,
        default: false,
    },

    offset: {
        type: Number,
        default: 0,
    },


})



const login_user = inject(INJECTION_KEY.LOGIN_USER)
const enable_comment_list = inject(INJECTION_KEY.ENABLE_COMMENT_LIST)
const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)
const video_url = inject(INJECTION_KEY.VIDEO_URL)

//动态设置列表的最低高度
const list_min_height = computed(() => {
    const element_height = enable_comment_list.value ? 100 : 72.5
    return element_height * (Math.ceil(props.list.length / 2));
})



/**
 * 检测用户是否是粉丝
 * @param {User_Model} user
 */
function on_click_is_my_fans(user) {

    get_by_fetch(
        API_ROOT_URL,
        {
            action: API_ENDPOINT.CHECK_IS_MY_FANS,
            user_id: user.id, //传递用户ID
        },
        () => {
            //显示加载框
            show_loading_modal(true);
        },
        (response_data) => {

            //更新用户关系信息
            user.relation_type = response_data.relation_type;
            user.relation_type_description = response_data.relation_type_description;
            user.relation_date = response_data.relation_date;

        },
        (error) => {
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

    <!-- 用户列表 -->
    <div class="row align-items-center g-1 position-relative" :style="{ 'min-height': list_min_height + 'px' }">
        <TransitionGroup name="fade">
            <div v-for="(user, index) of props.list" :key="user.key" class="col-6">
                <div class="bg-body-tertiary p-2 rounded-1 border border-white"
                    :class="{ 'border-white': !props.result_status, 'border-pink': props.result_status }">
                    <div class="row align-items-center">
                        <div class="col-auto ">
                            <div class="position-relative">
                                <a :href="'https://space.bilibili.com/' + user.id" class="text-pink fw-bold"
                                    target="_blank">
                                    <img :src="user.avatar" class="avatar rounded-circle "
                                        style="width: 50px; height: 50px;" referrerpolicy="no-referrer"
                                        crossorigin="anonymous" />
                                    <!-- 头像框 -->
                                    <!-- <img v-show="user.pendant" :src="user.pendant"
                                class="pendant rounded-circle position-absolute start-0 z-1"
                                style="width: 70px; height: 70px;" referrerpolicy="no-referrer" /> -->
                                </a>
                            </div>

                        </div>
                        <div class="col col-xxl-7 my-2 my-xxl-0">
                            <div>
                                <a :href="'https://space.bilibili.com/' + user.id" class="text-pink fw-bold"
                                    target="_blank">
                                    {{ user.user_name }}
                                </a>
                            </div>
                            <div v-show="user.date || user.level || user.vip_description" class="smaller my-2">
                                <span v-show="user.date"
                                    class="bg-secondary text-bg-secondary rounded-1 me-1 p-1"><font-awesome-icon
                                        :icon="faClock" class="me-1" /> {{ user.date }}</span>
                                <span v-show="user.level" class="bg-primary text-bg-primary rounded-1 p-1">{{
                                    user.level
                                        ?
                                        'Lv' + user.level : '' }}</span>
                                <span v-show="user.vip_description" class="bg-miku text-bg-miku rounded-1 ms-1 p-1">{{
                                    user.vip_description }}</span>
                            </div>
                            <div v-show="user.content" class="small text-muted one-line-text" :title="user.content">

                                <!-- 如果有回复ID, 就输出定位链接 -->
                                <a v-if="user.reply_id" :href="video_url + '#reply' + user.reply_id" class="ms-2"
                                    title="定位到评论位置" target="_blank"><font-awesome-icon :icon="faLink" /></a>

                                {{ user.content }}

                            </div>
                        </div>
                        <div class="d-xxl-none"></div>
                        <div class="col-auto" :class="{ 'text-pink': props.result_status }">
                            <font-awesome-icon :icon="faCrown" class="me-1" /> {{ offset + index + 1 }}
                        </div>

                        <div class="col-auto ms-auto text-center">

                            <!-- 如果还未检测过关系 -->
                            <template v-if="user.relation_type === null">
                                <!-- 用户已登陆-->
                                <button :disabled="login_user.id === 0" class="btn btn-secondary btn-sm"
                                    @click="on_click_is_my_fans(user)">检测是否是粉丝</button>
                                <div v-if="login_user.id === 0" class="smaller mt-2">
                                    (未登陆 无法检测)</div>

                            </template>
                            <!-- 如果检测过了 -->
                            <template v-else>

                                <div class="small"
                                    :class="{ 'text-pink': user.relation_type === RELATION_TYPE.FOLLOWING || user.relation_type === RELATION_TYPE.MUTUAL_FOLLOWING }">
                                    {{ user.relation_type_description }}</div>
                                <div v-if="user.relation_date" class="smaller">({{ user.relation_date }})</div>

                            </template>


                        </div>

                    </div>
                </div>
            </div>
        </TransitionGroup>

    </div>


</template>

<style scoped>
.one-line-text {
    white-space: nowrap;
    /* 禁止文本换行 */
    overflow: hidden;
    /* 隐藏溢出的文本 */
    text-overflow: ellipsis;
    /* 溢出的文本用省略号表示 */
}

/* .pendant {
    transform: translate(-12.5px, -12.5px);
} */

.avatar {
    transition: .25s;
}

.avatar:hover {
    opacity: .5;
}


.fade-move,
.fade-enter-active,
.fade-leave-active {
    /* transition: all 0.5s ease; */
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}


.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    /* transform: translateX(30px); */
    transform: scaleY(0.01) translate(30px, 0);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.fade-leave-active {
    position: absolute;
}
</style>