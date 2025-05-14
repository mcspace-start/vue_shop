<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 顶部提示条 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 返回按钮 -->
      <el-button class="back" icon="el-icon-arrow-left" round @click="goGoods"
        >返回</el-button
      >
      <!-- 步骤条区 -->
      <!-- 换为数字 -0 操作 字符串方便用于 tab-pane 组件所以要转换一下 -->
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab 栏区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- tab动态绑定的是tab-pane name属性值 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(g)" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 item 项 -->
            <el-form-item
              v-for="item in manyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
              class="manyItem"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 循环生成选项 -->
                <el-checkbox
                  border
                  v-for="(name, i) in item.attr_vals"
                  :label="name"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传到的后台地址 -->
            <el-upload
              list-type="picture"
              multiple
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <!-- 添加商按钮 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >完成提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="truePreviewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
// 局部导入 loadsh
import _ from 'loadsh'
export default {
  name: 'add',
  data() {
    return {
      // 激活步骤条 字符串用于tab-pane属性name
      activeIndex: '0',
      // 添加商品表单数据对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传的图片的数组
        pics: [],
        // 准备提交的商品参数
        attrs: [],
        // 商品的详情描述(商品内容)
        goods_introduce: '',
      },
      // 商品分类数据，用于级联选择器
      catelist: [],
      // 级联选择器配置
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        // 展开状态方式为 hover
        expandTrigger: 'hover',
      },
      // 添加商品表单数据校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '价格必须大于0',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '重量必须大于0',
            trigger: 'blur',
          },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          {
            pattern: /^[1-9]\d*$/,
            message: '数量必须大于0',
            trigger: 'blur',
          },
        ],
        goods_cat: [
          // change 改变时验证
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },
      // 动态参数列表数据，数组对象通过多选框改变值
      manyTableData: [],
      // 静态属性列表数组
      onlyTableData: [],
      // 上传图片地址
      uploadURL: 'https://lianghj.top:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        // 配置token
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 上传图片的保存位置
      previewPath: '',
      // 图片预览对话框显示与隐藏
      previewVisible: false,
    }
  },
  created() {
    // 获取所有商品分类数据
    this.getCateList()
    // 保持侧边栏高亮为 goods
    window.sessionStorage.setItem('activePath', '/goods')
  },
  computed: {
    // 返回所选分类id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
    // 对图片地址进行修改，因为接口不是本地的,直接请求服务器端图片
    truePreviewPath() {
      const str = 'https://lianghj.top:8888'
      // http://127.0.0.1:8888/tmp_uploads/d64c8a534ba6204e70e2c0b92dae4de5.gif
      const url = str + this.previewPath.substring(24)
      return url
    },
  },
  methods: {
    // 获取所有商品分类数据，用于级联选择器
    async getCateList() {
      try {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        this.catelist = res.data
      } catch {
        this.$message.error('获取商品分类失败！')
      }
    },
    // 级联选择器选中项变化事件
    handleChange() {
      // 只允许选择三级分类
      if (this.addForm.goods_cat.length === 0) {
      } else if (this.addForm.goods_cat.length !== 3) {
        // 清空
        this.addForm.goods_cat = []
        return this.$message.error('只允许选择三级标签')
      }
    },
    // 切换 tabs标签之前的钩子，进行监控
    beforeTabLeave(activeName, oldActiveName) {
      // 多重作用域使用变量返回
      let nextB = true
      // 完整填写基本信息必填项
      if (oldActiveName === '0') {
        this.$refs.addFormRef.validate((valid) => {
          console.log(valid)
          if (!valid) {
            nextB = false
            this.$message.error('请填写基本信息必填项！')
          } else {
            nextB = true
          }
        })
      }
      return nextB
      // return this.$refs.addFormRef.validate()
      // 直接返回promise对象发现Tabs的绑定值没有及时更新
    },
    // tab标签点击事件
    async tabClicked() {
      try {
        // 判断访问的是动态参数或是静态属性，对attr_vals进行处理
        if (this.activeIndex === '1') {
          // 动态参数
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'many' },
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('获取动态参数列表失败！')
          }
          // 默认 attr_vals 值是字符串，需要拆分为数组进行列表渲染
          // 将 attr_vals 以空格拆分字符串
          res.data.forEach((item) => {
            // (再将其赋值到本身方便使用)
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          // 赋值
          this.manyTableData = res.data
        } else if (this.activeIndex === '2') {
          // 静态属性
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'only' },
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态属性列表失败！')
          }
          // 赋值
          this.onlyTableData = res.data
        }
      } catch {
        this.$message.error('获取参数列表失败！')
      }
    },
    // 点击图片时打开，处理图片预览效果
    handlePreview(file) {
      // 接受一个 file 包含文件详细信息
      // 临时文件信息；位置，用于打开图片大图使用
      this.previewPath = file.response.data.url
      // console.log(file)
      // 显示图片预览对话框
      this.previewVisible = true
    },
    // 删除图片时触发
    handleRemove(file) {
      // 1.获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 2.从 pic 数组找到对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      // 3.调用 split 方法从数组中移除信息对象
      this.addForm.pics.splice(i, 1)
    },
    // 监听文件上传成功的事件
    handleSuccess(response) {
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path,
      }
      // 2.将图片信息对象，push 到 pics 数组，用于最后发送添加商品请求
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        try {
          // 表单验证
          if (!valid) {
            return this.$message.error('请填写必要的表单项！')
          }
          // 实现添加逻辑
          // 深拷贝 loadsh cloneDeep(obj)
          const form = _.cloneDeep(this.addForm)
          // 合并数组为字符串，符合提交要求
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数，转成符合发送请求格式
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' '),
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性，转成符合发送请求格式
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            }
            this.addForm.attrs.push(newInfo)
          })
          // 赋值到 form
          form.attrs = this.addForm.attrs
          // 发起请求添加商品
          const { data: res } = await this.$http.post('goods', form)

          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败！')
          }
          this.$message.success('添加商品成功！')
          // 跳转路由
          this.$router.push('/goods')
        } catch {
          this.$message.error('添加商品失败！')
        }
      })
    },
    // 返回到goods界面
    goGoods() {
      this.$router.push('/goods')
    },
  },
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
.back {
  margin: 20px 0 10px 0;
  font-weight: bold;
}
// 为动态参数 item 添加 border
.manyItem {
  border-bottom: 2px dashed #999;
  padding-bottom: 10px;
}
</style>
