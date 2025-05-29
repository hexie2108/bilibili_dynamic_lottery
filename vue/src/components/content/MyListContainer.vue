<script setup>


import MyList from '@/components/content/MyList.vue'
import { computed, onMounted, reactive, ref, inject, watch, watchEffect } from "vue"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock, faCrown, faFilter, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import VueDatePicker from '@vuepic/vue-datepicker';
import {clear_object, format_date_to_string, parse_date_string, parse_date_string_to_timestamp} from "@/utils/utils";

import { INJECTION_KEY } from '@/constants/injection-key';
import { API_ENDPOINT } from "@/constants/constants";

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
const repeat_comment_filter = ref('earliest_long_identical')
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

// //当前是否是评论列表
// const is_only_comment_list = computed(() => {
//     return enable_comment_list.value && !enable_like_list.value && !enable_forward_list.value
// })

// 为 "earliest_long_identical" 过滤器预计算每种处理后内容的最早日期
const earliestDatesByContent = {};
function make_comment_dict(){
    for (const user of user_list) {
      let processedContent = user.content;
      if (content_filter.value !== '') {
        // 假设 content_filter.value 是一个普通字符串，需要全局替换
        // 为了安全起见，如果 content_filter.value 可能包含正则特殊字符，需要先转义
        processedContent = user.content.replace(content_filter, '');
      }
      const userDateTimestamp = parse_date_string_to_timestamp(user.date); // 确保返回可比较的值，如时间戳

      if (!earliestDatesByContent[processedContent]) {
        earliestDatesByContent[processedContent]={}
      }
      earliestDatesByContent[processedContent][userDateTimestamp] = user
      user.relation_comment = earliestDatesByContent[processedContent]
    }
}

const filtered_list = computed(() => {
  if (earliestDatesByContent){
    make_comment_dict()
  }


  const id_set = new Set(); // 用于过滤重复用户ID

  return user_list.filter(user => {
    let result = true;

    // 过滤重复评论用户（基于 user.id）
    // 注意："last_user_comment" 根据当前逻辑是保留用户首次出现的评论
    if (["last_user_comment", "earliest_long_identical"].includes(repeat_comment_filter.value)) {
      if (id_set.has(user.id)) {
        // 如果 "last_user_comment" 真的是要最后一个，这里的逻辑需要完全重写，
        // 可能需要对 user_list 按用户和时间排序预处理。
        // 当前逻辑是：如果用户ID已存在，则过滤掉（即保留第一个出现的）
        result = false;
      } else {
        id_set.add(user.id);
      }
    }

    // 只有是评论列表的时候 才启用的过滤器
    if (enable_comment_list.value) {
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

      // 内容相同但时间最早的评论过滤器 (earliest_long_identical)
      // 这个过滤器依赖于上面已经通过 id_set 的用户。
      // 如果一个用户有多条内容相同的评论，并且这条是该用户最早的，但不是所有用户中最早的，行为需要明确。
      // 当前 id_set 的逻辑会先按用户去重（保留第一个），然后再应用这个。
      // 如果 earliest_long_identical 应该独立于用户去重，id_set 的条件需要调整。
      // 假设这里的目的是：在通过了前面的用户去重（如果开启了）之后，再应用此规则。
      if (result && repeat_comment_filter.value === 'earliest_long_identical') {
        let processedContent = user.content;
        if (content_filter.value !== '') {
          processedContent = user.content.replace(content_filter, '');
        }
        // 用户评论的日期必须等于预计算的该内容的最早日期
        if (processedContent.length >=10){
          let comment_time = parse_date_string_to_timestamp(user.date)
          for (const other_comment_time in earliestDatesByContent[processedContent]) {
            if (other_comment_time < comment_time && earliestDatesByContent[processedContent][other_comment_time].id !== user.id){
              user.relation_comment_is_slef = false
              result = false;
            }
            else {
              user.relation_comment_is_slef = true
            }
          }
        }
      }
    }
    return result;
  });
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
                          <option value="no_filter">不限制</option>
                          <option value="last_user_comment">只保留同用户最后一次评论</option>
                          <option value="earliest_long_identical">保留相同长评论的最早一次</option>
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

            </div>

            <hr />

            <!-- 参加用户列表 -->
            <MyList v-show="!result_status" :list="display_filtered_list" :result_status="result_status"
                :offset="list_offset"  />

            <!-- 中奖用户列表 -->
            <MyList v-show="result_status" :list="result_winner_list" :result_status="result_status"
                 />


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
