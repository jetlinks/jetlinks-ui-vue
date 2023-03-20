<template>
    <page-container>
        <div class="DashBoardBox">
            <j-row :gutter="24">
                <j-col :span="6">
                    <TopCard
                        title="产品数量"
                        :img="getImage('/device/device-product.png')"
                        :footer="productFooter"
                        :value="productTotal"
                    ></TopCard>
                </j-col>
                <j-col :span="6">
                    <TopCard
                        title="设备数量"
                        :img="getImage('/device/device-number.png')"
                        :footer="deviceFooter"
                        :value="deviceTotal"
                    ></TopCard
                ></j-col>
                <j-col :span="6"
                    ><TopCard
                        title="当前在线"
                        :footer="onlineFooter"
                        :value="deviceOnline"
                    >
                        <Charts :options="onlineOptions"></Charts> </TopCard
                ></j-col>
                <j-col :span="6"
                    ><TopCard
                        title="今日设备信息量"
                        :footer="messageFooter"
                        :value="dayMessage"
                    >
                        <Charts :options="TodayDevOptions"></Charts> </TopCard
                ></j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="24">
                    <div class="message-card">
                        <Guide title="设备消息">
                            <template #extra>
                                <TimeSelect
                                    key="flow-static"
                                    :type="'week'"
                                    :quickBtnList="quickBtnList"
                                    @change="getEcharts"
                                />
                            </template>
                        </Guide>
                        <div class="message-chart">
                            <Charts :options="devMegOptions"></Charts>
                        </div>
                    </div>
                </j-col>
            </j-row>
            <j-row :span="24" v-if="AmapKey">
                <j-col :span="24">
                    <div class="device-position">
                        <Guide title="设备分布"></Guide>
                        <div class="device-map" >
                            <Amap></Amap>
                        </div>
                    </div>
                </j-col>
            </j-row>
        </div>
    </page-container>
</template>
<script lang="ts" setup>
import TimeSelect from './components/TimeSelect.vue';
import Charts from './components/Charts.vue';
import Guide from './components/Guide.vue';
import {
    productCount,
    deviceCount,
    dashboard,
    getGo,
} from '@/api/device/dashboard';
import encodeQuery from '@/utils/encodeQuery';
import { getImage } from '@/utils/comm';
import type { Footer } from '@/views/device/DashBoard/typings';
import TopCard from '@/views/device/DashBoard/components/TopCard.vue';
import { useMenuStore } from '@/store/menu';
import Amap from './components/Amap.vue';
let AmapKey = localStorage.getItem('amap_key');
let productTotal = ref(0);
let productFooter = ref<Footer[]>([
    {
        title: '正常',
        value: 0,
        status: 'success',
    },
    {
        title: '禁用',
        value: 0,
        status: 'error',
    },
]);
let deviceTotal = ref(0);
let deviceFooter = ref<Footer[]>([
    {
        title: '在线',
        value: 0,
        status: 'success',
    },
    {
        title: '离线',
        value: 0,
        status: 'error',
    },
]);
let deviceOnline = ref(0);
let onlineFooter = ref<Footer[]>([
    {
        title: '昨日在线',
        value: 0,
    },
]);
let dayMessage = ref(0);
let messageFooter = ref<Footer[]>([
    {
        title: '当月设备消息量',
        value: 0,
    },
]);
let messageChartXData = ref<any[]>([]);
let messageChartYData = ref<any[]>([]);
let messageMaxChartYData = ref<number>();
let onlineOptions = ref<any>({});
let TodayDevOptions = ref<any>({});
let devMegOptions = ref<any>({});
const menuStore = useMenuStore();
const quickBtnList = [
    { label: '昨日', value: 'yesterday' },
    { label: '近一周', value: 'week' },
    { label: '近一月', value: 'month' },
    { label: '近一年', value: 'year' },
];
/**
 * 获取产品数量
 */
const getProductData = () => {
    if (menuStore.hasMenu('device/Product')) {
        productCount().then((res) => {
            if (res.status == 200) {
                productTotal.value = res.result;
            }
        });
        productCount({
            terms: [
                {
                    column: 'state',
                    value: '1',
                },
            ],
        }).then((res) => {
            if (res.status == 200) {
                productFooter.value[0].value = res.result;
            }
        });
        productCount({
            terms: [
                {
                    column: 'state',
                    value: '0',
                },
            ],
        }).then((res) => {
            if (res.status == 200) {
                productFooter.value[1].value = res.result;
            }
        });
    }
};
getProductData();
/**
 * 获取设备数量
 */
const getDeviceData = () => {
    if (menuStore.hasMenu('device/Instance')) {
        deviceCount().then((res) => {
            if (res.status == 200) {
                deviceTotal.value = res.result;
            }
        });
        deviceCount(encodeQuery({ terms: { state: 'online' } })).then((res) => {
            if (res.status == 200) {
                deviceFooter.value[0].value = res.result;
                deviceOnline.value = res.result;
            }
        });
        deviceCount(encodeQuery({ terms: { state: 'offline' } })).then(
            (res) => {
                if (res.status == 200) {
                    deviceFooter.value[1].value = res.result;
                }
            },
        );
    }
};
getDeviceData();
/**
 * 获取在线数量
 */
