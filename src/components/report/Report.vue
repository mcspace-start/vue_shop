<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" v-loading="loading"></div>
    </el-card>
  </div>
</template>
<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'loadsh'
export default {
  name: 'report',
  data() {
    return {
      // echarts数据对象（需要合并的数据）
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#999',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
      loading: false,
      // 保存图表实例
      chart: null,
    }
  },
  mounted() {
    this.initEchart()
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },
  // 组件销毁前
  beforeDestroy() {
    // 组件销毁前移除事件监听
    window.removeEventListener('resize', this.handleResize)
    // 销毁图表实例
    this.chart && this.chart.dispose()
  },
  methods: {
    async getData() {
      // 准备数据和配置项
      try {
        const { data } = await this.$http.get('reports/type/1')
        if (data.meta.status !== 200) {
          this.$message.info(data.meta.msg)
          return null
        } else {
          return data.data
        }
      } catch (error) {
        this.$message.error('获取数据错误！')
      }
      // 配置图表数据 (合并数据)
    },
    async initEchart() {
      this.loading = true
      const echartsData = await this.getData()
      if (echartsData) {
        // 初始化报表
        this.chart = echarts.init(document.getElementById('main'))
        const result = _.merge(echartsData, this.options)
        // 设置hover高亮时其他隐藏
        result.series.forEach((item) => {
          item.emphasis = {
            focus: 'series',
          }
        })
        // 使用配置项和数据进行渲染
        this.chart.setOption(result)
      }
      this.loading = false
    },
    // 处理窗口大小变化
    handleResize() {
      this.chart && this.chart.resize()
    },
  },
}
</script>

<style lang="less" scoped>
#main {
  width: 100%;
  height: 420px;
}
</style>
