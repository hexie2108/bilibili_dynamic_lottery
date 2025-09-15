<script setup>
import { API_ENDPOINT, API_ROOT_URL, REACTION_TYPE } from '@/constants/constants';
import { INJECTION_KEY } from '@/constants/injection-key';
import { Detail_Model } from '@/model/detail-model';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { clear_object, get_random_int, is_empty_object } from '@/utils/utils';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faComment, faShare, faThumbsUp, faVideo, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { User_Model } from '@/model/user-model';
import md5 from 'blueimp-md5';

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


const id_request = ref(0);
const array_request_queue = reactive([]);

//判断是否要关闭 加载按钮
const disable_button_get_list = computed(() => {
    return !enable_comment_list.value && !enable_like_list.value && !enable_forward_list.value;
})




/**
 * 加载按钮点击事件
 */
function on_click_get_list() {

    //隐藏列表组件显示
    show_list.value = false;
    //清空列表
    comment_list.length = 0;
    like_list.length = 0;
    forward_list.length = 0;
    user_list.length = 0;


    //清空请求队列
    array_request_queue.length = 0;
    //重新根据加载选项添加对应请求到队列里
    if (enable_comment_list.value) {
        array_request_queue.push(API_ENDPOINT.GET_COMMENT_LIST);
    }
    if (enable_like_list.value || enable_forward_list.value) {
        array_request_queue.push(API_ENDPOINT.GET_REACTION_LIST);
    }


    get_list();

}


//发起数据请求
function get_list() {

    //如果请求队列是空的, 结束运行
    if (array_request_queue.length === 0) {
        return;
    }

    //从队列里提取 请求名称
    const action = array_request_queue.pop();

    //生成随机ID 用来跟踪请求进度
    id_request.value = get_random_int(1, 10000000);

    get_by_fetch(
        API_ROOT_URL,
        {
            action,
            id: video_id.value,
            id_request: id_request.value, //传递请求ID
        },
        () => {
            //显示加载框
            show_loading_modal(true);
            //定时检查请求进度
            set_timeout_get_request_status();
        },
        (response_data) => {

            const array_user_model = response_data.map((element) => new User_Model(element));

            for (const user_model of array_user_model) {
                if (action === API_ENDPOINT.GET_COMMENT_LIST) {
                    comment_list.push(user_model);
                }
                else if (action === API_ENDPOINT.GET_REACTION_LIST) {

                    if (user_model.action === REACTION_TYPE.LIKE) {
                        like_list.push(user_model);
                    }
                    else if (user_model.action === REACTION_TYPE.FORWARD) {
                        forward_list.push(user_model);
                    }
                    else {
                        console.error('未知的互动类型');
                    }

                }
            }


        },
        (error) => {

            //显示错误框
            show_error_modal(true, error.message);
        },
        () => {
            //隐藏加载框
            show_loading_modal(false);

            //取消请求ID
            id_request.value = 0;



            //如果请求队列不是空的, 结束运行
            if (array_request_queue.length > 0) {

                //继续从队列里读取新的请求
                get_list();
            }
            //否则
            else {


                create_user_list();
            }

        }
    )


}





/**
 * 查看请求进度 只要请求ID还存在就 每 3 秒运行一次
 */
function set_timeout_get_request_status() {

    if (id_request.value) {

        get_by_fetch(
            API_ROOT_URL,
            {
                action: API_ENDPOINT.GET_REQUEST_STATUS,
                id_request: id_request.value, //传递请求ID
            },
            null,
            (response_data) => {
                //更新加载进度条的内容
                show_loading_modal(null, response_data.data);
            },
            null,
            () => {
                //当前请求完成后 继续预定 新的定时
                setTimeout(set_timeout_get_request_status, 3000)
            }
        )

    }

}


/**
 * 根据加载选项 合成最终的用户列表
 */
