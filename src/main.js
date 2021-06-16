import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
// 导入全局样式表
import './assets/css/global.css'
// 导入elementui插件
import './plugins/element.js'
// 导入第三方图标库
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
//将axios导入到vueprototype里
Vue.prototype.$http = axios
//设置axios默认根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios对请求头对象挂载自定义段
axios.interceptors.request.use(config =>{
  // 添加Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 后面必须return config
  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

