import Vue from 'vue'
import VueRouter from 'vue-router'

// 不再同步加载
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

// 改为异步加载，并用 webpack 进行分组
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login-Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const List = () => import(/* webpackChunkName: "List_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "List_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

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
        // 欢迎页
        { path: '/welcome', component: Welcome },
        // 用户列表页
        { path: '/users', component: Users },
        // 权限列表页
        { path: '/rights', component: Rights },
        // 角色列表页
        { path: '/roles', component: Roles },
        // 商品分类页
        { path: '/categories', component: Cate },
        // 分类参数页
        { path: '/params', component: Params },
        // 商品列表页
        { path: '/goods', component: List },
        // 添加商品页
        { path: '/goods/add', component: Add },
        // 订单管理页
        { path: '/orders', component: Order },
        // 数据报表页
        { path: '/reports', component: Report }
      ]
    }
  ]
})
// 给路由创建全局守卫
router.beforeEach((to, from, next) => {
  // 用户访问登陆页，放行
  if (to.path === '/login') return next()
  // 没有token强行跳转至登陆页
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  // 放行
  next()
  // 保存跳转地址用于 home 组件的 menu 菜单激活属性（用于第一次跳转激活菜单）
  window.sessionStorage.setItem('activePath', to.fullPath)
})

export default router