function create_user_list() {


    let temp_list;

    if (enable_comment_list.value) {
        temp_list = comment_list;

        //只保留同时评论和点赞的人
        if (enable_like_list.value) {
            console.log('从评论列表里排除未点赞用户');

            temp_list = temp_list.filter((comment_user) => {

                let result = false;
                for (const like_user of like_list) {
                    if (comment_user.id === like_user.id) {
                        result = true;
                        break;
                    }

                }
                return result;

            });
        }
        //只保留同时评论和转发的人
        if (enable_forward_list.value) {
            console.log('从评论列表里排除未转发用户');

            temp_list = temp_list.filter((comment_user) => {

                let result = false;
                for (const forward_user of forward_list) {
                    if (comment_user.id === forward_user.id) {
                        result = true;
                        break;
                    }

                }
                return result;

            });
        }

    }
    else if (enable_like_list.value) {
        temp_list = like_list;

        //只保留同时点赞和转发的人
        if (enable_forward_list.value) {
            temp_list = temp_list.filter((like_user) => {

                let result = false;
                for (const forward_user of forward_list) {
                    if (like_user.id === forward_user.id) {
                        result = true;
                        break;
                    }

                }
                return result;

            });
        }
    }
    else if (enable_forward_list.value) {
        temp_list = forward_list;
    }
    else {
        temp_list = [];
    }

    //重新生成最终的用户列表 
    user_list.push(...temp_list);
    //检测评论是否为原创评论, 并设置相关信息
    set_comment_duplicate_info();

    //显示列表
    show_list.value = true;

}

/**
 * 检测评论是否为原创评论, 并设置相关信息
 */
function set_comment_duplicate_info() {

    //创建个本地静态储存映射 用来记录识别评论是否是原创的
    const map_hash_content_to_original_comment_info = {};

    //以逆序遍历用户列表 (这样列表将会按照时间顺序从小到大排列被遍历)
    user_list.slice().reverse().map((user) => {

        // 根据评论内容生成key
        const key = md5(user.content.trim());

        // 检索映射
        let original_comment_info = map_hash_content_to_original_comment_info[key] || null;

        //如果当前评论内容已经存在于映射中, 则说明不是原创评论
        if (original_comment_info) {

            // 不是原创评论，次数加1
            original_comment_info.count++;

            // 设置相关属性
            user.original_comment_id = original_comment_info.id;
            user.duplicate_comment_count = original_comment_info.count;

            console.log(user.user_name + ' '+user.duplicate_comment_count);

        }
        //如果不存在, 则说明是原创评论
        else {

            //创建新的映射记录
            original_comment_info = {
                id: user.reply_id,
                count: 0
            };
        }

        //更新映射里的原创评论信息
        map_hash_content_to_original_comment_info[key] = original_comment_info;
    });
}


//如果源列表发生变化
watch(video_id, () => {

    //重置抽选选项状态
    enable_comment_list.value = false;
    enable_like_list.value = false;
    enable_forward_list.value = false;

    //隐藏列表组件显示
    show_list.value = false;
    //清空列表
    comment_list.length = 0;
    like_list.length = 0;
    forward_list.length = 0;
    user_list.length = 0;

})




</script>

