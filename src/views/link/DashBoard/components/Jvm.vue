<template>
    <a-spin :spinning="loading">
        <div class="dash-board">
            <div class="header">
                <h3>JVM内存使用率趋势</h3>
                <a-range-picker
                    @change="pickerTimeChange"
                    :allowClear="false"
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model="data.time"
                >
                    <template #suffixIcon><a-icon type="calendar" /></template>
                    <template #renderExtraFooter>
                        <a-radio-group
                            default-value="a"
                            button-style="solid"
                            style="margin-right: 10px"
                            v-model:value="data.type"
                        >
                            <a-radio-button value="hour">
                                最近1小时
                            </a-radio-button>
                            <a-radio-button value="today">
                                今日
                            </a-radio-button>
                            <a-radio-button value="week">
                                近一周
                            </a-radio-button>
                        </a-radio-group></template
                    >
                </a-range-picker>
            </div>
            <div ref="chartRef" style="width: 100%; height: 300px"></div>
        </div>
    </a-spin>
</template>

<script lang="ts" setup name="Jvm">
import * as echarts from 'echarts';
import { dashboard } from '@/api/link/dashboard';
import moment from 'moment';
import {
    getTimeFormat,
    getTimeByType,
    arrayReverse,
    typeDataLine,
    areaStyleJvm,
    defulteParamsData,
} from './tool.ts';

const chartRef = ref<Record<string, any>>({});

const loading = ref(false);
const data = ref({
    type: 'hour',
    time: [null, null],
});

const pickerTimeChange = () => {
    data.value.type = undefined;
};

const getJVMEcharts = async (val) => {
    loading.value = true;
    const res = await dashboard(defulteParamsData('jvm', val));
    if (res.success) {
        const _jvmOptions = {};
        const _jvmXAxis = new Set();
        if (res.result?.length) {
            res.result.forEach((item) => {
                const value = item.data.value;
                const memoryJvmHeapFree = value.memoryJvmHeapFree;
                const memoryJvmHeapTotal = value.memoryJvmHeapTotal;
                const nodeID = item.data.clusterNodeId;

                const _value = (
                    ((memoryJvmHeapTotal - memoryJvmHeapFree) /
                        memoryJvmHeapTotal) *
                    100
                ).toFixed(2);
                if (!_jvmOptions[nodeID]) {
                    _jvmOptions[nodeID] = [];
                }
                _jvmXAxis.add(
                    moment(value.timestamp).format(
                        getTimeFormat(data.value.type),
                    ),
                );
                _jvmOptions[nodeID].push(_value);
            });
        }
        handleJVMOptions(_jvmOptions, [..._jvmXAxis.keys()]);
    }
    setTimeout(() => {
        loading.value = false;
    }, 300);
};

const setOptions = (optionsData, key) => ({
    data: arrayReverse(optionsData[key]),
    name: key,
    type: 'line',
    smooth: true,
    symbol: 'none',
    areaStyle: areaStyleJvm,
});
const handleJVMOptions = (optionsData, xAxis) => {
    const chart = chartRef.value;
    if (chart) {
        const myChart = echarts.init(chart);
        const dataKeys = Object.keys(optionsData);
        const options = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: arrayReverse(xAxis),
            },
            tooltip: {
                trigger: 'axis',
                valueFormatter: (value: any) => `${value}%`,
            },
            yAxis: {
                type: 'value',
            },
            grid: {
                left: '50px',
                right: '50px',
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
                {
                    start: 0,
                    end: 100,
                },
            ],
            color: ['#60DFC7'],
            series: dataKeys.length
                ? dataKeys.map((key) => setOptions(optionsData, key))
                : typeDataLine,
        };
        myChart.setOption(options);
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }
};

watch(
    () => data.value.type,
    (val) => {
        const endTime = moment(new Date());
        const startTime = getTimeByType(val);
        data.value.time = [startTime, endTime];
    },
    { immediate: true, deep: true },
);
watch(
    () => data.value,
    (val) => {
        const { time } = val;
        if (time && Array.isArray(time) && time.length === 2 && time[0]) {
            getJVMEcharts(val);
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped>
.dash-board {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
    background-color: #fff;
    box-shadow: 0px 2.73036px 5.46071px rgba(31, 89, 245, 0.2);
    border-radius: 2px;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
        width: 200px;
        margin-top: 8px;
    }
}
</style>
