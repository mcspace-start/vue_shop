<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <!-- 提交登录 -->
          <el-button type="primary" @click="login" :loading="loading"
            >登录</el-button
          >
          <!-- 重置 -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      // 这是登录表单的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单数据验证规则对象
      loginFormRules: {
        //   验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      // true为登录中，登录成功后false
      loading: false
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm() {
      // 表单重置方法
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      // console.log('发起登录')
      this.loading = true
      this.$refs.loginFormRef.validate(async valid => {
        // 校验不通过
        if (!valid) {
          this.loading = false
          return
        }
        // 校验通过 发起登录请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 如果失败
        if (res.meta.status !== 200) {
          this.loading = false
          return this.$message.error(`登陆失败！${res.meta.msg}`)
        }
        // 成功-更改按钮样式
        this.loading = false
        this.$message({
          type: 'success',
          message: '登录成功'
        })
        // 将token写入sessionStorage里
        window.sessionStorage.setItem('token', res.data.token)
        // 将欢迎页面激活，写死
        window.sessionStorage.setItem('activePath', '/welcome')
        // 通过编程式导航进行路由跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
