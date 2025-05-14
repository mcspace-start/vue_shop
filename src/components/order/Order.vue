<template>
  <div class="main_wrap">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card
      :body-style="{
        padding: 0,
        height: '100%',
      }"
    >
      <div class="main">
        <div class="search">
          <!-- 搜索输入框 -->
          <el-row>
            <el-col :span="8">
              <el-input
                placeholder="请输入订单ID"
                v-model="search_id"
                @clear="getOrderList"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="queryOrder"
                ></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <div class="content" v-loading="loading">
          <!-- 订单列表数据 -->
          <el-table
            :data="orderList"
            border
            stripe
            @row-click="getOrderDetails"
          >
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 订单编号 -->
            <el-table-column
              label="订单编号"
              prop="order_number"
              show-overflow-tooltip
            ></el-table-column>
            <!-- 订单id -->
            <el-table-column
              label="订单 ID"
              prop="order_id"
              width="70px"
            ></el-table-column>
            <!-- 订单价格 -->
            <el-table-column
              label="订单价格"
              prop="order_price"
              width="80px"
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
            <el-table-column
              label="下单时间"
              prop="create_time"
              show-overflow-tooltip
            >
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
        </div>
        <div class="pagination">
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
        </div>
      </div>
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
    <!-- 订单详情 -->
    <el-dialog title="订单详情" :visible.sync="orderDetailsVisible" width="50%">
      <el-table :data="orderGoods" border style="width: 100%">
        <el-table-column prop="goods_id" label="商品ID"> </el-table-column>
        <el-table-column prop="goods_price" label="单价"> </el-table-column>
        <el-table-column prop="goods_number" label="数量"> </el-table-column>
        <el-table-column prop="goods_total_price" label="总价">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
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
        pagesize: 5,
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
        address2: '',
      },
      // 修改地址对话框表单验证
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市/区', trigger: 'blur' },
        ],
        address2: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur',
          },
        ],
      },
      // 导入citydata数据 简写
      cityData,
      // 展示物流进度对话框
      progressVisible: false,
      // 物流信息
      progressInfo: [],
      search_id: '',
      // 遮罩层
      loading: true,
      orderDetailsVisible: false,
      orderGoods: {},
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取列表数据
    async getOrderList() {
      try {
        const { data: res } = await this.$http.get('orders', {
          params: this.queryInfo,
        })

        if (res.meta.status !== 200) {
          this.loading = false
          return this.$message.error('获取订单列表失败！')
        }
        // 赋值
        this.total = res.data.total
        this.orderList = res.data.goods
        // 遮罩层
        this.loading = false
      } catch (err) {
        this.$message.error('获取订单列表失败！')
      }
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
    showBox() {
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
      try {
        // 获取物流数据
        const { data: res } = await this.$http.get('/kuaidi/1106975712662')

        if (res.meta.status !== 200) {
          return this.$message.error('获取物流信息失败！')
        }
        // 赋值
        this.progressInfo = res.data
        // 打开对话框
        this.progressVisible = true
      } catch (err) {
        this.$message.error('获取物流信息失败！')
      }
    },
    // 查询订单
    async queryOrder() {
      try {
        if (this.search_id.trim() == '') return this.$message.error('ID为空！')
        const { data: res } = await this.$http.get('/orders/' + this.search_id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //
        this.orderList = [res.data]
        this.total = 1
      } catch {
        this.$message.error('查询订单失败！')
      }
    },
    // 查看订单详情
    async getOrderDetails(order, cloumn) {
      if (cloumn.label == '操作') return
      const id = order.order_id
      try {
        const { data: res } = await this.$http.get('/orders/' + id)

        this.orderGoods = res.data.goods
        this.orderDetailsVisible = true
      } catch (err) {
        this.$message.error('获取订单详情失败！')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.main_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-card {
    height: 100%;

    .main {
      display: flex;
      padding: 20px;
      height: 100%;
      flex-direction: column;

      > .search {
        flex: 0 0 40px;
      }

      > .content {
        flex: 1;
        overflow: auto;
      }

      > .pagination {
        flex: 0 0 87px;
        margin-top: auto;
      }
    }
  }
}
.el-cascader {
  width: 100%;
}
</style>
