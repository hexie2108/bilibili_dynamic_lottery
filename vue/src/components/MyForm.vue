<script setup>
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { INJECTION_KEY } from '@/constants/injection-key';
import { Detail_Model } from '@/model/detail-model';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { clear_object, is_empty_object } from '@/utils/utils';
import { inject, reactive, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faComment, faShare, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const emit = defineEmits(['get_list', 'clear_list'])

const set_error_modal_options = inject(INJECTION_KEY.SET_ERROR_MODAL_OPTIONS)
const set_loading_modal_options = inject(INJECTION_KEY.SET_LOADING_MODAL_OPTIONS)

const url = ref('')
const id = ref('')
const detail = reactive(new Detail_Model)

const selected_method = ref('')


/**
 * 发送请求获取详情
 */
function get_detail() {

    //如果链接为空, 中断运行
    if (!url.value) {
        return;
    }

    id.value = extra_url_id(url.value);

    //如果无法提取出数据ID
    if (!id.value) {
        const error_message = `
        无法识别链接, 工具目前支持的格式为: <br/> 
        https://www.bilibili.com/video/BV1XXXXX, <br/> 
        https://www.bilibili.com/opus/XXX, <br/> 
        https://t.bilibili.com/XXXXX
        `
        set_error_modal_options(true, error_message);
    }


    get_by_fetch(
        API_ROOT_URL,
        {
            action: API_ENDPOINT.GET_DETAIL,
            id: id.value,
        },
        () => {
            //显示加载框
            set_loading_modal_options(true);
        },
        (response_data) => {
            detail.assign(response_data);
        },
        (error) => {
            //清空详情对象属性
            clear_object(detail);
            //显示错误框
            set_error_modal_options(true, error.message);
        },
        () => {
            //隐藏加载框
            set_loading_modal_options(false);

            //重置抽选方式
            selected_method.value = '';
            //清空已存在的用户列表
            emit('clear_list');
        }
    )


}

/**
 * 向父组件发送 get list 事件
 */
function send_event_get_list() {
    emit('get_list', selected_method.value, id.value)
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

</script>

<template>


    <div class="form row justify-content-center">

        <!-- 搜索框 -->
        <div class="col-12 col-xl-10">

            <div class="bg-miku text-bg-miku rounded p-2 my-2 fw-bold">
                本工具可以从B站 (视频/动态) 中提取出 (评论/转发/点赞) 用户列表, 然后随机选出中奖者
            </div>
            
            <div class="bg-body-secondary rounded p-2 my-2">
                视频地址只支持 <strong>评论</strong> 抽取 | 动态地址支持 <strong>评论</strong>/<strong>点赞</strong>/<strong>转发</strong> 抽取
            </div>
             


          

            <div class="input-group input-group-lg">
                <input class="form-control" type="url" v-model.trim="url" placeholder="请输入B站网页版里的视频地址/动态地址"
                    @keyup.enter="get_detail" />
                <button class="btn btn-outline-primary" @click="get_detail">搜索</button>
            </div>

        </div>

        <div class="m-0"></div>

        <!-- 显示提取到的数据详情 -->
        <div v-show="!is_empty_object(detail)" class="col-12 col-xl-10">


            <div class="row g-1">

                <div class="col">

                    <div class=" bg-body-secondary rounded p-2 my-2 text-center">
                        搜索到的视频/动态
                    </div>

                    <div class="row align-items-center">
                        <div class="col-auto">
                            <img :src="detail.author_avatar" class="rounded-circle" style="width:50px; height:50px;"
                                referrerpolicy="no-referrer" crossorigin="anonymous" />
                        </div>
                        <div class="col">
                            <div class="text-pink fw-bold mb-2">{{ detail.author_name }}</div>
                            <!-- <div class="row g-1">

                                <div class="col-auto">
                                    <div class="bg-secondary text-bg-secondary rounded-1 px-2">
                                        <font-awesome-icon :icon="faComment" class=" me-1" /> 评论数 {{
                                            detail.comment_count }}
                                    </div>

                                </div>
                                <div class="col-auto">
                                    <div class="bg-secondary text-bg-secondary rounded-1 px-2">
                                        <font-awesome-icon :icon="faThumbsUp" class=" me-1" /> 点赞数 {{
                                            detail.like_count
                                        }}
                                    </div>

                                </div>
                                <div class="col-auto">
                                    <div class="bg-secondary text-bg-secondary rounded-1 px-2">
                                        <font-awesome-icon :icon="faShare" class=" me-1" /> 转发数 {{
                                            detail.forward_count
                                        }}
                                    </div>

                                </div>
                            </div> -->
                        </div>

                    </div>
                    <div class="my-3">{{ detail.description }}</div>

                </div>

                <div class="col-6">

                    <div class="bg-body-secondary rounded p-2 my-2 text-center">
                        请选择想要抽取的列表
                    </div>

                    <div class="btn-group btn-group-lg w-100">


                        <input :disabled="detail.comment_count === 0" type="radio" id="selected_get_comment_list"
                            class="btn-check" name="selected_comment" autocomplete="off" v-model="selected_method"
                            :value="API_ENDPOINT.GET_COMMENT_LIST" @change="send_event_get_list">
                        <label class="btn btn-outline-primary" :class="{ 'opacity-25': detail.comment_count === 0 }"
                            for="selected_get_comment_list">提取评论 ({{
                                detail.comment_count
                            }})</label>
                        <input :disabled="detail.source_type === 'video' || detail.like_count === 0" type="radio"
                            id="selected_get_like_list" class="btn-check" name="selected_comment" autocomplete="off"
                            v-model="selected_method" :value="API_ENDPOINT.GET_LIKE_LIST" @change="send_event_get_list">
                        <label class="btn btn-outline-success"
                            :class="{ 'opacity-25': detail.source_type === 'video' || detail.like_count === 0 }"
                            for="selected_get_like_list">提取点赞 ({{ detail.like_count
                            }})</label>
                        <input :disabled="detail.source_type === 'video' || detail.forward_count === 0" type="radio"
                            id="selected_get_forward_list" class="btn-check" name="selected_comment" autocomplete="off"
                            v-model="selected_method" :value="API_ENDPOINT.GET_FORWARD_LIST"
                            @change="send_event_get_list">
                        <label class="btn btn-outline-info "
                            :class="{ 'opacity-25': detail.source_type === 'video' || detail.forward_count === 0 }"
                            for="selected_get_forward_list">提取转发 ({{
                                detail.forward_count
                            }})</label>


                    </div>

                    <div v-show="selected_method" class="bg-body-secondary rounded p-2 my-2 text-center small">
                        <div v-show="selected_method === API_ENDPOINT.GET_COMMENT_LIST" class="text-danger">
                            注意:
                            <strong>评论</strong> 抽取只能读取到一级评论和回复评论的二级子评论, 不包含回复二级子评论的三级子评论
                        </div>
                        <div v-show="selected_method === API_ENDPOINT.GET_LIKE_LIST || selected_method === API_ENDPOINT.GET_FORWARD_LIST"
                            class="text-danger">
                            注意:
                            <strong>点赞</strong> 和
                            <strong>转发</strong> 抽取有上限限制, 在点赞+转发=总数超过1500的情况 可能会无法提取到完整列表 (B站接口限制)
                        </div>
                    </div>

                </div>
            </div>


        </div>





    </div>

</template>

<style scoped></style>
