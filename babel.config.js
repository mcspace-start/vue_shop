// 项目发布阶段使用到的插件
var prodplugins = []
if (process.env.NODE_ENV === 'production') {
  prodplugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...prodplugins
  ]
}
