<script setup>
/**
 * 网页底部
 */

import { ref } from "vue";


//管理员地址
const administrator_email = ref('hexie2109@gmail.com')


</script>

<template>

  <div class="footer border-top position-absolute bottom-0 w-100 bg-white">

    <div class="text-center my-2">管理员邮箱地址 {{ administrator_email }}</div>


  </div>

</template>

<style scoped></style>
