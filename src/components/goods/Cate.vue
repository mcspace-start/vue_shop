<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格占位 vue-table-tree -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 自定义模板列  -->
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <!-- icon 图标 -->
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCatDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页列表页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联选择器 -->
          <!-- options用来绑定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类名称"
      width="50%"
      :visible.sync="editCateDialogVisible"
      @close="editCateDialogClosed"
    >
      <!-- 表单 -->
      <el-form
        :model="editCateForm"
        :rules="editCateRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'cate',
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类数据，默认为空
      cateList: [],
      //总数据条数
      total: 0,
      //为 table 定义列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示将当前列定义为模板列
          type: 'template',
          //表示当前这列使用的名称
          template: 'isOk'
        },
        {
          label: '排序',
          //表示将当前列定义为模板列
          type: 'template',
          //表示当前这列使用的名称
          template: 'order'
        },
        {
          label: '操作',
          //表示将当前列定义为模板列
          type: 'template',
          //表示当前这列使用的名称
          template: 'opt'
        }
      ],
      //添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //添加分类表单数据对象
      addCateForm: {
        //将要添加分类的名称
        cat_name: '',
        //父级分类的 id
        cat_pid: 0,
        //分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类表单验证
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        //展开方式
        expandTrigger: 'hover',
        //可以选择任意级联项
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //级联选择器选中父级分类的id数组
      selectedKeys: [],
      //编辑分类对话框显示与隐藏
      editCateDialogVisible: false,
      //编辑分类数据绑定表单
      editCateForm: {},
      //编辑分类表单数据验证
      editCateRules: {
        cat_name: {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      //    发起获取商品分类数据
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败！')
      //把数据列表复制到 data 里面
      this.cateList = res.data.result
      //数据总条数复制到 data
      this.total = res.data.total
    },
    //监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听 pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //点击按钮展示添加分类对话框
    showAddCateDialog() {
      //先获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类数据的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200)
        return this.$message.error('获取父级分类数据失败！')

      this.parentCateList = res.data
    },
    //级联选择器方式变化时触发
    parentCateChange() {
      //无选中父级分类时则是一级分类

      //如果有选中则 selectedkeys 的长度不为零
      if (this.selectedKeys.length > 0) {
        //父级分类的 id 取等级最低那一位
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类等级赋值，登记刚好为数组length
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        //父级分类的 id
        this.addCateForm.cat_pid = 0
        //为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //点击按钮添加新的分类
    addCate() {
      //验证并发送请求
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201)
          return this.$message.error('添加分类失败！')

        this.$message.success('添加分类成功！')
        //刷新数据列表
        this.getCateList()
        //隐藏对话框
        this.addCateDialogVisible = false
      })
    },
    //添加分类对话框关闭事件，关闭清空表单
    addCateDialogClosed() {
      //重置验证表单
      this.$refs.addCateFormRef.resetFields()
      //重置选中的父级分类对象
      this.selectedKeys = []
      //重置 pid 和 level
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //打开编辑分类对话框
    async showEditCatDialog(id) {
      this.editCateDialogVisible = true
      //根据 id 查询分类

      const { data: res } = await this.$http.get('categories/' + id)

      if (res.meta.status !== 200) return this.$message.error('查询分类失败！')

      this.editCateForm = res.data
    },
    //关闭编辑分类对话框清空验证
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.cat_id = 0
    },
    //编辑分类名称
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) return
        //发起请求
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateForm.cat_id,
          {
            //携带分类名称
            cat_name: this.editCateForm.cat_name
          }
        )

        if (res.meta.status !== 200)
          return this.$message.error('更新分类失败！')

        this.$message.success('更新分类成功！')

        //关闭对话框
        this.editCateDialogVisible = false
        //刷新列表
        this.getCateList()
      })
    },
    //删除分类
    async removeCate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm')
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })

      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')

      this.$message.success('删除成功！')

      this.getCateList()
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
