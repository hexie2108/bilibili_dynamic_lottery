<script setup>
/**
 * 网页头部
 */


import { inject, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { get_random_top_banner } from "@/utils/random-top-banner";
import { get_by_fetch } from '@/utils/request-by-fetch';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBilibili, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faAt, faEnvelope, faFileCode, faHouse } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';
import { INJECTION_KEY } from "@/constants/injection-key";
import MyLoginUser from '@/components/header/MyLoginUser.vue';


//准备一个随机头图
const banner1 = ref(get_random_top_banner(0))
//再指定一个固定头图
const banner2 = ref(get_random_top_banner())

const title = ref('B站在线抽奖工具 | 初音社')

const bilibili_link = ref(import.meta.env.VITE_BILIBLI_LINK);
const github_link = ref(import.meta.env.VITE_GITHUB_LINK)
const github_bilibili_api_collect_link = ref(import.meta.env.VITE_GITHUB_BILIBILI_API_COLLECT_LINK)

const show_login_modal = inject(INJECTION_KEY.SHOW_LOGIN_MODAL)
const show_loading_modal = inject(INJECTION_KEY.SHOW_LOADING_MODAL)
const show_error_modal = inject(INJECTION_KEY.SHOW_ERROR_MODAL)


/**
 * 登陆按钮点击事件
 */
function on_click_login() {

  //显示二维码登陆窗口
  show_login_modal(true);


}

</script>

<template>

  <div class="header border-bottom">

    <div class="banner-container" :style="{ 'background-image': 'url(' + banner1 + '), url(' + banner2 + ')' }">
      <div class="row justify-content-center align-content-end h-100">

        <div class="col-auto">
          <h1 class="banner-title  fw-bold user-select-none" style="" :data-text="title">
            {{ title }}
          </h1>
        </div>
        <div class="m-0"></div>
        <div class="col-auto">
          <div class="banner-copyright-text d-none d-lg-block">
            © SEGA / © Craft Egg Inc. Developed by Colorful Palette / © Crypton Future Media, INC. www.piapro.net All
            rights reserved.
          </div>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-md">
      <div class="container-fluid">
        <a class="navbar-brand d-md-none" href="#">菜单</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#top-menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="top-menu">
          <ul class="navbar-nav ">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link">
                <font-awesome-icon :icon="faHouse" class="align-middle me-1" /> 首页
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/extension" class="nav-link">
                <font-awesome-icon :icon="faFileCode" class="align-middle me-1" /> 插件下载
              </RouterLink>
            </li>
            <li class="nav-item">
              <a :href="bilibili_link" class="nav-link" target="_blank"><font-awesome-icon :icon="faBilibili"
                  class="align-middle me-1" /> 初音社B站频道</a>
            </li>
            <li class="nav-item">
              <a :href="github_link" class="nav-link" target="_blank"> <font-awesome-icon :icon="faGithub"
                  class="align-middle me-1" />
                项目GITHUB地址</a>
            </li>
            <li class="nav-item">
              <a :href="github_bilibili_api_collect_link" class="nav-link" target="_blank"> <font-awesome-icon
                  :icon="faGithub" class="align-middle me-1" />
                野生B站API文档</a>
            </li>

          </ul>
          <ul class="navbar-nav ms-auto ">
            <li class="nav-item ps-auto">
              <a href="#" class="nav-link" @click="on_click_login">
                <my-login-user></my-login-user>
              </a>
            </li>
          </ul>

        </div>
      </div>


    </nav>



  </div>

</template>

<style scoped>
.banner-container {
  height: 150px;
  background-position: center -30px;
  background-size: 2560px auto;
}

.banner-copyright-text {
  font-size: smaller;
  transform: scale(0.6);

}

.banner-title {
  position: relative;
  /* font-size: 2.5rem; */
  color: white;
}

.banner-title::before {
  content: attr(data-text);
  /* 使用属性值作为内容 */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* 隐藏实际文字内容 */
  -webkit-text-fill-color: transparent;
  /* 隐藏实际文字内容（Safari） */
  /* font-size: 2.5rem; */
  -webkit-text-stroke: 2px white;
  /* Safari 文字描边 */
  text-stroke: 2px white;
  /* Chrome 文字描边 */
}

.banner-title::after {
  content: attr(data-text);
  /* 使用属性值作为内容 */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* 隐藏实际文字内容 */
  -webkit-text-fill-color: transparent;
  /* 隐藏实际文字内容（Safari） */
  /* font-size: 2.5rem; */
  -webkit-text-stroke: 1px var(--color-miku);
  /* Safari 文字描边 */
  text-stroke: 1px var(--color-miku);
  /* Chrome 文字描边 */
}
</style>
