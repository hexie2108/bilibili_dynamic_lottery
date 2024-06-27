<script setup>

import MyHeader from '@/components/MyHeader.vue'
// import MyFooter from '@/components/MyFooter.vue'
import MyContent from '@/components/MyContent.vue'
import MyModal from '@/components/MyModal.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { provide, reactive } from 'vue'
import { INJECTION_KEY } from './constants/injection-key'

const loading_modal_options = reactive({
  title: '加载中',
  title_class: '',
  content: '',
  content_class: 'text-center',
  show_cancel_button: false,
  show_loading_icon: true,
  show: false,
})

/**
 * 更新加载模态窗数据
 * @param {boolean} show 
 * @param {string} content 
 */
function set_loading_modal_options(show, content = '') {
  if (show !== null) {
    loading_modal_options.show = show;
  }

  loading_modal_options.content = content;
}

/**
 * @param {string} content 
 * @param {boolean} show 
 */
const error_modal_options = reactive({
  title: '错误',
  title_class: 'text-danger',
  content: '',
  content_class: 'text-danger',
  show_cancel_button: true,
  show_loading_icon: false,
  show: false,

})

/**
 * 更新错误模态窗数据
 * @param {string} content 
 * @param {boolean} show 
 */
function set_error_modal_options(show, content = '') {

  if (show !== null) {
    error_modal_options.show = show;
  }

  error_modal_options.content = content;
}

provide(INJECTION_KEY.SET_LOADING_MODAL_OPTIONS, set_loading_modal_options)
provide(INJECTION_KEY.SET_ERROR_MODAL_OPTIONS, set_error_modal_options)

</script>

<template>
  <div class="container-fluid">

    <my-header />

    <!-- 只在大窗口上显示 -->
    <div class="content d-none d-md-block my-2 px-3 px-md-4 py-3">

      <my-content></my-content>

    </div>

    <!-- 只在小窗口上显示 -->
    <div class="content d-block d-md-none my-2 px-3 px-md-4 py-3">

      <h2 class="text-center fw-bold my-5">
        <font-awesome-icon :icon="faCircleExclamation" class="align-middle me-2" /> 请通过PC电脑端访问本工具
      </h2>

    </div>

    <div style="height: 100px;"></div>
    <!-- <my-footer /> -->

    <my-modal v-bind="loading_modal_options" @close="loading_modal_options.show = false" />
    <my-modal v-bind="error_modal_options" @close="error_modal_options.show = false" />

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
