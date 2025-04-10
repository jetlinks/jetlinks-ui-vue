<template>
 <div class="chart" ref="chart" ></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

const { proxy } = <any>getCurrentInstance();

const props = defineProps({
 // 图表数据
 options:{
     type:Object,
     default:()=>{}
 },
 style: {
     type: Object,
     default: () => ({
         width: '100%',
         height: '100%'
     })
 }
});


/**
* 绘制图表
*/
const createChart = () => {
 nextTick(() => {
     const myChart = echarts.init(proxy.$refs.chart);
     myChart.setOption(props.options);
     window.addEventListener('resize', function () {
         myChart.resize();
     });
 });
};

watch(
 () => props.options,
 () => createChart(),
 { immediate: true, deep: true },
);
watch(
 () => props.style,
 () => {
     nextTick(() => {
        // console.log('resize');
         const myChart = echarts.init(proxy.$refs.chart);
         myChart.resize();
     });
 },
 { immediate: true, deep: true },
)

</script>

<style scoped lang="less">
.chart {
 width: 100%;
 height: 100%;
}
</style>
