<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <!-- 搜索框及添加区 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-col :span="4">
            <el-button type="primary" @click="goAddpage">添加商品</el-button>
          </el-col>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="105px"
        ></el-table-column>
        <!-- 商品重量 -->
        <el-table-column
          label="商品重量"
          width="80px"
          prop="goods_weight"
        ></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" width="170px" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="125px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removerById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'list',
  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //商品里列表
      goodsList: [],
      //总列表数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取对应商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200)
        return this.$message.error('获取商品里列表失败！')

      // this.$message.success('获取商品里列表成功！')

      //将获取的数据赋值到 data 里
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    //监听页数大小事件，一页显示几条数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //监听页数变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //删除商品事件
    async removerById(id) {
      // 异步执行代码
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
      // 发起请求
      const { data: res } = await this.$http.delete('goods/' + id)

      if (res.meta.status !== 200) return this.$message.error('删除失败！')

      this.$message.success('删除成功！')
      // 刷新列表
      this.getGoodsList()
    },
    //跳转到添加商品页事件
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
