<template>
  <div class="content-main">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 滚动条区域 -->
    <el-scrollbar style="height:96%" class="content-scrollbar">
      <!-- 卡片视图区域 -->
      <el-card>
        <!-- 提示文字 alert -->
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！ "
          type="warning"
          :closable="false"
          show-icon
        >
        </el-alert>
        <!-- 选择商品分类 -->
        <el-row class="cat_opt">
          <el-col>
            <!-- label -->
            <span>选择商品分类：</span>
            <!-- 选择商品分类级联选择框 -->
            <el-cascader
              v-model="selectedCateKeys"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-col>
        </el-row>
        <!-- tabs页签区 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
            <!-- 添加动态参数按钮 -->
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisabled"
              @click="addDialogVisible = true"
              >添加参数</el-button
            >
            <!-- 动态参数表格 -->
            <el-table :data="manyTableData" border stripe>
              <!-- 1 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染 tag 标签 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >

                  <!-- 添加参数按钮 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ 添加新参数项</el-button
                  >
                </template>
              </el-table-column>
              <!-- 2 索引列 -->
              <el-table-column type="index" label="#"></el-table-column>
              <!-- 3 内容 -->
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <!-- 4 操作按钮 -->
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- 修改按钮 -->
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id, scope.row)"
                    >编辑</el-button
                  >
                  <!-- 删除按钮 -->
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态属性的面板 -->
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisabled"
              @click="addDialogVisible = true"
              >添加属性</el-button
            >
            <!-- 静态属性表格 -->
            <el-table :data="onlyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-row :gutter="0">
                    <el-col :span="2.5">
                      <div class="onlyDiv">属性内容：</div>
                    </el-col>
                    <el-col :span="12">
                      <el-input
                        placeholder="请输入内容"
                        v-model="scope.row.attr_vals"
                        class="onlyInput"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                    </el-col>
                  </el-row>
                  <!-- 循环渲染 tag 标签
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                  输入文本框标签
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  添加按钮
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ 添加新参数项</el-button
                  > -->
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index" label="#"></el-table-column>
              <!-- 内容 -->
              <el-table-column
                label="属性名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id, scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-scrollbar>
    <!-- 这是添加动态参数/静态属性的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 表单区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'params',
  data() {
    return {
      // 商品分类数据对象
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // hover展开
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定的数组
      selectedCateKeys: [],
      // 被激活的页签名称，默认启用动态参数
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 添加动态参数/静态属性对话框显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单对象
      addForm: {
        attr_name: ''
      },
      // 添加参数的表单对象验证
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            pattern: '[^ \x22]+',
            message: '不能为空格',
            trigger: 'blur'
          }
        ]
      },
      // 修改对话框显示与隐藏
      editDialogVisible: false,
      // 修改表单数据对象
      editForm: {
        attr_name: '',
        attr_id: 0,
        attr_vals: ''
      },
      // 修改参数的表单对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            pattern: '[^ \x22]+',
            message: '不能为空格',
            trigger: 'blur'
          }
        ]
      },
      // 修改参数名对话框
      inputVisible: false,
      // 用于修改参数名
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 如果按钮需要被禁用则返回 true，否则为 false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的3级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题属性
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取所有商品列表分类数据;用于级联选择器
    async getCateList() {
      // 发起获取商品分类数据
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data

      // 非三级禁止选择 disabled = true
      for (let i = 0; i < this.cateList.length; i++) {
        if (!this.cateList[i].children) {
          this.cateList[i].disabled = true
        } else {
          for (let j = 0; j < this.cateList[i].children.length; j++) {
            if (!this.cateList[i].children[j].children) {
              this.cateList[i].children[j].disabled = true
            }
          }
        }
      }
    },
    // 级联选择框选中项变化触发
    handleChange() {
      // 获取参数列表
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      // 选择不是3级分类则清空
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 对已渲染的数据进行清空
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选分类id和所处的面板获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          // 请求类型，动态参数 or 静态属性
          params: { sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      // 将 vals 从字符串分割成数组
      // 给每个item创建inputVisible和inputValue属性，互不影响
      if (this.activeName === 'many') {
        res.data.forEach(item => {
          // 判断是否为空字符串，避免空字符串也分割出一个数组`
          item.attr_vals = item.attr_vals ? item.attr_vals.split(/\s+/) : []

          // 控制文本框的显示与隐藏，新添加一个属性
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })
      } else {
        res.data.forEach(item => {
          // 判断是否为空字符串，避免空字符串也分割出一个数组`
          // item.attr_vals = item.attr_vals ? item.attr_vals.split(/\s+/) : []

          // 控制文本框的显示与隐藏，新添加一个属性
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })
      }

      // 判断获取的是动态参数数据还是静态属性数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 这是 tabs 页签点击的事件
    handleTabClick() {
      // 获取参数列表
      this.getParamsData()
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }

        this.$message.success('添加参数成功！')

        this.addDialogVisible = false
        // 刷新列表
        this.getParamsData()
      })
    },
    // 点击按钮，展示修改对话框
    async showEditDialog(attrId, row) {
      /* 废弃之前写法
       查询当前参数信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      // 将根据id查询到的值赋值到data
      this.editForm = res.data
      */
      this.editForm.attr_name = row.attr_name
      this.editForm.attr_id = row.attr_id
      // 参数和属性保持不变
      this.editForm.attr_vals = row.attr_vals
      // 打开对话框
      this.editDialogVisible = true
    },
    // 重置修改对话框表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过发起请求
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
            attr_vals:
              this.activeName === 'only'
                ? this.editForm.attr_vals
                : this.editForm.attr_vals.join(' ')
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        // 刷新列表
        this.getParamsData()
        // 隐藏对话框
        this.editDialogVisible = false
      })
    },
    // 根据 id 删除对应的动态参数
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消删除操作
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      // 删除逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      )

      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')

      this.$message.success('删除参数成功！')
      // 刷新列表
      this.getParamsData()
    },
    // 将对attr_vals保存到数据库
    async saveAttrVals(row) {
      // 动态参数和静态参数共用这个方法
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // 判断是动态则将数组拼接成字符串
          attr_vals:
            this.activeName === 'only' ? row.attr_vals : row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 添加参数项(文本框失去焦点或者按下 enter 触发)
    async handleInputConfirm(row) {
      // 针对静态属性项修改
      if (this.activeName === 'only') {
        this.saveAttrVals(row)
        return
      }
      // 内容不允许是空字符串，空字符串则清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，可以后续处理
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      // 编程提示
      row.inputVisible = false
      // 提交发起请求
      this.saveAttrVals(row)
    },
    // 删除参数项
    handleClose(i, row) {
      // 警告框
      this.$confirm('确定删除该参数项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        row.attr_vals.splice(i, 1)
        this.saveAttrVals(row)
      })
    },
    // 点击按钮显示文本输入框
    showInput(row) {
      // 显示输入框
      row.inputVisible = true
      // 自动获取焦点
      // vue在同步数据后不会立即渲染，渲染则像是异步操作，$nextTick也像是类型异步；等待渲染完成后执行代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 120px;
}
.onlyDiv {
  font-size: 16px;
  line-height: 40px;
}
</style>
