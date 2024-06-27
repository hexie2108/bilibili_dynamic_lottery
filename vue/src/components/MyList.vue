<script setup>
import { computed, onMounted, reactive, ref, inject, watchEffect, watch } from "vue"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock, faCrown } from "@fortawesome/free-solid-svg-icons";
import VueDatePicker from '@vuepic/vue-datepicker';
import { clear_object, format_date_to_string, parse_date_string } from "@/utils/utils";

import { INJECTION_KEY } from '@/constants/injection-key';
import { API_ENDPOINT } from "@/constants/constants";

//最大页面上展示的列表数量
const MAX_DISPLAY_USER_LIST = 500

const ARRAY_LEVEL_OPTION = [
    '',
    1,
    2,
    3,
    4,
    5,
    6
]

const { user_list,  user_list_type } = defineProps({
    user_list: {
        type: Array,
        default() {
            return []
        }
    },
    // user_list_key: {
    //     type: Number,
    //     default: 0,
    // },
    user_list_type: {
        type: String,
        default: '',
    },
})

const set_error_modal_options = inject(INJECTION_KEY.SET_ERROR_MODAL_OPTIONS)
const set_loading_modal_options = inject(INJECTION_KEY.SET_LOADING_MODAL_OPTIONS)

//避免DOM复用导致图片无法加载
// const user_list_key_local = ref(1)

/**
 * 过滤器
 */
const number_people_selected_filter = ref(1)
const repeat_comment_filter = ref(true)
const min_level_filter = ref('')
const vip_filter = ref(false)
const content_filter = ref('')
const date_comment_filter_start = ref(null)
const date_comment_filter_end = ref(null)

/**
 * 抽选结果控制器
 */

const result_status = ref(false)
const result_end_time = ref('')
//被抽中的用户ID列表
const result_user_id_list = reactive([])

//当前是否是评论列表
const is_comment_list = computed(() => {
    return user_list_type === API_ENDPOINT.GET_COMMENT_LIST
})

const filtered_list = computed(() => {

    let user_list_to_filter = user_list

    //只有是评论列表的时候 才启用的过滤器
    if (is_comment_list.value) {

        //过滤重复评论用户
        if (repeat_comment_filter.value === true) {
            const id_set = new Set();
            //使用set 和id属性 来过滤掉数组里重复的用户
            user_list_to_filter = user_list_to_filter.filter(user => {
                let result;
                if (id_set.has(user.id)) {
                    result = false;
                } else {
                    result = true;
                    id_set.add(user.id);
                }
                return result;
            });
        }





        //用户等级过滤
        if (min_level_filter.value !== '') {

            user_list_to_filter = user_list_to_filter.filter(user => {
                return user.level >= min_level_filter.value
            });

        }

        //VIP过滤
        if (vip_filter.value === true) {

            user_list_to_filter = user_list_to_filter.filter(user => {
                return user.vip !== ''
            });

        }

        //评论内容过滤
        if (content_filter.value !== '') {
            user_list_to_filter = user_list_to_filter.filter(user => {
                return user.content.includes(content_filter.value)
            });
        }

        //如果最早评论时间
        if (date_comment_filter_start.value) {
            user_list_to_filter = user_list_to_filter.filter(user => {
                return parse_date_string(user.date) >= parse_date_string(date_comment_filter_start.value);
            });
        }

        //如果最晚评论时间
        if (date_comment_filter_end.value) {
            user_list_to_filter = user_list_to_filter.filter(user => {
                return parse_date_string(user.date) <= parse_date_string(date_comment_filter_end.value);
            });
        }

    }

    //如果已抽完
    if (result_status.value) {

        //只显示中奖用户
        user_list_to_filter = user_list_to_filter.filter(user => {
            return result_user_id_list.includes(user.id)
        });
    }

    return user_list_to_filter
})

//页面上显示用的数组
const display_filtered_list = computed(() => {

    //限制页面上显示的元素数量, 避免浏览器卡死
    return filtered_list.value.slice(0, MAX_DISPLAY_USER_LIST);

})

//如果源列表发生变化 重置抽奖状态
watch(user_list, () => {
    reset_result_status()
})

/**
 * 随机选出胜利者
 */
function calculate_array_result_list() {

    // 检查 抽选人数 是否是大于 1 的整数
    if (!Number.isInteger(number_people_selected_filter.value) || number_people_selected_filter.value < 1) {
        set_error_modal_options(true, '抽选人数无效')
        return
    }

    // 检查 抽选人数 是否小于或等于数组的长度
    if (number_people_selected_filter.value > filtered_list.value.length) {
        set_error_modal_options(true, '抽选人数必须小于或等于参加人数')
        return
    }

    //显示加载框
    set_loading_modal_options(true, '抽选中')

    //记录抽出的index
    const index_list = new Set();

    do {
        //根据参加列表 生成一个随机index
        const random_index = Math.floor(Math.random() * filtered_list.value.length);

        //如果该元素还未被抽中
        if (!index_list.has(random_index)) {
            //记录index 避免重复抽中
            index_list.add(random_index);

            //保存抽中的用户ID
            result_user_id_list.push(filtered_list.value[random_index].id);
        }
    }
    //循环直到抽满所需人数
    while (result_user_id_list.length < number_people_selected_filter.value)

    //隐藏加载框
    set_loading_modal_options(false, '')

    //抽完后 激活抽选结果flag
    result_status.value = true
    //记录抽奖时间
    result_end_time.value = format_date_to_string(new Date())

    //避免DOM复用导致图片无法加载
    // user_list_key_local.value++

}


/**
 * 重置用户中奖状态
 */
