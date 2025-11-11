<script setup>


import MyList from '@/components/content/MyList.vue'
import { computed, onMounted, onBeforeUnmount, reactive, ref, inject, watch, watchEffect } from "vue"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock, faCrown, faFilter, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import VueDatePicker from '@vuepic/vue-datepicker';
import { clear_object, format_date_to_string, parse_date_string, parse_date_string_to_timestamp } from "@/utils/utils";

import { INJECTION_KEY } from '@/constants/injection-key';
import { API_ENDPOINT, REPEAT_COMMENT_FILTER_OPTIONS } from "@/constants/constants";

const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)

const video_id = inject(INJECTION_KEY.VIDEO_ID)
const video_detail = inject(INJECTION_KEY.VIDEO_DETAIL)
const enable_comment_list = inject(INJECTION_KEY.ENABLE_COMMENT_LIST)
const enable_like_list = inject(INJECTION_KEY.ENABLE_LIKE_LIST)
const enable_forward_list = inject(INJECTION_KEY.ENABLE_FORWARD_LIST)

const show_list = inject(INJECTION_KEY.SHOW_LIST);
const comment_list = inject(INJECTION_KEY.COMMENT_LIST);
const like_list = inject(INJECTION_KEY.LIKE_LIST);
const forward_list = inject(INJECTION_KEY.FORWARD_LIST);
const user_list = inject(INJECTION_KEY.USER_LIST);


const login_user = inject(INJECTION_KEY.LOGIN_USER)
const show_login_modal = inject(INJECTION_KEY.SHOW_LOGIN_MODAL)

//最大页面上展示的列表数量
const MAX_DISPLAY_USER_LIST = 100

const ARRAY_LEVEL_OPTION = [
    '',
    1,
    2,
    3,
    4,
    5,
    6
]



/**
 * 过滤器
 */
const number_people_selected_filter = ref(1)
const repeat_comment_filter = ref(REPEAT_COMMENT_FILTER_OPTIONS.ONLY_FIRST_USER_COMMENT)
const min_level_filter = ref('')
const vip_filter = ref(false)
const content_filter = ref('')
const date_comment_filter_start = ref(null)
const date_comment_filter_end = ref(null)
const only_fans = ref(false);

const list_offset = ref(0)

/**
 * 抽选结果控制器
 */

const result_status = ref(false)
const result_end_time = ref('')

//中奖者用户列表
const result_winner_list = reactive([])

const copyFormatOptions = [
    {
        key: 'nameUid',
        label: '复制“名字 UID”',
        example: '小明 12345678',
        formatter: (user) => `${user.user_name} ${user.id}`,
        joiner: '\n',
    },
    {
        key: 'mentionUid',
        label: '复制“@名字 UID”',
        example: '@小明 12345678',
        formatter: (user) => `@${user.user_name} ${user.id}`,
        joiner: '\n',
    },
    {
        key: 'mentionOnly',
        label: '复制“@名字 …”',
        example: '@小明 @小红 @小刚',
        formatter: (user) => `@${user.user_name}`,
        joiner: ' ',
    },
]

const copySignature = '本次抽奖由【初音社】开奖工具开奖'

const copyFormatLookup = copyFormatOptions.reduce((map, option) => {
    map[option.key] = option
    return map
}, {})

const copyStatus = reactive({
    message: '',
    type: 'success',
})

let copyStatusTimer = null


const filtered_list = computed(() => {

    const id_set = new Set(); // 用于过滤重复用户ID

    //创建一个副本, 反转数组顺序, 过滤元素, 恢复数组顺序
    return user_list.slice().reverse().filter(user => {
        let result = true;

        // 只保留每个用户的首条评论（基于 user.id）
        if (repeat_comment_filter.value === REPEAT_COMMENT_FILTER_OPTIONS.ONLY_FIRST_USER_COMMENT) {
            if (id_set.has(user.id)) {
                result = false;
            } else {
                id_set.add(user.id);
            }
        }

        // 只有是评论列表的时候 才启用的过滤器
        if (enable_comment_list.value) {

            //过滤 非原创评论
            if (result && repeat_comment_filter.value === REPEAT_COMMENT_FILTER_OPTIONS.ONLY_ORIGINAL_COMMENT) {
                // 如果是原创评论，original_comment_id 应该为 0
                result = user.original_comment_id === 0;
            }

            // 用户等级过滤
            if (result && min_level_filter.value !== '') {
                result = user.level >= Number(min_level_filter.value); // 确保比较的是数字
            }

            // VIP过滤
            if (result && vip_filter.value === true) {
                result = user.vip && user.vip !== ''; // 确保 user.vip 存在且不为空
            }

            // 评论内容过滤 (包含关键词)
            if (result && content_filter.value !== '') {
                result = user.content.includes(content_filter.value);
            }

            // 最早评论时间过滤
            if (result && date_comment_filter_start.value) {
                result = parse_date_string(user.date) >= parse_date_string(date_comment_filter_start.value);
            }

            // 最晚评论时间过滤
            if (result && date_comment_filter_end.value) {
                result = parse_date_string(user.date) <= parse_date_string(date_comment_filter_end.value);
            }




        }
        return result;
    }).reverse();
});

