<template>
    <div class="chart" ref="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

const { proxy } = <any>getCurrentInstance();

const props = defineProps({
    // 图表数据
    chartYData: {
        type: Array,
        default: () => [],
    },
    chartXData: {
        type: Array,
        default: () => [],
    },
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
                data: props.chartXData,
                show: false,
            },
            yAxis: {
                type: 'value',
                show: false,
            },
            grid: {
                top: '5%',
                bottom: 0,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            series: [
                {
                    name: '在线数',
                    data: props.chartYData.reverse(),
                    type: 'bar',
                    showBackground: true,
                    itemStyle: {
                        color: '#D3ADF7',
                    },
                },
            ],
        };
        myChart.setOption(options);
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    });
};

watch(
    () => props.chartYData,
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
