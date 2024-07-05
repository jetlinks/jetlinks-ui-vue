<template>
    <page-container>
        <div class="run-warp">
            <div class="run-container">
                <div class="left">
                    <LeftTree @change="(id) => (vehicleId = id)" />
                </div>
                <div class="right">数据</div>
            </div>
            <div class="run-chart">
                <div class="message-card">
                    <TimeSelect
                        key="flow-static"
                        :quickBtnList="[
                            { label: '今日', value: 'day' },
                            { label: '本周', value: 'week' },
                            { label: '本月', value: 'month' },
                            { label: '全年', value: 'year' },
                        ]"
                        :type="'week'"
                        @change="getEcharts"
                    />
                    <div class="message-chart">
                        <Charts :options="options"></Charts>
                    </div>
                </div>
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import LeftTree from './LeftTree/index.vue';
import TimeSelect from './components/TimeSelect.vue';
import Charts from './components/Charts.vue';

const vehicleId = ref('');
const options = ref<any>({});

const setChartOption = (
    x: Array<any>,
    y: Array<number>,
    yh: Array<number>,
    maxY: number,
): void => {
    const yLen = String(Math.ceil(maxY)).length;
    options.value = {
        xAxis: {
            type: 'category',
            axisTick: {
                alignWithLabel: true,
            },
            data: x,
        },
        yAxis: [
            {
                type: 'value',
                name: '温度',
                position: 'left',
                alignTicks: true,
                axisLabel: {
                    formatter: '{value} °C',
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#F96F45',
                    },
                },
            },
            {
                type: 'value',
                name: '湿度',
                position: 'right',
                alignTicks: true,
                axisLabel: {
                    formatter: '{value} %',
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#00cec9',
                    },
                },
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '2%',
            bottom: '6%',
            left:
                maxY < 900000
                    ? '60px'
                    : yLen * 7.5 + Math.floor(yLen / 3) * 1.2 + 10 + 'px',
            right: '50px',
        },
        series: [
            {
                name: '温度',
                data: y,
                type: 'line',
                yAxisIndex: 0,
                // smooth: true,
                // symbolSize: 0, // 拐点大小
                color: '#F96F45',
            },
            {
                name: '湿度',
                data: yh,
                type: 'line',
                yAxisIndex: 1,
                // smooth: true, //是否曲线
                // symbolSize: 0, // 拐点大小
                color: '#00cec9',
            },
        ],
    };
};

const getEcharts = (data: any) => {
    let _time = '1m';
    let format = 'M月dd日 HH:mm';
    let limit = 12;
    const dt = data.end - data.start;
    const hour = 60 * 60 * 1000;
    const days = hour * 24;
    const months = days * 30;
    const year = 365 * days;
    if (dt <= hour + 10) {
        limit = 60;
        format = 'HH:mm';
    } else if (dt > hour && dt <= days) {
        _time = '1h';
        limit = 24;
    } else if (dt > days && dt < year) {
        limit = Math.abs(Math.ceil(dt / days)) + 1;
        _time = '1d';
        format = 'M月dd日 HH:mm:ss';
    } else if (dt >= year) {
        limit = Math.abs(Math.floor(dt / months));
        _time = '1M';
        format = 'yyyy年-M月';
    }

    const result = [
        {
            value: 45,
            timeString: '7月05日 00:00:00',
            timestamp: 0,
            humidity: 49,
        },
        {
            value: 41,
            timeString: '7月04日 00:00:00',
            timestamp: 1,
            humidity: 78,
        },
        {
            value: 32,
            timeString: '7月03日 00:00:00',
            timestamp: 2,
            humidity: 90,
        },
        {
            value: 44,
            timeString: '7月02日 00:00:00',
            timestamp: 3,
            humidity: 48,
        },
        {
            value: 65,
            timeString: '7月01日 00:00:00',
            timestamp: 4,
            humidity: 31,
        },
        {
            value: 57,
            timeString: '6月30日 00:00:00',
            timestamp: 5,
            humidity: 43,
        },
        {
            value: 62,
            timeString: '6月29日 00:00:00',
            timestamp: 6,
            humidity: 32,
        },
    ];

    const x = result
        .map((item: any) =>
            _time === '1h' ? `${item.timeString}时` : item.timeString,
        )
        .reverse();
    const y = result.map((item: any) => item.value).reverse();
    const yh = result.map((item: any) => item.humidity).reverse();
    const maxY = Math.max.apply(null, y.length ? y : [0]);

    setChartOption(x, y, yh, maxY);
};
</script>

<style lang="less" scoped>
.run-warp {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 24px;

    .run-container {
        height: 350px;
        display: flex;
        flex-direction: row;

        .left {
            height: 100%;
            width: 300px;
            padding: 10px 0 8px 10px;
            border: 1px solid #f0f0f0;
        }

        .right {
            width: calc(100% - 316px);
            margin-left: 16px;
            border: 1px solid #f0f0f0;
        }
    }

    .run-chart {
        height: 360px;
        margin-top: 20px;
    }
}

.message-card {
    padding: 10px 10px 0 10px;
    background-color: white;

    .message-chart {
        width: 100%;
        height: 310px;
    }
}
</style>
