<script setup>
/**
 * 网页底部
 */

import { ref } from "vue";

//版本号
const version_data = ref(import.meta.env.VITE_APP_VERSION || '')



</script>

<template>

  <div class="footer border-top position-absolute bottom-0 w-100 bg-white py-2">

    <div class="row justify-content-center">
      <div class="col-auto small">
        版本 <span class="">{{
          version_data }}</span>
      </div>
      <div class="col-auto small">
        问题反馈请到项目的GITHUB仓库里提交Issue
      </div>

    </div>


  </div>

</template>

<style scoped></style>
