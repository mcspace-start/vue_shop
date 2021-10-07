<template>
  <!-- 布局容器 -->
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" /> <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 用于菜单栏收缩 -->
        <div
          class="toggle-button"
          @click="toggleCollapse"
          :title="toggleButtonTitle"
        >
          | | |
        </div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 欢迎页面 固定写死 -->
          <el-submenu :index="'x'">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <!-- 文本 -->
              <span>欢迎光临</span>
            </template>
            <el-menu-item :index="'/welcome'" @click="saveNavState('/welcome')">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>welcome</span>
            </el-menu-item>
          </el-submenu>

          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObject[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 二级菜单的index用于路由跳转 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // icon图标
      iconsObject: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠左边栏
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      toggleButtonTitle: '折叠列表'
    }
  },
  created() {
    this.getMenuList()
    // 初次获取地址信息
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清除token
      window.sessionStorage.clear()
      // 跳转至登陆页
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.msg)
      this.menuList = res.data
    },
    // 切换菜单栏折叠展开
    toggleCollapse(el) {
      if (this.isCollapse) {
        this.toggleButtonTitle = '折叠列表'
        el.currentTarget.innerText = '| | |'
      } else {
        this.toggleButtonTitle = '展开列表'
        el.currentTarget.innerText = '|||'
      }
      this.isCollapse = !this.isCollapse
    },
    // 保存路由地址
    saveNavState(activePath) {
      // 保存地址信息使用在element的 default-active 属性上
      window.sessionStorage.setItem('activePath', activePath)
      // 切换子页面时更新路由地址
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  },
  updated() {
    // 监控在其他页面或者面包屑跳转时的地址更新
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>
<style lang="less" scoped>
.main-container {
  padding: 0;
  margin: 0;
  height: 100%;
  > .el-container {
    height: 0px;
  }
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  img {
    width: 35px;
    margin-left: 15px;
  }
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 14px;
  }
  align-items: center;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #e9edf1;
}
.el-aside {
  background-color: #313743;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 28px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-icon-star-on,
.el-icon-star-on::before {
  width: 16px !important;
  height: 16px !important;
  margin-right: 10px !important;
  line-height: 16px !important;
}
</style>
