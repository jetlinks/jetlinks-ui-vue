<template>
    <div class="page-container">
        <div class="card-header">
            <div class="title">{{ title }}</div>
            <div class="tools">
                <a-space>
                    <a-radio-group
                        v-model:value="dimension"
                        button-style="solid"
                    >
                        <a-radio-button value="today">今日</a-radio-button>
                        <a-radio-button value="week">近一周</a-radio-button>
                        <a-radio-button value="month">近一月</a-radio-button>
                        <a-radio-button value="year">近一年</a-radio-button>
                    </a-radio-group>
                    <a-range-picker v-model:value="dateRange" />
                </a-space>
            </div>
        </div>
        <div class="chart" ref="chartRef"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

// const { proxy } = <any>getCurrentInstance();

const props = defineProps({
    title: { type: String, default: '' },
    // 图表数据
    chartData: { type: Array, default: () => [] },
});

// 统计时间维度
const dimension = ref('week');
const dateRange = ref<any>([]);

/**
 * 绘制图表
 */
const chartRef = ref();
const createChart = () => {
    nextTick(() => {
        const myChart = echarts.init(chartRef.value as HTMLElement);

        const options = {
            grid: {
                left: '7%',
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
                    data: props.chartData.map((m: any) => m.x),
                },
            ],
            yAxis: [
                {
                    show: false,
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'solid',
                        },
                    },
                },
            ],
            series: [
                {
                    name: '播放数量(人次)',
                    type: 'line',
                    symbol: 'circle',
                    showSymbol: false,
                    smooth: true,
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
.page-container {
    .card-header {
        display: flex;
        justify-content: space-between;
        .title {
            font-weight: 700;
            font-size: 16px;
        }
    }
    .chart {
        width: 100%;
        height: 100%;
    }
}
</style>
