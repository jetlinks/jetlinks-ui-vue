<template>
    <j-spin :spinning="loading">
        <div class="dash-board">
            <div class="header">
                <div class="left">
                    <h3 style="width: 100px">点位数据量</h3>
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
                        v-model="data.time"
                        @change="pickerTimeChange"
                    >
                        <template #suffixIcon
                            ><AIcon type="CalendarOutlined"
                        /></template>
                    </j-range-picker>
                </div>
            </div>
            <div>
                <div ref="chartRef" style="width: 100%; height: 350px"></div>
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup>
import { dashboard } from '@/api/data-collect/dashboard';
import { getTimeByType, pointParams, pointOptionsSeries } from '../tool.ts';
import * as echarts from 'echarts';
import { Dayjs } from 'dayjs';

const chartRef = ref<Record<string, any>>({});
const loading = ref(false);
const data = ref({
    time: {
        type: 'hour',
        end: 0,
        start: 0,
    },
});

const pickerTimeChange = (
    value: [Dayjs, Dayjs],
    dateString: [string, string],
) => {
    data.value.time.start = Date.parse(dateString[0]);
    data.value.time.end = Date.parse(dateString[1]);
    data.value.time.type = undefined;
};

const getEcharts = async (val) => {
    loading.value = true;
    const resp = await dashboard(pointParams(val));
    if (resp.success) {
        const x = resp.result
            .map((item: any) => item.data.timeString)
            .reverse();
        const y = resp.result.map((item: any) => item.data.value).reverse();
        handleOptions(x, y);
    }
    setTimeout(() => {
        loading.value = false;
    }, 300);
};

const handleOptions = (x = [], y = []) => {
    const chart = chartRef.value;
    if (chart) {
        const myChart = echarts.init(chart);
        const options = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x,
            },
            yAxis: {
                type: 'value',
            },
            grid: {
                left: '80px',
                right: '50px',
            },
            tooltip: {
                trigger: 'axis',
            },
            color: ['#979AFF'],
            series: [
                {
                    name: '消息量',
                    data: y,
                    ...pointOptionsSeries,
                },
            ],
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
        data.value.time.end = Date.parse(new Date());
        data.value.time.start = Date.parse(getTimeByType(value));
    },
    { immediate: true, deep: true },
);
watch(
    () => data.value,
    (value) => {
        const { time } = value;
        if (time.type || (time.end && time.start)) {
            getEcharts(value);
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
    margin-top: 24px;
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
.empty {
    height: 300px;
}
</style>