function reset_result_status() {

    result_status.value = false;
    result_end_time.value = '';

    //清空抽中用户数组
    result_user_id_list.length = 0;



}


onMounted(() => {
    // date_comment_filter_start.value = new Date();
    // date_comment_filter_end.value = new Date();
})




</script>

<template>

    <div>

        <hr />

        <div class="row justify-content-center gy-2">
            <div class="col-12 col-xl-10 ">
                <div class="bg-body-secondary rounded p-2 my-2 text-center">
                    请选择想要开启的过滤器
                    <span v-show="!is_comment_list" class="small">(更多的过滤器只有在抽取评论的时候才能用)</span>
                </div>
            </div>

            <div class="col-12 col-xl-10">

                <div class="input-group">
                    <div class="input-group-text">
                        要抽选的人数
                    </div>
                    <input v-model.number="number_people_selected_filter" class="form-control" type="number" min=1
                        :disabled="result_status" />

                    <template v-if="is_comment_list">

                        <div class="input-group-text">
                            <span>同用户多次评论</span>
                        </div>
                        <select class="form-select" v-model="repeat_comment_filter" :disabled="result_status">
                            <option :value="false">不限制</option>
                            <option :value="true">只保留一次</option>
                        </select>



                        <div class="input-group-text">
                            最低等级
                        </div>
                        <select class="form-select" v-model="min_level_filter" :disabled="result_status">
                            <option v-for="(value, index) of ARRAY_LEVEL_OPTION" :key="index" :value="value">{{
                                value === '' ? '不限制' : value }}</option>
                        </select>
                        <div class="input-group-text">
                            VIP会员
                        </div>
                        <select class="form-select" v-model="vip_filter" :disabled="result_status">
                            <option :value="false">不限制</option>
                            <option :value="true">只保留VIP会员用户</option>
                        </select>
                    </template>
                </div>


            </div>

            <div v-if="is_comment_list" class="col-12 col-xl-10">

                <div class="input-group">
                    <div class="input-group-text">
                        评论内容包含
                    </div>
                    <input v-model.lazy="content_filter" class="form-control" type="text" placeholder="不限制"
                        :disabled="result_status" />
                    <div class="input-group-text">
                        最早评论时间
                    </div>
                    <div>
                        <VueDatePicker v-model="date_comment_filter_start" auto-apply placeholder="不限制" locale="zh"
                            format="yyyy-MM-dd HH:mm:ss" :disabled="result_status" />
                    </div>

                    <div class="input-group-text">
                        最晚评论时间
                    </div>

                    <div>
                        <VueDatePicker v-model="date_comment_filter_end" auto-apply placeholder="不限制" locale="zh"
                            format="yyyy-MM-dd HH:mm:ss" :disabled="result_status" />
                    </div>
                </div>


            </div>

            <div class="col-12 col-xl-10 text-center">

                <div class="row justify-content-center">
                    <div class="col-4">
                        <div class="bg-body-secondary rounded p-2 my-2">
                            总提取到的人数 <span class="fw-bold">{{ user_list.length }}</span>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="bg-body-secondary rounded p-2 my-2 ">
                            过滤后的参加抽选人数 <span class="fw-bold">{{ filtered_list.length }}</span>
                        </div>
                    </div>

                </div>

                <button v-show="!result_status" class="btn btn-outline-primary btn-lg mt-2"
                    @click="calculate_array_result_list">开始抽选</button>
                <button v-show="result_status" class="btn btn-outline-secondary btn-lg mt-2"
                    @click="reset_result_status">重置列表&重新抽选</button>

            </div>

            <div v-show="result_status" class="col-12 col-xl-10 text-center">

                <div class="bg-pink text-bg-success rounded p-2 my-2 fw-bold">
                    {{ result_end_time }} 抽选完成 结果如下
                </div>

            </div>

        </div>

        <hr />

        <!-- 用户列表 -->
        <div class="row align-items-center g-1">
            <TransitionGroup name="fade">
                <div v-for="(user, index) of display_filtered_list"
                    :key="user.id" class="col-6">
                    <div class="bg-body-tertiary p-2 rounded-1 border border-white"
                        :class="{ 'border-white': !result_status, 'border-pink': result_status }">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <div class="position-relative">
                                    <a :href="'https://space.bilibili.com/' + user.id" class="text-pink fw-bold"
                                        target="_blank">
                                        <img :src="user.avatar" class="avatar rounded-circle "
                                            style="width: 50px; height: 50px;" referrerpolicy="no-referrer" crossorigin="anonymous" />
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
                                    <span v-show="user.vip_description"
                                        class="bg-miku text-bg-miku rounded-1 ms-1 p-1">{{
                                            user.vip_description }}</span>
                                </div>
                                <div v-show="user.content" class="small text-muted one-line-text" :title="user.content">
                                    {{ user.content }}
                                </div>
                            </div>
                            <div class="col-auto" :class="{ 'text-pink': result_status }">
                                <font-awesome-icon :icon="faCrown" class="me-1" /> {{ index + 1 }}
                            </div>

                        </div>
                    </div>
                </div>
            </TransitionGroup>

        </div>

        <!-- 如果列表超过显示上限-->
        <div v-if="filtered_list.length > MAX_DISPLAY_USER_LIST" class=" my-2">
            <div class="bg-secondary text-bg-secondary rounded p-2 my-2 fw-bold text-center">
                列表长度已超过显示上限 {{ MAX_DISPLAY_USER_LIST }}， 为避免浏览器卡顿 后续数据不会直接在页面上显示，这不影响参加抽选
            </div>
        </div>
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
    transition: all 0.5s ease;
}


.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.fade-leave-active {
    position: absolute;
}
</style>
