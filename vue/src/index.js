
// 导入 Bootstrap 的 CSS 文件
import 'bootstrap/dist/css/bootstrap.css'
//导入 Datepicker样式
import '@vuepic/vue-datepicker/dist/main.css'
//导入自定义CSS文件
import './assets/style.css'



// 导入 Bootstrap 的 JavaScript 文件
import 'bootstrap/dist/js/bootstrap.bundle.js'

import { createApp } from 'vue'
import App from './App.vue'


// console.log(import.meta.env);


createApp(App).mount('#app')

//关闭生产环境提示
// app.config.productionTip = false