// 辅助函数示例 (你需要根据你的日期格式实现)
// function parse_date_string(dateStr) {
//     // 例如: return new Date(dateStr).getTime();
//     // 或使用更健壮的日期解析库如 date-fns 或 moment.js
//     // 确保能处理你项目中的日期格式
//     return new Date(dateStr).getTime(); // 示例，返回时间戳以便比较
// }



//页面上显示用的数组
const display_filtered_list = computed(() => {

    //限制页面上显示的元素数量, 避免浏览器卡死
    return filtered_list.value.slice(list_offset.value, list_offset.value + MAX_DISPLAY_USER_LIST);

})

// //如果源列表发生变化 重置抽奖状态
// watch(props.user_list, () => {
//     reset_result_status()
// })

watchEffect(() => {

    //通过监听器, 在过滤列表产生变化的时候重置 offset分页
    list_offset.value = filtered_list.value ? 0 : 0;

});

/**
 * 随机选出胜利者
 */
function calculate_array_result_list() {

    // 检查 抽选人数 是否是大于 1 的整数
    if (!Number.isInteger(number_people_selected_filter.value) || number_people_selected_filter.value < 1) {
        show_error_modal(true, '抽选人数无效')
        return
    }
    // 检查 抽选人数 是否小于或等于数组的长度
    if (number_people_selected_filter.value > filtered_list.value.length) {
        show_error_modal(true, '抽选人数必须小于或等于参加人数')
        return
    }
    //显示加载框
    show_loading_modal(true, '抽选中')
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
            // result_user_id_list.push(filtered_list.value[random_index].id);
            //保存抽中的用户对象
            result_winner_list.push(filtered_list.value[random_index]);
        }
    }
    //循环直到抽满所需人数
    // while (result_user_id_list.length < number_people_selected_filter.value)
    while (result_winner_list.length < number_people_selected_filter.value)
    //隐藏加载框
    show_loading_modal(false, '')

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
    // result_user_id_list.length = 0;

    result_winner_list.length = 0;

}

function buildWinnerCopyText(formatKey) {
    const format = copyFormatLookup[formatKey]
    if (!format || result_winner_list.length === 0) {
        return ''
    }
    const rows = result_winner_list.map((user) => format.formatter(user).trim()).filter(Boolean)
    if (rows.length === 0) {
        return ''
    }
    const body = rows.join(format.joiner).trim()
    if (!body) {
        return copySignature
    }
    return `${body}\n\n${copySignature}`
}

function setCopyStatus(message, type = 'success') {
    copyStatus.message = message
    copyStatus.type = type
    if (copyStatusTimer) {
        clearTimeout(copyStatusTimer)
    }
    copyStatusTimer = setTimeout(() => {
        copyStatus.message = ''
    }, 2500)
}

async function writeTextToClipboard(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return
    }
    if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (successful) {
            return
        }
    }
    throw new Error('Clipboard API is not available')
}

async function copyWinnerList(formatKey) {
    const text = buildWinnerCopyText(formatKey)
    if (!text) {
        setCopyStatus('暂无可复制的中奖名单', 'danger')
        return
    }
    try {
        await writeTextToClipboard(text)
        setCopyStatus('中奖名单复制成功', 'success')
    } catch (error) {
        setCopyStatus('复制失败，请手动选择文本复制', 'danger')
    }
}

onBeforeUnmount(() => {
    if (copyStatusTimer) {
        clearTimeout(copyStatusTimer)
    }
})







// onMounted(() => {
//     // date_comment_filter_start.value = new Date();
//     // date_comment_filter_end.value = new Date();
// })




</script>

