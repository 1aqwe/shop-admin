<template>
  <div>
 <el-card>
  <div id="main" style="width: 600px;height:400px;"></div>
 </el-card> 
  
 </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
data() {
  return {
    option : {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
  }
},
async mounted() {
   var myChart = echarts.init(document.getElementById('main'));
   
    const res=await this.$http.get('reports/type/1')
    console.log(res)
     if(res.data.meta.status!==200){
                this.$message.error('数据获取失败')
            }
           
      

      // 指定图表的配置项和数据
      // var option = {
      //   title: {
      //     text: 'ECharts 入门示例'
      //   },
      //   tooltip: {},
      //   legend: {
      //     data: ['销量']
      //   },
      //   xAxis: {
      //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      //   },
      //   yAxis: {},
      //   series: [
      //     {
      //       name: '销量',
      //       type: 'bar',
      //       data: [5, 20, 36, 10, 10, 20]
      //     }
      //   ]
      // };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(res.data.data);
},
methods: {

},
created() {
  
},
}
</script>

<style>

</style>