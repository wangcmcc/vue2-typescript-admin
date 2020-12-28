<template>
  <div>
    <Breadcrumb :headerData='headerData'></Breadcrumb>
    <el-card>
      <div id='main' style='height: 400px; width: 600px;'></div>
    </el-card>
  </div>
</template>
<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '../../component/Breadcrumb.vue';
import { getReportInfo } from '../../api/report';
import { msgCommon } from '../../utils/commsg';
import echarts from 'echarts';
import _ from 'lodash'
@Component({
  name: 'Report',
  components: {
    Breadcrumb
  }
})
export default class Report extends Vue {
  headerData: object = {
    manage: '数据统计',
    sort: '数据报表'
  };

  option: any = {
    title: {
      text: '用户来源'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3'
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
  };

  async mounted() {
    const { data: res } = await getReportInfo();
    if (res.meta.status !== 200) return msgCommon('error', '获取折现图表数据失败！');
    console.log(res.data);
    const myChart: any = echarts.init(
      document.getElementById('main') as HTMLDivElement
    );
    const data = _.merge(res.data, this.option)
    myChart.setOption(data);
  }
}
</script>
<style lang='less' scoped></style>
