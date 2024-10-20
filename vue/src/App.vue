<script setup>

import MyHeader from '@/components/header/MyHeader.vue'
import MyFooter from '@/components/MyFooter.vue'
import MyContent from '@/components/content/MyContent.vue'
import MyModalManager from '@/components/modal/MyModalManager.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useProvideModalOptions } from '@/provide/use-provide-modal-options'
import { useProvideLoginOptions } from '@/provide/use-provice-login-options'
import { useProvideFormOptions } from './provide/use-form-options'
import { useProvideListOptions } from './provide/use-provice-list-options'

useProvideModalOptions();
useProvideLoginOptions();
useProvideFormOptions();
useProvideListOptions();

</script>

<template>
  <div class="container-fluid position-relative">

    <my-header />

    <!-- 只在大窗口上显示 -->
    <div class="content d-none d-md-block my-2 px-3 px-md-4 py-3">

      <my-content></my-content>

    </div>

    <!-- 只在小窗口上显示 -->
    <div class="content d-block d-md-none my-2 px-3 px-md-4 py-3">

      <h2 class="text-center fw-bold my-5">
        <font-awesome-icon :icon="faCircleExclamation" class="align-middle me-2" /> 请通过大屏幕设备访问本工具
      </h2>

    </div>

    <div style="height: 300px;"></div>
    <my-footer />

    <my-modal-manager></my-modal-manager>

  </div>
</template>

<style scoped>
.container-fluid {
  max-width: var(--container-max-width);
}

.content {
  min-height: 300px;
}
</style>