<template>

    <div>

        <div class="row justify-content-center align-items-center gy-3 mt-3 border-bottom">

            <div class="col-12 text-center">
                <h3><font-awesome-icon :icon="faVideo" class="me-1" /> 视频/动态详情</h3>
            </div>

            <div class="col-auto">
                <img :src="video_detail.author_avatar" class="rounded-circle" style="width:50px; height:50px;"
                    referrerpolicy="no-referrer" crossorigin="anonymous" />
            </div>
            <div class="col-auto">
                <div class="text-pink fw-bold">{{ video_detail.author_name }}</div>
            </div>
            <div class="col-auto">
                <div class="">{{ video_detail.description }}</div>
            </div>

            <div></div>
        </div>

        <div class="row justify-content-center align-items-center gy-3 mt-3 border-bottom">

            <div class="col-12 text-center">
                <h3><font-awesome-icon :icon="faListCheck" class="me-1" /> 请勾选提取条件</h3>
            </div>

            <div class="col-auto text-center ">

                <div class="border p-2 rounded-start">

                    <div class="form-check form-check-inline">
                        <input v-model="enable_comment_list" :disabled="video_detail.comment_count === 0"
                            class="form-check-input me-3" type="checkbox" id="enable_comment_list">
                        <label :class="{ 'opacity-25': video_detail.comment_count === 0 }" class="form-check-label fs-5"
                            for="enable_comment_list">
                            评论用户 ({{ video_detail.comment_count }})
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input v-model="enable_like_list"
                            :disabled="video_detail.source_type === 'video' || video_detail.like_count === 0"
                            class="form-check-input me-3" type="checkbox" id="enable_like_list">
                        <label
                            :class="{ 'opacity-25': video_detail.source_type === 'video' || video_detail.like_count === 0 }"
                            class="form-check-label fs-5" for="enable_like_list">
                            点赞用户 ({{ video_detail.like_count }})
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input v-model="enable_forward_list"
                            :disabled="video_detail.source_type === 'video' || video_detail.forward_count === 0"
                            class="form-check-input me-3" type="checkbox" id="enable_forward_list">
                        <label
                            :class="{ 'opacity-25': video_detail.source_type === 'video' || video_detail.forward_count === 0 }"
                            class="form-check-label fs-5" for="enable_forward_list">
                            转发用户 ({{ video_detail.forward_count }})
                        </label>
                    </div>


                </div>

            </div>

            <div class="col-auto">

                <div class="">
                    <button :disabled="disable_button_get_list" class="btn btn-lg btn-miku px-4"
                        @click="on_click_get_list">加载</button>
                </div>


            </div>

            <div class="col-12 text-center">

                <div class="my-2 alert alert-danger">
                     <span class="badge text-bg-danger">注意</span> 
                     因为B站服务器逆天的反爬虫机制, 每次发出一定数量的请求, 就被导致本程序的IP被B站拉黑一段时间, 所以如果提示触发了风控错误, 只能等待1小时后再重试, 没有任何解决办法, 或者你可以从本项目的GITHUB上下载源码, 自行部署到本地或者自己的服务器上使用
                     <button type="button" class="btn-close ms-1" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <div v-if="enable_comment_list && (enable_like_list || enable_forward_list)"
                    class="my-2 alert alert-warning">
                    <span class="badge text-bg-danger">注意</span> 勾选了 (评论+点赞 / 评论+转发 / 点赞+转发 / 评论+点赞+转发), 会因为
                    <strong>点赞</strong> 和 <strong>转发</strong> 的数量限制, 在点赞+转发=总数超过1500的情况, 有可能只获取到一小部分的用户列表 (B站接口限制),
                    这种情况建议 只使用评论用户列表来抽奖
                </div>

                <div class="my-2">
                    视频地址只支持加载 <strong>评论用户</strong> | 动态地址支持加载同时
                    <strong>评论</strong>+<strong>点赞</strong>+<strong>转发</strong> 的用户

                </div>
                <div class="my-2">
                    <span class="badge text-bg-danger">注意</span> <strong>评论</strong> 加载只能读取到一级评论和回复评论的二级子评论,
                    不包含回复二级子评论的三级子评论
                </div>
                <div class="my-2">
                    <span class="badge text-bg-danger">注意</span> <strong>点赞</strong> 和 <strong>转发</strong> 加载有数量限制,
                    在点赞+转发=总数超过1500的情况, 有可能只获取到一小部分的用户列表 (B站接口限制), 这种情况建议 只使用评论用户列表来抽奖
                </div>

            </div>

            <div></div>


        </div>

    </div>

</template>

<style scoped>
.form-check-input {
    width: 25px;
    height: 25px;
}
</style>
