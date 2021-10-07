module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 使用不同的 main 文件
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')
      // 配置externals 不打包到一起而是在 window 全局找
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        loadsh: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 传一个值
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      //
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
