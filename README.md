# vue_shop

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 描述

> 这是一个电商后台管理前端页面，由 **vue-cli4** + **vue2** 构建
>
> 项目使用了 **element-ui** 等插件，项目经验来自网上，**API** 也是来着网上
>
> 项目[浏览](https://one.aprp.cn/demo/vue-shop/dist/#/login)

## 使用的插件

> * vue-router
> * elemnt-ui
> * axios
> * loadsh
> * nprogress
> * vue-quill-editor
> * echarts
> * vue-table-with-tree-grid（表格树）

## 项目优化策略

> 1. 生成打包报告
>
>    ```tex
>    vue-cli-service build --report
>    vue-ui build
>    ```
>
> 2. Element-UI 组件按需加载
>
>    ```js
>    import { Form } from 'element-ui
>    ```
>
> 3. 路由懒加载
>
>    ```js
>    const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
>    ```
>
> 4. 通过externals 加载外部 CDN 资源
>
>    ```js
>    config.set('externals', {
>      vue: 'Vue',
>      'vue-router': 'VueRouter',
>      axios: 'axios',
>      loadsh: '_',
>      echarts: 'echarts',
>      nprogress: 'NProgress',
>      'vue-quill-editor': 'VueQuillEditor'
>    })
>    ```
>
> 5. 首页内容定制
>
>    ```html
>    <!-- prod模式修改标题和渲染CDN  -->
>    <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev - ' %>电商后台管理系统</title>
>    
>    <% if(htmlWebpackPlugin.options.isProd){ %>
>    <link rel="stylesheet" href="https://x.css">
>    <script src="https://x.js"></script>
>    <% } %>
>    ```
>
> 6. 项目发布删除 `console`
>
>    ```js
>    // 项目发布阶段使用到的插件
>    var prodplugins = []
>    if (process.env.NODE_ENV === 'production') {
>      prodplugins.push('transform-remove-console')
>    }
>    
>    module.exports = {
>      presets: [
>        '@vue/cli-plugin-babel/preset'
>      ],
>      plugins: [
>        ...prodplugins
>      ]
>    }
>    ```