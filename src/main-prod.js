import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'
// 导入第三方图标库
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入elementui插件
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
// 导入第三方表格树插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器依赖
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入 nprogress 进度条插件
import NProgress from 'nprogress'

// 注册富文本编辑器为全局组件
Vue.use(VueQuillEditor)

// 设置axios默认根路径，并开始进度条 NProgress.start()
// axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios对请求头对象挂载自定义段
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  // 添加Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 后面必须return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})

Vue.config.productionTip = false
// 将axios导入到vueprototype里
Vue.prototype.$http = axios
// 将表格树插件注册为全局组件
Vue.component('tree-table', TreeTable)
// 全局过滤器，转换时间戳
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  // padStart为不足两位数前缀加 0
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  // yy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
