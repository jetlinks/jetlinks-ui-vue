<template>
    <div class="chart" ref="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import i18n from '@/i18n'
const $t = i18n.global.t

const { proxy } = <any>getCurrentInstance();

const props = defineProps({
    // 图表颜色
    color: {
        type: String,
        default: '#498BEF',
    },
    // 是否展示x轴
    showX: {
        type: Boolean,
        default: false,
    },
    // 是否展示y轴
    showY: {
        type: Boolean,
        default: false,
    },
    // 图表数据
    chartData: {
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
            grid: {
                left: '5%',
                right: '5%',
                top: '5%',
                bottom: '5%',
            },
            tooltip: {
                trigger: 'axis',
                // 		formatter: '{a}<br>{b}: {c}',
                axisPointer: {
                    type: 'shadow',
                },
            },
            xAxis: [
                {
                    show: props.showX,
                    boundaryGap: false,
                    data: props.chartData.map((m: any) => m.date),
                },
            ],
            yAxis: [
                {
                    show: props.showY,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dotted',
                        },
                    },
                },
            ],
            series: [
                {
                    name: $t('components.LineChart.558153-0'),
                    type: 'line',
                    symbol: 'circle',
                    showSymbol: false,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: props.color,
                            lineStyle: {
                                color: props.color,
                                width: 1,
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0.1,
                                            color: '#fff',
                                        },
                                        {
                                            offset: 1,
                                            color: props.color,
                                        },
                                    ],
                                ),
                            },
                        },
                    },
                    data: props.chartData.map(
                        (m: any) => m.value && m.value.toFixed(2),
                    ),
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
    () => props.chartData,
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
