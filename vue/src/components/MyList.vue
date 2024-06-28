<script setup>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock, faCrown } from "@fortawesome/free-solid-svg-icons";
import { computed } from 'vue';

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

    is_comment_list: {
        type: Boolean,
        default: false,
    },
})

//动态设置列表的最低高度
const list_min_height = computed(() => {
    const element_height = props.is_comment_list ? 100 : 72.5
    return element_height * (Math.ceil(props.list.length / 2));
})


</script>

<template>

    <!-- 用户列表 -->
    <div class="row align-items-center g-1 position-relative" :style="{ 'min-height': list_min_height + 'px' }">
        <TransitionGroup name="fade">
            <div v-for="(user, index) of props.list" :key="user.key" class="col-6">
                <div class="bg-body-tertiary p-2 rounded-1 border border-white"
                    :class="{ 'border-white': !props.result_status, 'border-pink': props.result_status }">
                    <div class="row align-items-center">
                        <div class="col-auto">
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
                        <div class="col-9">
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
                                {{ user.content }}
                            </div>
                        </div>
                        <div class="col-auto" :class="{ 'text-pink': props.result_status }">
                            <font-awesome-icon :icon="faCrown" class="me-1" /> {{ offset + index + 1 }}
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