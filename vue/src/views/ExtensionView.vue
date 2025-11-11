<script setup>
import { onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDownload, faPuzzlePiece, faShield } from '@fortawesome/free-solid-svg-icons';
import { faChrome, faEdge } from '@fortawesome/free-brands-svg-icons';

const downloadLink = 'https://www.modelscope.cn/models/sakmist/Bilibili-Lottery-Local-Extension/resolve/master/Bilibili-Lottery-Local-Extension.zip';
const edgeStoreLink = 'https://microsoftedge.microsoft.com/addons/detail/bilibili-lottery-local/emklklgjhjjippfejbefinlckfjccicc';

const isEdgeBrowser = ref(false);
onMounted(() => {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || '';
    isEdgeBrowser.value = /\bEdg\//i.test(ua);
  }
});
</script>

<template>
  <section class="extension-hero rounded-4 p-4 p-md-5 mb-4">
    <div class="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-4">
      <div class="flex-grow-1">
        <p class="badge text-bg-warning text-uppercase fw-semibold mb-2">
          <font-awesome-icon :icon="faPuzzlePiece" class="me-1" />
          Bilibili Lottery Local Extension
        </p>
        <h2 class="fw-bold mb-3">
          在本地完成抽奖流程，远离风控与请求失败
        </h2>
        <p class="lead mb-0 text-muted">
          本浏览器插件支持 Chrome / Edge / Firefox。通过本地执行抽奖步骤，避免高频请求触发 B 站风控，同时保留熟悉的操作体验。
        </p>
      </div>
      <div class="d-flex flex-column flex-md-row align-self-stretch gap-2 w-100">
        <div v-if="isEdgeBrowser" class="d-flex flex-column gap-2 w-100">
          <a
            class="btn btn-outline-dark btn-lg fw-semibold px-4 d-flex align-items-center justify-content-center"
            :href="edgeStoreLink"
            target="_blank"
            rel="noopener"
          >
            <font-awesome-icon :icon="faEdge" class="me-2" />
            Edge 插件商店
          </a>
          <p class="small text-danger fw-semibold mb-0">
            推荐使用 Edge，虽然效果一样支持安装，但是 Edge 已经上架商店（仅 Edge 浏览器可以使用该商店），点击即可安装，无需繁琐操作。
          </p>
          <a
            class="btn btn-link btn-sm fw-semibold px-0 align-self-start"
            :href="downloadLink"
            target="_blank"
            rel="noopener"
          >
            或下载 ZIP 安装包
          </a>
        </div>
        <div v-else class="d-flex flex-column flex-md-row gap-3 w-100">
          <div class="d-flex flex-column flex-grow-1 gap-2">
            <a
              class="btn btn-miku btn-lg fw-semibold px-4"
              :href="downloadLink"
              target="_blank"
              rel="noopener"
            >
              <font-awesome-icon :icon="faDownload" class="me-2" />
              下载 ZIP 安装包
            </a>
            <div class="d-flex flex-column gap-1 align-items-start">
              <a
                class="btn btn-outline-dark btn-sm fw-semibold px-3"
                :href="edgeStoreLink"
                target="_blank"
                rel="noopener"
              >
                Edge 插件商店
              </a>
              <p class="small text-danger fw-semibold mb-0">
                推荐使用 Edge，虽然效果一样支持安装，但是 Edge 已经上架商店（仅 Edge 浏览器可以使用该商店），点击即可安装，无需繁琐操作。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="card shadow-sm mb-4">
    <div class="card-body py-4 px-4">
      <h3 class="fw-semibold mb-3">
        <font-awesome-icon :icon="faShield" class="text-warning me-2" />
        为什么要使用本地插件？
      </h3>
      <ul class="mb-0 ps-3">
        <li class="mb-2">通过本地浏览器读取互动数据，减少接口限流风险。</li>
        <li class="mb-2">操作界面与在线工具保持一致，新手也能快速上手。</li>
        <li>离线保存抽奖过程，方便日后复盘与公示。</li>
      </ul>
    </div>
  </section>

  <section class="card shadow-sm mb-4">
    <div class="card-body py-4 px-4">
      <div class="d-flex flex-column flex-lg-row gap-4">
        <div class="flex-grow-1">
          <h3 class="fw-semibold mb-3">
            <font-awesome-icon :icon="faChrome" class="text-primary me-2" />
            Chrome / Edge / 360 等 Chromium 浏览器
          </h3>
          <ol class="ps-3 mb-0">
            <li class="mb-2">
              点击上方按钮下载 <code>Bilibili-Lottery-Local-Extension.zip</code>，并在本地解压得到
              <code>Bilibili-Lottery-Local-Extension</code> 文件夹。
            </li>
            <li class="mb-2">
              打开 <code>chrome://extensions</code>（或 Edge 的
              <code>edge://extensions</code>），在右上角开启「开发者模式」。
            </li>
            <li class="mb-2">
              在页面左上点击「加载已解压的扩展程序 / Load unpacked」，并选择刚才解压出来的文件夹。
            </li>
            <li>
              成功安装后即可在扩展工具栏中看到插件图标，点击即可按照向导完成抽奖。
            </li>
          </ol>
        </div>
        <div class="flex-grow-1">
          <h3 class="fw-semibold mb-3">
            <font-awesome-icon :icon="faEdge" class="text-info me-2" />
            Firefox（ZIP 转 XPI）
          </h3>
          <ol class="ps-3 mb-0">
            <li class="mb-2">
              同样下载 ZIP 包并解压，将文件夹压缩为 <code>.xpi</code>（任意压缩工具即可，确保根目录包含
              <code>manifest.json</code>）。
            </li>
            <li class="mb-2">打开 Firefox，地址栏输入 <code>about:debugging#/runtime/this-firefox</code>。</li>
            <li class="mb-2">点击「临时载入附加组件」，选择刚刚生成的 <code>.xpi</code> 文件。</li>
            <li>若需要长期使用，可在 Firefox 附加组件市场打包并签名，或继续通过临时加载方式调试。</li>
          </ol>
        </div>
      </div>
    </div>
  </section>

  <section class="card shadow-sm">
    <div class="card-body py-4 px-4">
      <h3 class="fw-semibold mb-3">更新 / 重新安装</h3>
      <ol class="ps-3 mb-3">
        <li class="mb-2">删除旧版本扩展或关闭其开关。</li>
        <li class="mb-2">下载最新 ZIP 包并重复上方的加载步骤。</li>
        <li>若浏览器提示权限变化，请确认后重新启用。</li>
      </ol>
      <p class="mb-0 text-muted">
        遇到问题可在 GitHub 或 B 站私信联系 <strong>@sakmist</strong>，也欢迎提 Issue 反馈。
      </p>
    </div>
  </section>
</template>

<style scoped>
.extension-hero {
  background: linear-gradient(135deg, rgba(62, 201, 190, 0.15), rgba(0, 0, 0, 0.05));
}

.card {
  border: none;
}
</style>
