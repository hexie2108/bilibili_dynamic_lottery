<script setup>

import MyForm from '@/components/MyForm.vue'
import MyList from '@/components/MyList.vue'
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { INJECTION_KEY } from '@/constants/injection-key';
import { User_Model } from '@/model/user-model';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { get_random_int } from '@/utils/utils';
import { inject, reactive, ref } from 'vue';


const set_error_modal_options = inject(INJECTION_KEY.SET_ERROR_MODAL_OPTIONS)
const set_loading_modal_options = inject(INJECTION_KEY.SET_LOADING_MODAL_OPTIONS)

const user_list = reactive([]);
const id_request = ref(0);

//避免VUE复用DOM元素 导致头像不加载的问题
// const user_list_key = ref(0);

const user_list_type = ref('')

/**
 * 获取用户抽选列表
 * @param selected_method 抽选方式 
 */
function get_list(selected_method, id) {

    clear_list()

    //更新用户列表类型
    user_list_type.value = selected_method

    //生成随机ID 用来跟踪请求进度
    id_request.value = get_random_int(1, 10000000);

    get_by_fetch(
        API_ROOT_URL,
        {
            action: selected_method,
            id,
            id_request: id_request.value, //传递请求ID
        },
        () => {
            //显示加载框
            set_loading_modal_options(true);
            //定时检查请求进度
            set_timeout_get_request_status();
        },
        (response_data) => {

            for (const element of response_data) {
                user_list.push(new User_Model(element));
            }
        },
        (error) => {

            //显示错误框
            set_error_modal_options(true, error.message);
        },
        () => {
            //隐藏加载框
            set_loading_modal_options(false);

            //重置请求ID
            id_request.value = 0;
        }
    )

}

function clear_list() {
    //清空数组
    user_list.length = 0
    //使用新的列表KEY
    // user_list_key.value++
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
                set_loading_modal_options(null, response_data.data);
            },
            null,
            () => {
                //当前请求完成后 继续预定 新的定时
                setTimeout(set_timeout_get_request_status, 3000)
            }
        )

    }

}


</script>

<template>

    <div>

        <my-form @get_list="get_list" @clear_list="clear_list" />

        <my-list v-if="user_list.length" :user_list="user_list" 
            :user_list_type="user_list_type" />


    </div>

</template>

<style scoped></style>
