<template>
    <a-spin :spinning="loading">
        <div class="dash-board">
            <div class="header">
                <div class="left">
                    <h3 style="width: 80px">网络流量</h3>
                    <a-radio-group
                        button-style="solid"
                        v-model:value="data.type"
                    >
                        <a-radio-button value="bytesRead">
                            上行
                        </a-radio-button>
                        <a-radio-button value="bytesSent">
                            下行
                        </a-radio-button>
                    </a-radio-group>
                </div>
                <div class="right">
                    <a-radio-group
                        default-value="a"
                        button-style="solid"
                        style="margin-right: 10px"
                        v-model:value="data.time.type"
                    >
                        <a-radio-button value="hour">
                            最近1小时
                        </a-radio-button>
                        <a-radio-button value="today"> 今日 </a-radio-button>
                        <a-radio-button value="week"> 近一周 </a-radio-button>
                    </a-radio-group>
                    <a-range-picker
                        :allowClear="false"
                        :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss"
                        v-model="data.time.time"
                        @change="pickerTimeChange"
                    >
                        <template #suffixIcon
                            ><AIcon type="CalendarOutlined"
                        /></template>
                    </a-range-picker>
                </div>
            </div>
            <div>
                <div ref="chartRef" style="width: 100%; height: 350px"></div>
            </div>
        </div>
    </a-spin>
</template>

<script lang="ts" setup name="Network">
import { dashboard } from '@/api/link/dashboard';
import {
    getTimeByType,
    typeDataLine,
    areaStyle,
    networkParams,
} from './tool.ts';
import moment from 'moment';
import * as echarts from 'echarts';

const chartRef = ref<Record<string, any>>({});
const loading = ref(false);
const data = ref({
    type: 'bytesRead',
    time: {
        type: 'today',
        time: [null, null],
    },
});

const pickerTimeChange = () => {
    data.value.time.type = undefined;
};

const getNetworkEcharts = async (val) => {
    loading.value = true;
    const resp = await dashboard(networkParams(val));
    if (resp.success) {
        const _networkOptions = {};
        const _networkXAxis = new Set();
        if (resp.result.length) {
            resp.result.forEach((item) => {
                const value = item.data.value;
                const _data = [];
                const nodeID = item.data.clusterNodeId;
                value.forEach((item) => {
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
        }
    }
    setTimeout(() => {
        loading.value = false;
    }, 300);
};
const networkValueRender = (obj) => {
    const { value } = obj;
    let _data = '';
    if (value >= 1024 && value < 1024 * 1024) {
        _data = `${Number((value / 1024).toFixed(2))}KB`;
    } else if (value >= 1024 * 1024) {
        _data = `${Number((value / 1024 / 1024).toFixed(2))}M`;
    } else {
        _data = `${value}B`;
    }
    return `${obj?.axisValueLabel}<br />${obj?.marker}${obj?.seriesName}:     ${_data}`;
};

const setOptions = (data, key) => ({
    data: data[key]._data, // .map((item) => Number((item / 1024 / 1024).toFixed(2))),
    name: key,
    type: 'line',
    smooth: true,
    areaStyle,
});

const handleNetworkOptions = (optionsData, xAxis) => {
    const chart = chartRef.value;
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
            },
            grid: {
                left: '100px',
                right: '50px',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (_value) => networkValueRender(_value[0]),
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
        const endTime = moment(new Date());
        const startTime = getTimeByType(value);
        data.value.time.time = [startTime, endTime];
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
