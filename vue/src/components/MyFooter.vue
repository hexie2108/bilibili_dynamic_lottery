<script setup>
/**
 * 网页底部
 */

import { ref } from "vue";

//版本号
const version_data = ref(import.meta.env.VITE_APP_VERSION || '')
//管理员地址
const administrator_email = ref(import.meta.env.VITE_ADMIN_EMAIL || '')


</script>

<template>

  <div class="footer border-top position-absolute bottom-0 w-100 bg-white py-2">

    <div class="row justify-content-center">
      <div class="col-auto small">
        版本 <span class="">{{
          version_data }}</span>
      </div>
      <div class="col-auto small">
        问题反馈邮箱 <span class="">{{ administrator_email }}</span>
      </div>

    </div>


  </div>

</template>

<style scoped></style>
