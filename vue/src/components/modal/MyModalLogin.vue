<script setup>

import { ref, inject, onMounted } from 'vue'

import VueQrcode from '@chenfengyuan/vue-qrcode';

import { INJECTION_KEY } from '@/constants/injection-key'
import MyModal from '@/components/modal/MyModal.vue'

import { get_by_fetch } from '@/utils/request-by-fetch';
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { setLoginUserInfo } from '@/provide/use-provice-login-options';

const login_modal_options = inject(INJECTION_KEY.LOGIN_MODAL_OPTIONS);
const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)
const login_user = inject(INJECTION_KEY.LOGIN_USER)


const login_url = ref('');
const qrcode_key = ref('');
const login_url_timeout = ref(170);


//自动更新链接超时时间
function start_count_login_url_timeout() {

     const interval_count = setInterval(() => {

          login_url_timeout.value--;

          if (login_url_timeout.value <= 0) {
               clearInterval(interval_count);
          }
     }, 1000); // 每秒更新一次

}

function get_login_url() {
     //请求二维码地址
     get_by_fetch(
          API_ROOT_URL,
          {
               action: API_ENDPOINT.GET_LOGIN_URL,
          },
          () => {
               //显示加载框
               show_loading_modal(true);
          },
          (response_data) => {

               //设置登陆链接
               login_url.value = response_data.url;
               qrcode_key.value = response_data.qrcode_key;

               // 组件挂载时启动倒计时
               start_count_login_url_timeout();


          },
          (error) => {
               //显示错误框
               show_error_modal(true, error.message);
          },
          () => {
               //隐藏加载框
               show_loading_modal(false);

          }
     );
}

/**
 * 发送确认已完成扫码登陆的请求, 
 */
function on_click_confirm() {

     if (login_url_timeout.value <= 0) {
          show_error_modal(true, '二维码已超时');
          return;
     }

     //检测二维码登陆状态
     get_by_fetch(
          API_ROOT_URL,
          {
               action: API_ENDPOINT.CHECK_LOGIN_STATUS,
               qrcode_key: qrcode_key.value,
          },
          () => {
               //显示加载框
               show_loading_modal(true);
          },
          (response_data) => {

               //如果登陆成功, 请求用户信息
               setLoginUserInfo(login_user);


               //关闭登陆窗口
               login_modal_options.show = false;

          },
          (error) => {
               //显示错误框
               show_error_modal(true, error.message);
          },
          () => {
               //隐藏加载框
               show_loading_modal(false);

          }
     );



}


get_by_fetch(
     API_ROOT_URL,
     {
          action: API_ENDPOINT.CHECK_IS_LOGGED_IN,
     },
     () => {

     },
     (response_data) => {

          console.log(response_data);

     },
     (error) => {
          //显示错误框
          show_error_modal(true, error.message);
     },
     () => {

     }
);


onMounted(() => {
     //获取登陆URL
     get_login_url();

});

</script>


<template>
     <my-modal v-bind="login_modal_options" @close="login_modal_options.show = false" @confirm="on_click_confirm">

          <template #content>
               <div class="text-center">
                    <template v-if="login_url_timeout > 0">


                         <p>请在 <strong>{{ login_url_timeout }}秒</strong> 内使用哔哩哔哩客户端扫码登陆</p>
                         <vue-qrcode v-if="login_url" :value="login_url" :options="{ width: 250 }"></vue-qrcode>
                         <p>在客户端完成扫码登陆后, 再点击确认</p>
                         <p class="small">提示: 登陆完成后, 你将会看到账号在本程序服务器所属地的IP登陆记录, 这属于正常情况, 你提供的B站账号凭证最长会被服务器保存1小时,
                              1小时后自动销毁,
                              如果使用完本工具后, 过一段时间还发现有异常登陆, 请更改账号密码</p>

                    </template>
                    <template v-else>
                         <p>二维码已超时, 请重新打开新的登陆窗口</p>
                    </template>
               </div>

          </template>
     </my-modal>
</template>

<style scoped></style>