<template>
    <page-container>
        <div class="DashBoardBox">
            <a-row :gutter="24">
                <a-col :span="6">
                    <TopCard
                        title="产品数量"
                        :img="getImage('/device/device-product.png')"
                        :footer="productFooter"
                        :value="productTotal"
                    ></TopCard>
                </a-col>
                <a-col :span="6">
                    <TopCard
                        title="设备数量"
                        :img="getImage('/device/device-number.png')"
                        :footer="deviceFooter"
                        :value="deviceTotal"
                    ></TopCard
                ></a-col>
                <a-col :span="6"
                    ><TopCard
                        title="当前在线"
                        :footer="onlineFooter"
                        :value="onlineToday"
                    >
                        <BarChart :chartXData="barChartXData" :chartYData="barChartYData"></BarChart> </TopCard
                ></a-col>
                <a-col :span="6"
                    ><TopCard
                        title="今日设备信息量"
                        :footer="messageFooter"
                        :value="dayMessage"
                    >
                        <LineChart :chartXData="lineChartXData" :chartYData="lineChartYData"></LineChart> </TopCard
                ></a-col>
            </a-row>
        </div>
    </page-container>
</template>
<script lang="ts" setup>
import BarChart from './components/BarChart.vue';
import LineChart from './components/LineChart.vue';
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
let lineChartYData = ref<any[]>([]);
let lineChartXData = ref<any[]>([]);
let barChartXData = ref<any[]>([]);
let barChartYData = ref<any[]>([]);
const getProductData = () => {
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
};
getProductData();
const getDeviceData = () => {
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
    deviceCount(encodeQuery({ terms: { state: 'offline' } })).then((res) => {
        if (res.status == 200) {
            deviceFooter.value[1].value = res.result;
        }
    });
};
getDeviceData();
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
            barChartXData.value = x;
            const y = res.result.map((item: any) => item.data.value);
            barChartYData.value = y;
            deviceFooter.value[0].value = y?.[1];
        }
    });
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
            dayMessage = oneDay;
            messageFooter.value[0].value = thisMonth;
            const today = res.result.filter(
                (item: any) => item.group === 'today',
            );
            const x = today.map((item: any) => item.data.timeString).reverse();
            const y = today.map((item: any) => item.data.value).reverse();
            lineChartXData.value = x ;
            lineChartYData.value = y ;
        }
    });
};
getDevice();
</script>
<style lang="less" scoped>
</style>