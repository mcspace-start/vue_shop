<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 搜索输入框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="search_id" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryOrder"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe v-loading="loading">
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 订单编号 -->
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <!-- 订单id -->
        <el-table-column
          label="订单 ID"
          prop="order_id"
          width="150px"
        ></el-table-column>
        <!-- 订单价格 -->
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100px"
        ></el-table-column>
        <!-- 是否付款 -->
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <!-- 判断是否付款 -->
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <!-- 是否发货 -->
        <el-table-column label="是否发货" prop="is_send" width="90px">
        </el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间" prop="create_time" width="180px">
          <template slot-scope="scope">
            <!-- 过滤器 转换时间戳 -->
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 修改地址按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showBox(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 物流进度按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="物流进度"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressBox"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <!-- 表单区 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 省市区/县 -->
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <!-- 详细地址 -->
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 物流时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
          color="#0bbd87"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
// 导入外部数据源
import cityData from './citydata.js'
export default {
  name: 'order',
  data() {
    return {
      // 查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 总条数
      total: 0,
      // 订单列表数据
      orderList: [],
      // 修改地址对话框
      addressVisible: false,
      // 修改地址对话框数据绑定对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址对话框表单验证
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市/区', trigger: 'blur' }
        ],
        address2: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }
        ]
      },
      // 导入citydata数据 简写
      cityData,
      // 展示物流进度对话框
      progressVisible: false,
      // 物流信息
      progressInfo: [],
      search_id: '',
      // 遮罩层
      loading: true
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      // 赋值
      this.total = res.data.total
      this.orderList = res.data.goods
      // 遮罩层
      this.loading = false
    },
    // 改变页码大小时触发
    handleSizeChange(newSize) {
      this.loading = true
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 改变页数时触发
    handleCurrentChange(newPage) {
      this.loading = true
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址对话框
    showBox(row) {
      this.addressVisible = true
    },
    // 修改地址对话框关闭时清空验证
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 修改地址
    editAddress() {
      this.addressVisible = false
      return this.$message.error('未提供修改接口')
    },
    // 显示物流进度对话框
    async showProgressBox() {
      // 获取物流数据
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      // 赋值
      this.progressInfo = res.data
      // 打开对话框
      this.progressVisible = true
    },
    // 查询订单
    async queryOrder() {
      this.$message.error('未提供查询接口！')
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
