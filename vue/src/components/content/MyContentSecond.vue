<script setup>
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { INJECTION_KEY } from '@/constants/injection-key';
import { Detail_Model } from '@/model/detail-model';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { clear_object, is_empty_object } from '@/utils/utils';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faComment, faShare, faThumbsUp, faVideo, faListCheck } from '@fortawesome/free-solid-svg-icons';

const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)



const video_detail = inject(INJECTION_KEY.VIDEO_DETAIL)
const enable_comment_list = inject(INJECTION_KEY.ENABLE_COMMENT_LIST)
const enable_like_list = inject(INJECTION_KEY.ENABLE_LIKE_LIST)
const enable_forward_list = inject(INJECTION_KEY.ENABLE_FORWARD_LIST)


//判断是否要关闭 加载按钮
const disable_button_get_list = computed(() => {
    return !enable_comment_list.value && !enable_like_list.value && !enable_forward_list.value;
})


/**
 * 加载按钮点击事件
 */
function on_click_get_list() {

    console.log(disable_button_get_list);


}



onMounted(() => {

    //重置状态
    enable_comment_list.value = false;
    enable_like_list.value = false;
    enable_forward_list.value = false;


});






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
                <h3><font-awesome-icon :icon="faListCheck" class="me-1" /> 请选择想要加载的用户列表</h3>
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
                    <button :disabled="disable_button_get_list" class="btn btn-lg btn-miku px-4" @click="on_click_get_list">加载</button>
                </div>


            </div>

            <div class="col-12 text-center">

                <div class="my-2">
                    视频地址只支持加载 <strong>评论用户</strong> | 动态地址支持加载同时
                    <strong>评论</strong>+<strong>点赞</strong>+<strong>转发</strong> 的用户

                </div>
                <div class="my-2">
                    <span class="badge text-bg-danger">注意</span> <strong>评论</strong> 抽取只能读取到一级评论和回复评论的二级子评论,
                    不包含回复二级子评论的三级子评论
                </div>
                <div class="my-2">
                    <span class="badge text-bg-danger">注意</span> <strong>点赞</strong> 和 <strong>转发</strong> 抽取有上限限制,
                    在点赞+转发=总数超过1500的情况 有可能会无法加载出完整列表 (B站接口限制)
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
