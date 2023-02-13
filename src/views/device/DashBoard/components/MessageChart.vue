<template>
    <div class="chart" ref="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

const { proxy } = <any>getCurrentInstance();

const props = defineProps({
    // 图表数据
    x: {
        type: Array,
        default: () => [],
    },
    y: {
        type: Array,
        default: () => [],
    },
    maxY:{
        type:Number,
        default: 0
    }
});

/**
 * 绘制图表
 */
const createChart = () => {
    nextTick(() => {
        const myChart = echarts.init(proxy.$refs.chart);
        const options = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: props.x,
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br />{a0}: {c0}',
          // formatter: '{b0}<br />{a0}: {c0}<br />{a1}: {c1}%'
        },
        grid: {
          top: '2%',
          bottom: '5%',
          left: props.maxY > 100000 ? '90px' : '50px',
          right: '50px',
        },
        series: [
          {
            name: '消息量',
            data: props.y,
            type: 'bar',
            // type: 'line',
            // smooth: true,
            color: '#597EF7',
            barWidth: '30%',
            // areaStyle: {
            //   color: {
            //     type: 'linear',
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: '#685DEB', // 100% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: '#FFFFFF', //   0% 处的颜色
            //       },
            //     ],
            //     global: false, // 缺省为 false
            //   },
            // },
          },
          {
            name: '占比',
            data: props.y,
            // data: percentageY,
            type: 'line',
            smooth: true,
            symbolSize: 0, // 拐点大小
            color: '#96ECE3',
          },
        ],
      }
        myChart.setOption(options);
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    });
};

watch(
    () => props.y,
    () => createChart(),
    { immediate: true, deep: true },
);
</script>

<style scoped lang="less">
.chart {
    width: 100%;
    height: 100%;
}
</style>
