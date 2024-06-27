<script setup>
/**
 * 网页头部
 */


import { ref } from "vue";
import { get_random_top_banner } from "../utils/random-top-banner";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBilibili, faGithub } from "@fortawesome/free-brands-svg-icons";


//准备一个随机头图
const banner1 = ref(get_random_top_banner(0))
//再指定一个固定头图
const banner2 = ref(get_random_top_banner())

const title = ref('B站在线抽奖工具|初音社')

const bilibili_link = ref(import.meta.env.VITE_BILIBLI_LINK);
const github_link = ref(import.meta.env.VITE_GITHUB_LINK)


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

    <div class="top-menu row justify-content-end my-2 px-3 px-md-4">
      <div class="col-auto me-auto d-none d-lg-block">
        <div class="">
          本工具可以从B站 (视频/动态) 中提取出 (评论/转发/点赞) 用户列表, 然后随机选出中奖者
        </div>
      </div>
      <div class="col-auto ">
        <a :href="bilibili_link" class="" target="_blank"> <font-awesome-icon :icon="faBilibili" class="align-middle me-1" /> 初音社B站频道 <span class="badge text-bg-miku">欢迎给我充电</span></a>
      </div>
      <div class="col-auto">
        <a :href="github_link" class="" target="_blank"> <font-awesome-icon :icon="faGithub" class="align-middle me-1" /> GITHUB地址</a>
      </div>
    </div>

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
