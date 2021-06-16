import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        //欢迎页
        {
          path: '/welcome', component: Welcome
        },
        //用户列表页
        { path: '/users', component: Users }
      ]
    }
  ]
})
// 给路由创建全局守卫
router.beforeEach((to, from, next) => {
  // 用户访问登陆页，放行
  if (to.path === '/login') return next()
  //没有token强行跳转至登陆页
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