<template>
    <div>
        <div v-if="user_list.length > 0">

            <div class="row justify-content-center gy-2">
                <div class="col-12 ">
                    <div class="p-2 my-2 text-center">
                        <h3><font-awesome-icon :icon="faFilter" class=" me-1" /> 请选择想要开启的过滤器</h3>
                        <div v-show="!enable_comment_list" class="small">(更多的过滤器只有在抽取评论的时候才能用)</div>
                    </div>
                </div>

                <div class="col-3">
                    <div class="p-2 my-2 fs-5 text-center">
                        未过滤前的用户人数 <span class="fw-bold">{{ user_list.length }}</span>
                    </div>
                </div>
                <div class="col-3">
                    <div class="rounded p-2 my-2 fs-5 text-center">
                        过滤后的用户人数 <span class="fw-bold">{{ filtered_list.length }}</span>
                    </div>
                </div>

                <div class="col-12 col-xl-10">

                    <div class="input-group">
                        <div class="input-group-text">
                            要抽选的人数
                        </div>
                        <input v-model.number="number_people_selected_filter" class="form-control" type="number" min=1
                            :disabled="result_status" />

                        <div class="input-group-text">
                            <span>过滤重复用户</span>
                            <!-- <span v-if="enable_comment_list">同用户多次评论</span>
                        <span v-else>同用户多次转发/点赞</span> -->
                        </div>
                        <select class="form-select" v-model="repeat_comment_filter" :disabled="result_status">
                            <option :value="REPEAT_COMMENT_FILTER_OPTIONS.NONE">{{
                                REPEAT_COMMENT_FILTER_OPTIONS.get_description(REPEAT_COMMENT_FILTER_OPTIONS.NONE) }}
                            </option>
                            <option :value="REPEAT_COMMENT_FILTER_OPTIONS.ONLY_FIRST_USER_COMMENT">{{
                                REPEAT_COMMENT_FILTER_OPTIONS.get_description(REPEAT_COMMENT_FILTER_OPTIONS.ONLY_FIRST_USER_COMMENT)
                            }}
                            </option>

                            <!-- 原创评论选项只有在评论列表的时候才生效 -->
                            <option v-if="enable_comment_list"
                                :value="REPEAT_COMMENT_FILTER_OPTIONS.ONLY_ORIGINAL_COMMENT">{{
                                    REPEAT_COMMENT_FILTER_OPTIONS.get_description(REPEAT_COMMENT_FILTER_OPTIONS.ONLY_ORIGINAL_COMMENT)
                                }}
                            </option>

                        </select>

                        <template v-if="enable_comment_list">


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

                <div v-if="enable_comment_list" class="col-12 col-xl-10">

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



                    <button v-show="!result_status" class="btn btn-miku btn-lg mt-2"
                        @click="calculate_array_result_list">开始抽选</button>
                    <button v-show="result_status" class="btn btn-secondary btn-lg mt-2"
                        @click="reset_result_status">重置列表&重新抽选</button>

                </div>

                <div v-show="result_status" class="col-12 col-xl-10 text-center">

                    <div class="bg-pink text-bg-success rounded p-2 my-2 fw-bold">
                        {{ result_end_time }} 抽选完成 结果如下
                    </div>

                </div>

                <div v-show="result_status" class="col-12 col-xl-10">
                    <div class="card shadow-sm p-3 text-start">
                        <div class="d-flex flex-column gap-3">
                            <div class="fw-semibold">中奖名单一键复制</div>
                            <div class="d-flex flex-column flex-md-row flex-wrap gap-3">
                                <div v-for="option in copyFormatOptions" :key="option.key"
                                    class="d-flex flex-column gap-1">
                                    <button type="button" class="btn btn-outline-primary btn-sm fw-semibold"
                                        @click="copyWinnerList(option.key)">
                                        {{ option.label }}
                                    </button>
                                    <span class="small text-muted">示例：{{ option.example }}</span>
                                </div>
                            </div>
                            <p v-if="copyStatus.message" class="small mb-0"
                                :class="copyStatus.type === 'success' ? 'text-success' : 'text-danger'">
                                {{ copyStatus.message }}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <hr />

            <!-- 参加用户列表 -->
            <MyList v-show="!result_status" :list="display_filtered_list" :result_status="result_status"
                :offset="list_offset" />

            <!-- 中奖用户列表 -->
            <MyList v-show="result_status" :list="result_winner_list" :result_status="result_status" />


            <!-- 分页切换 -->
            <div v-show="!result_status && filtered_list.length > MAX_DISPLAY_USER_LIST"
                class="my-2 row justify-content-center align-items-center">
                <div class="col-auto">
                    <button v-show="list_offset > 0" class="btn btn-outline-secondary px-4"
                        @click="list_offset -= MAX_DISPLAY_USER_LIST">上一页</button>
                </div>
                <div class="col-1">
                    <div class="bg-body-secondary rounded p-2 my-2 text-center"> {{ list_offset / MAX_DISPLAY_USER_LIST
                        + 1
                    }} / {{
                            Math.ceil(filtered_list.length / MAX_DISPLAY_USER_LIST) }} </div>
                </div>
                <div class="col-auto">
                    <button v-show="(list_offset + MAX_DISPLAY_USER_LIST) < filtered_list.length"
                        class="btn btn-outline-secondary px-4"
                        @click="list_offset += MAX_DISPLAY_USER_LIST">下一页</button>
                </div>
            </div>

            <!-- 如果列表超过显示上限-->
            <!-- <div v-show="!result_status && filtered_list.length > MAX_DISPLAY_USER_LIST" class=" my-2">
            <div class="bg-secondary text-bg-secondary rounded p-2 my-2 fw-bold text-center">
                列表长度已超过显示上限 {{ MAX_DISPLAY_USER_LIST }}， 为避免浏览器卡顿 后续数据不会直接在页面上显示，这不影响参加抽选
            </div>
        </div> -->

        </div>
        <div v-else>
            <h3 class="text-center my-4"><font-awesome-icon :icon="faTriangleExclamation" class=" me-1" /> 未提取到符合要求的用户
            </h3>
        </div>
    </div>

</template>

<style scoped></style>
