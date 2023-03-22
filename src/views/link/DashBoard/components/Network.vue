<template>
    <j-spin :spinning="loading">
        <div class="dash-board">
            <div class="header">
                <div class="left">
                    <h3 style="width: 80px">网络流量</h3>
                    <j-radio-group
                        button-style="solid"
                        v-model:value="data.type"
                    >
                        <j-radio-button value="bytesRead">
                            上行
                        </j-radio-button>
                        <j-radio-button value="bytesSent">
                            下行
                        </j-radio-button>
                    </j-radio-group>
                </div>
                <div class="right">
                    <j-radio-group
                        default-value="a"
                        button-style="solid"
                        style="margin-right: 10px"
                        v-model:value="data.time.type"
                    >
                        <j-radio-button value="hour">
                            最近1小时
                        </j-radio-button>
                        <j-radio-button value="today"> 今日 </j-radio-button>
                        <j-radio-button value="week"> 近一周 </j-radio-button>
                    </j-radio-group>
                    <j-range-picker
                        :allowClear="false"
                        :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss"
                        v-model:value="data.time.time"
                        @change="pickerTimeChange"
                    >
                        <template #suffixIcon
                            ><AIcon type="CalendarOutlined"
                        /></template>
                    </j-range-picker>
                </div>
            </div>
            <div>
                <j-empty
                    v-if="isEmpty"
                    style="height: 250px; margin-top: 100px"
                />
                <div
                    v-else
                    ref="chartRef"
                    style="width: 100%; height: 350px"
                ></div>
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup name="Network">
import { dashboard } from '@/api/link/dashboard';
import {
    getTimeByType,
    typeDataLine,
    areaStyle,
    networkParams,
} from './tool.ts';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { DataType } from '../typings.d';

const chartRef = ref<Record<string, any>>({});
const loading = ref(false);
const data = ref<DataType>({
    type: 'bytesRead',
    time: {
        type: 'hour',
        time: [null, null],
    },
});
const isEmpty = ref(false);
const pickerTimeChange = (value: any) => {
    data.value.time.type = undefined;
};

const getNetworkEcharts = async (val: any) => {
    loading.value = true;
    const resp: any = await dashboard(networkParams(val));
    if (resp.success) {
        const _networkOptions = {};
        const _networkXAxis = new Set();
        if (resp.result.length) {
            resp.result.forEach((item: any) => {
                const value = item.data.value;
                const _data: Array<any> = [];
                const nodeID = item.data.clusterNodeId;
                value.forEach((item: any) => {
                    _data.push(item.value);
                    _networkXAxis.add(item.timeString);
                });
                _networkOptions[nodeID] = {
                    _data: _networkOptions[nodeID]
                        ? _networkOptions[nodeID]._data.concat(_data)
                        : _data,
                };
            });
            handleNetworkOptions(_networkOptions, [..._networkXAxis.keys()]);
        } else {
            handleNetworkOptions([], []);
            isEmpty.value = true;
        }
    }
    setTimeout(() => {
        loading.value = false;
    }, 300);
};

const formatterData = (value: any) => {
    let _data = '';
    if (value >= 1024 && value < 1024 * 1024) {
        _data = `${Number((value / 1024).toFixed(2))}KB`;
    } else if (value >= 1024 * 1024) {
        _data = `${Number((value / 1024 / 1024).toFixed(2))}M`;
    } else {
        _data = `${value}B`;
    }
    return _data;
};

const networkValueRender = (obj: any) => {
    const { value } = obj;
    return `${obj?.axisValueLabel}<br />${obj?.marker}${
        obj?.seriesName
    } &nbsp; ${formatterData(value)}`;
};

const setOptions = (data: any, key: string) => ({
    data: data[key]._data, // .map((item) => Number((item / 1024 / 1024).toFixed(2))),
    name: key,
    type: 'line',
    smooth: true,
    areaStyle,
});

const handleNetworkOptions = (optionsData: any, xAxis: any) => {
    if (optionsData.length === 0 && xAxis.length === 0) return;
    const chart: any = chartRef.value;
    if (chart) {
        const myChart = echarts.init(chart);
        const dataKeys = Object.keys(optionsData);
        const options = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis,
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (_value: any) => formatterData(_value),
                },
            },
            grid: {
                left: '70px',
                right: '50px',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (_value: any) => networkValueRender(_value[0]),
            },
            color: ['#979AFF'],
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
    () => data.value.time.type,
    (value) => {
        const date = getTimeByType(value);
        data.value.time.time = [dayjs(date), dayjs(new Date())];
    },
    { immediate: true, deep: true },
);
watch(
    () => data.value,
    (value) => {
        const {
            time: { time },
        } = value;
        if (time && Array.isArray(time) && time.length === 2 && time[0]) {
            getNetworkEcharts(value);
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
    .left h3 {
        width: 200px;
        margin-top: 8px;
    }
}
.left,
.right {
    display: flex;
    align-items: center;
}
</style>
