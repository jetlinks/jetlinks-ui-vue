<template>
    <j-spin :spinning="loading">
        <div class="dash-board">
            <div class="header">
                <h3>JVM内存使用率趋势</h3>
                <j-range-picker
                    @change="pickerTimeChange"
                    :allowClear="false"
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model:value="data.time"
                >
                    <template #suffixIcon
                        ><AIcon type="CalendarOutlined"
                    /></template>
                    <template #renderExtraFooter>
                        <j-radio-group
                            default-value="a"
                            button-style="solid"
                            style="margin-right: 10px"
                            v-model:value="data.type"
                        >
                            <j-radio-button value="hour">
                                最近1小时
                            </j-radio-button>
                            <j-radio-button value="today">
                                今日
                            </j-radio-button>
                            <j-radio-button value="week">
                                近一周
                            </j-radio-button>
                        </j-radio-group></template
                    >
                </j-range-picker>
            </div>
            <div>
                <j-empty
                    v-if="isEmpty"
                    style="height: 200px; margin-top: 100px"
                />
                <div
                    v-else
                    ref="chartRef"
                    style="width: 100%; height: 300px"
                ></div>
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup name="Jvm">
import * as echarts from 'echarts';
import { dashboard } from '@/api/link/dashboard';
import dayjs from 'dayjs';
import {
    getTimeByType,
    arrayReverse,
    typeDataLine,
    areaStyleJvm,
    defulteParamsData,
} from './tool.ts';
import { DataType } from '../typings';

const props = defineProps({
  serviceId: {
    type: String,
    default: undefined
  },
  isNoCommunity: {
    type:Boolean,
    default: false
  }
})

const chartRef = ref<Record<string, any>>({});
const loading = ref(false);
const data = ref<DataType>({
    type: 'hour',
    time: [null, null],
});
const isEmpty = ref(false);
const pickerTimeChange = () => {
    data.value.type = undefined;
};

const getJVMEcharts = async (val: any) => {
    loading.value = true;
    const res: any = await dashboard(defulteParamsData('jvm', val));
    if (res.success) {
        const _jvmOptions = {};
        const _jvmXAxis = new Set();
        if (res.result?.length) {
          const filterArray =  props.isNoCommunity ? res.result.filter((item : any) => item.data?.clusterNodeId === props.serviceId) : res.result
          filterArray.forEach((item: any) => {
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
                    dayjs(value.timestamp).format('YYYY-MM-DD HH:mm'),
                );
                _jvmOptions[nodeID]?.push(_value);
            });
            handleJVMOptions(_jvmOptions, [..._jvmXAxis.keys()]);
        } else {
            handleJVMOptions([], []);
            isEmpty.value = true;
        }
    }
    setTimeout(() => {
        loading.value = false;
    }, 300);
};

const setOptions = (optionsData: any, key: string) => ({
    data: arrayReverse(optionsData[key]),
    name: key,
    type: 'line',
    smooth: true,
    symbol: 'none',
    areaStyle: areaStyleJvm,
});
const handleJVMOptions = (optionsData: any, xAxis: any) => {
    if (optionsData.length === 0 && xAxis.length === 0) return;
    const chart: any = chartRef.value;
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
    (value) => {
        if (value === undefined) return;
        const date = getTimeByType(value);
        data.value.time = [dayjs(date), dayjs(new Date())];
    },
    { immediate: true, deep: true },
);

watchEffect(() => {
  const time = data.value.time
  if (time && Array.isArray(time) && time.length === 2 && time[0]) {
    if (!props.isNoCommunity || props.serviceId) {
      getJVMEcharts(data.value);
    }
  }
})

</script>

<style lang="less" scoped>
.dash-board {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
    background-color: #fff;
    // box-shadow: 0px 2.73036px 5.46071px rgba(31, 89, 245, 0.2);
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
