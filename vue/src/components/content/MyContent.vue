<script setup>



import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { INJECTION_KEY } from '@/constants/injection-key';
import { User_Model } from '@/model/user-model';
import { get_by_fetch } from '@/utils/request-by-fetch';
import { get_random_int } from '@/utils/utils';
import { inject, reactive, ref } from 'vue';
import MyContentFirst from '@/components/content/MyForm.vue';
import MyContentSecond from '@/components/content/MyVideoDetail.vue';
import MyContentThird from '@/components/content/MyListContainer.vue';


const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)

const video_id = inject(INJECTION_KEY.VIDEO_ID)

const show_list = inject(INJECTION_KEY.SHOW_LIST);
const comment_list = inject(INJECTION_KEY.COMMENT_LIST); 
const like_list = inject(INJECTION_KEY.LIKE_LIST); 
const forward_list = inject(INJECTION_KEY.FORWARD_LIST); 
const user_list = inject(INJECTION_KEY.USER_LIST)




</script>

<template>

    <div>

        <my-content-first></my-content-first>
        <my-content-second v-if="video_id"></my-content-second>
        <my-content-third  v-if="video_id && show_list"></my-content-third>


        <!-- <my-list-container v-if="user_list.length" :user_list="user_list" :user_list_type="user_list_type" /> -->


    </div>

</template>

<style scoped></style>
