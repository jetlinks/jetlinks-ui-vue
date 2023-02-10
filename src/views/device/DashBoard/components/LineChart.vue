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
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                show: false,
                data:props.chartXData
            },
            yAxis: {
                type: 'value',
                show: false,
            },
            grid: {
                top: '2%',
                bottom: 0,
            },
            series: [
                {
                    name: '消息量',
                    data: props.chartYData,
                    type: 'line',
                    smooth: true, // 是否平滑曲线
                    symbolSize: 0, // 拐点大小
                    color: '#F29B55',
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: '#FBBB87', // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: '#FFFFFF', //   0% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
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
