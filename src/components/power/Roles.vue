<template>
  <div class="content-main">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-scrollbar style="height:96%" class="content-scrollbar">
      <!-- 卡片视图区 -->
      <el-card>
        <!-- 添加角色按钮区 -->
        <el-button type="primary" @click="addDialogVisible = true"
          >添加角色</el-button
        >
        <!-- 角色列表区 -->
        <el-table :data="roleList" border stripe v-loading="loading">
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- class添加border样式 -->
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                :key="item1.id"
              >
                <!-- 渲染一级权限 -->
                <el-col :span="6">
                  <el-tag
                    @close="removeRightById(scope.row, item1.id)"
                    closable
                  >
                    {{ item1.authName }}
                  </el-tag>
                  <!-- 箭头icon -->
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="18">
                  <!-- 通过 for 嵌套二级权限  -->
                  <el-row
                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                  >
                    <!-- 二级 -->
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        @close="removeRightById(scope.row, item2.id)"
                        closable
                        >{{ item2.authName }}</el-tag
                      >
                      <!-- 箭头 icon -->
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18">
                      <el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        @close="removeRightById(scope.row, item3.id)"
                        closable
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column label="#" type="index"></el-table-column>
          <!-- 内容列 -->
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作" width="300px">
            <!-- 自定义模板 改为按钮操作 -->
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                >编辑</el-button
              >
              <!-- 删除 -->
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeRoleById(scope.row.id)"
                >删除</el-button
              >
              <!-- 分配权限 -->
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editRoleForm"
        :rules="editRoleRules"
        ref="editRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      lock-scroll
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        ref="treeRef"
        :props="treeProps"
        node-key="id"
        :default-checked-keys="defKeys"
        show-checkbox
        default-expand-all
      ></el-tree>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'rights',
  data() {
    return {
      // 角色列表
      roleList: [],
      // 添加角色对话框
      addDialogVisible: false,
      // 添加角色列表对象数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色列表验证规则
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框
      editDialogVisible: false,
      // 修改角色信息提交内容对象
      editRoleForm: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      // 修改角色信息校验规则
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 25, message: '长度在 4 到 25 个字符', trigger: 'blur' }
        ]
      },
      // 是否显示权限分配对话框
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件属性绑定对象，对应树形控件生成规则
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点 id 值
      defKeys: [],
      // 当前即将分配角色的 id 用于分配权限
      roleId: '',
      // 加载动画
      loading: true
    }
  },
  created() {
    // 首次获得所有角色列表
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // 成功获取列表
      this.roleList = res.data
      this.loading = false
    },
    // 关闭添加角色对话框
    addDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色信息提交
    addRoleInfo() {
      // 发起添加角色信息请求
      this.$refs.addRoleFormRef.validate(async valid => {
        // 校验规则
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('创建角色失败！')
        }
        this.$message.success('创建角色成功！')
        // 刷新列表和关闭对话框
        this.getRoleList()
        this.addDialogVisible = false
      })
    },
    // 根据id查询当前角色信息
    async showEditDialog(id) {
      // 打开对话框
      this.editDialogVisible = true
      // 发起根据id查询当前角色信息的请求
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.editRoleForm = res.data
    },
    // 关闭修改角色信息对话框
    editDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 编辑角色信息提交
    editRoleInfo() {
      // 发起编辑角色请求
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色信息失败！')
        }
        this.$message.success('修改角色信息成功！')
        // 刷新列表
        this.getRoleList()
        // 隐藏对话框
        this.editDialogVisible = false
      })
    },
    // 根据 id 删除角色
    async removeRoleById(id) {
      // 弹出警示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 判断是否取消删除操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除操作！')
      }

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      // 删除后重新获取列表
      this.getRoleList()
    },
    // 展开列根据 id 删除对应权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')

      // this.getRoleList()
      // 只渲染局部而不是所有数据 不需要getRoleList
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) return this.$message.error('获取权限失败！')
      // 获取全部权限列表信息
      this.rightsList = res.data
      // 递归获取三级节点的 id role 包含已选中节点 不包含未选中节点
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有的三级节点 id
    getLeafKeys(node, arr) {
      // 如果当前节点不包含 children 的属性则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        // 获取已选节点 id 数组进行展开
        ...this.$refs.treeRef.getCheckedKeys(),
        // 获取半选节点 id 数组展开
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 对数组进行拼接
      const idStr = keys.join(',')
      // 发起权限分配请求
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr
        }
      )

      if (res.meta.status !== 200) return this.$message('分配权限失败！')

      this.$message.success('分配权限成功！')

      // 刷新列表级更新数据
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
