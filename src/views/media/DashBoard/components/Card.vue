<template>
    <div class="wrapper">
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
                    <a-range-picker
                        format="YYYY-MM-DD HH:mm:ss"
                        valueFormat="x"
                        v-model:value="dateRange"
                    />
                </a-space>
            </div>
        </div>
        <div v-if="chartData.length" class="chart" ref="chartRef"></div>
        <a-empty v-else class="no-data" description="暂无数据"></a-empty>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import moment from 'moment';

// const { proxy } = <any>getCurrentInstance();
type Emits = {
    (e: 'change', data: any): void;
};
const emits = defineEmits<Emits>();

const props = defineProps({
    title: { type: String, default: '' },
    // 图表数据
    chartData: { type: Array, default: () => [] },
});

// 统计时间维度
const dimension = ref('week');
const dateRange = ref<any>([
    moment().subtract(1, 'week').format('x'),
    moment().format('x'),
]);

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
    (val) => {
        console.log('createChart', val);

        createChart();
    },
    { deep: true },
);
watch(
    () => dateRange.value,
    (val) => {
        emits('change', {
            time: {
                start: val[0],
                end: val[1],
            },
        });
    },
    { immediate: true, deep: true },
);
watch(
    () => dimension.value,
    (val) => {
        if (val === 'today') {
            dateRange[0] = moment().startOf('day').format('x');
        }
        if (val === 'week') {
            dateRange[0] = moment().subtract(1, 'week').format('x');
        }
        if (val === 'month') {
            dateRange[0] = moment().subtract(1, 'month').format('x');
        }
        if (val === 'year') {
            dateRange[0] = moment().subtract(1, 'year').format('x');
        }
        dateRange[1] = moment().format('x');
        emits('change', {
            time: {
                start: dateRange[0],
                end: dateRange[1],
            },
        });
    },
);
</script>

<style scoped lang="less">
.wrapper {
    padding: 24px;
    background-color: #fff;
    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        .title {
            font-weight: 700;
            font-size: 16px;
        }
    }
    .chart,
    .no-data {
        width: 100%;
        min-height: calc(100vh - 430px);
    }
    .no-data {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>
