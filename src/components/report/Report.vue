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
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#999'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      loading: true
    }
  },
  created() {},
  async mounted() {
    // 初始化报表
    var myChart = echarts.init(document.getElementById('main'))
    // 准备数据和配置项
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败!')
    }
    console.log(_.cloneDeep(res))
    // 配置图表数据 (合并数据)
    const result = _.merge(res.data, this.options)
    console.log(result)
    // 设置hover高亮时其他隐藏
    result.series.forEach(item => {
      item.emphasis = {
        focus: 'series'
      }
    })
    // 5. 使用刚指定的配置项和数据进行渲染
    myChart.setOption(result)
    this.loading = false
  }
}
</script>

<style lang="less" scoped>
#main {
  width: 760px;
  height: 420px;
}
</style>
