<template>
  <div class="content-main">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 滚动条区域 -->
    <el-scrollbar style="height:96%" class="content-scrollbar">
      <!-- 卡片视图区 -->
      <el-card>
        <el-table :data="rightsList" border stripe v-loading="loading">
          <!-- 计数列 -->
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限登记">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'"
                >二级</el-tag
              >
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'rights',
  data() {
    return {
      // 权限列表
      rightsList: [],
      // 加载动画
      loading: true
    }
  },
  created() {
    // 首次获取所有权限列表
    this.getRightsList()
  },
  methods: {
    // 获取所有权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.loading = false
        return this.$message.error('获取权限列表失败')
      }
      // 成功获取列表
      this.rightsList = res.data
      // console.log(res.data)
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped></style>