const getOnline = () => {
    dashboard([
        {
            dashboard: 'device',
            object: 'session',
            measurement: 'online',
            dimension: 'agg',
            group: 'aggOnline',
            params: {
                state: 'online',
                limit: 15,
                from: 'now-15d',
                time: '1d',
                format: 'yyyy-MM-dd',
            },
        },
    ]).then((res) => {
        if (res.status == 200) {
            const x = res.result
                .map((item: any) => item.data.timeString)
                .reverse();
            const y = res.result.map((item: any) => item.data.value);
            const onlineYdata = y;
            onlineYdata.reverse();
            setOnlineChartOpition(x, onlineYdata);
            onlineFooter.value[0].value = y?.[1];
        }
    });
};
const setOnlineChartOpition = (x: Array<any>, y: Array<number>): void => {
    onlineOptions.value = {
        xAxis: {
            type: 'category',
            data: x,
            show: false,
        },
        yAxis: {
            type: 'value',
            show: false,
        },
        grid: {
            top: '5%',
            bottom: 0,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        series: [
            {
                name: '在线数',
                data: y,
                type: 'bar',
                showBackground: true,
                itemStyle: {
                    color: '#D3ADF7',
                },
            },
        ],
    };
};
const setTodayDevChartOption = (x: Array<any>, y: Array<number>): void => {
    TodayDevOptions = {
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
            data: x,
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
                data: y,
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
};
const setDevMesChartOption = (
    x: Array<any>,
    y: Array<number>,
    maxY: number,
): void => {
    devMegOptions.value = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x,
        },
        yAxis: {
            type: 'value',
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}',
            // formatter: '{b0}<br />{a0}: {c0}<br />{a1}: {c1}%'
        },
        grid: {
            top: '2%',
            bottom: '5%',
            left: maxY > 100000 ? '90px' : '60px',
            right: '50px',
        },
        series: [
            {
                name: '消息量',
                data: y,
                type: 'bar',
                // type: 'line',
                // smooth: true,
                color: '#597EF7',
                barWidth: '30%',
                // areaStyle: {
                //   color: {
                //     type: 'linear',
                //     x: 0,
                //     y: 0,
                //     x2: 0,
                //     y2: 1,
                //     colorStops: [
                //       {
                //         offset: 0,
                //         color: '#685DEB', // 100% 处的颜色
                //       },
                //       {
                //         offset: 1,
                //         color: '#FFFFFF', //   0% 处的颜色
                //       },
                //     ],
                //     global: false, // 缺省为 false
                //   },
                // },
            },
            {
                name: '占比',
                data: y,
                // data: percentageY,
                type: 'line',
                smooth: true,
                symbolSize: 0, // 拐点大小
                color: '#96ECE3',
            },
        ],
    };
};
getOnline();
//今日设备消息量
const getDevice = () => {
    dashboard([
        {
            dashboard: 'device',
            object: 'message',
            measurement: 'quantity',
            dimension: 'agg',
            group: 'today',
            params: {
                time: '1h',
                format: 'yyyy-MM-dd HH:mm:ss',
                limit: 24,
                from: 'now-1d',
            },
        },
        {
            dashboard: 'device',
            object: 'message',
            measurement: 'quantity',
            dimension: 'agg',
            group: 'oneday',
            params: {
                time: '1d',
                format: 'yyyy-MM-dd',
                from: 'now-1d',
            },
        },
        {
            dashboard: 'device',
            object: 'message',
            measurement: 'quantity',
            dimension: 'agg',
            group: 'thisMonth',
            params: {
                time: '1M',
                format: 'yyyy-MM',
                limit: 1,
                from: 'now-1M',
            },
        },
    ]).then((res) => {
        if (res.status == 200) {
            const thisMonth = res.result.find(
                (item: any) => item.group === 'thisMonth',
            )?.data.value;
            const oneDay = res.result.find(
                (item: any) => item.group === 'oneday',
            )?.data.value;
            dayMessage.value = oneDay;
            messageFooter.value[0].value = thisMonth;
            const today = res.result.filter(
                (item: any) => item.group === 'today',
            );
            const x = today.map((item: any) => item.data.timeString).reverse();
            const y = today.map((item: any) => item.data.value).reverse();
            setTodayDevChartOption(x, y);
        }
    });
};
getDevice();
const getEcharts = (data: any) => {
    let _time = '1h';
    let format = 'HH';
    let limit = 12;
    const dt = data.end - data.start;
    const hour = 60 * 60 * 1000;
    const days = hour * 24;
    const months = days * 30;
    const year = 365 * days;
    if (dt <= days) {
        limit = Math.abs(Math.ceil(dt / hour));
    } else if (dt > days && dt < year) {
        limit = Math.abs(Math.ceil(dt / days)) + 1;
        _time = '1d';
        format = 'M月dd日';
    } else if (dt >= year) {
        limit = Math.abs(Math.floor(dt / months));
        _time = '1M';
        format = 'yyyy年-M月';
    }

    dashboard([
        {
            dashboard: 'device',
            object: 'message',
            measurement: 'quantity',
            dimension: 'agg',
            group: 'device_msg',
            params: {
                time: _time,
                format: format,
                limit: limit,
                from: data.start,
                to: data.end,
            },
        },
    ]).then((res: any) => {
        if (res.status === 200) {
            const x = res.result
                .map((item: any) =>
                    _time === '1h'
                        ? `${item.data.timeString}时`
                        : item.data.timeString,
                )
                .reverse();
            const y = res.result.map((item: any) => item.data.value).reverse();
            const maxY = Math.max.apply(
                null,
                messageChartYData.value.length ? messageChartYData.value : [0],
            );
            setDevMesChartOption(x, y, maxY);
        }
    });
};
</script>
<style lang="less" scoped>
.message-card,
.device-position {
    margin-top: 24px;
    padding: 24px;
    background-color: white;
}
.message-chart {
    width: 100%;
    height: 400px;
}
.amap-box {
    height: 500px;
    width: 100%;
}
</style>