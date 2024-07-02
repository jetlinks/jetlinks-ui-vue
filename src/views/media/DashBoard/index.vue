<template>
    <page-container>
        <j-row :gutter="24">
            <j-col :span="6">
                <TopCard
                    title="设备数量"
                    :img="getImage('/media/dashboard-1.png')"
                    :footer="deviceFooter"
                    :value="deviceTotal"
                />
            </j-col>
            <j-col :span="6">
                <TopCard
                    title="通道数量"
                    :img="getImage('/media/dashboard-2.png')"
                    :footer="channelFooter"
                    :value="channelTotal"
                />
            </j-col>
            <j-col :span="6">
                <TopCard
                    title="录像数量"
                    :img="getImage('/media/dashboard-3.png')"
                    :footer="aggFooter"
                    :value="aggTotal"
                />
            </j-col>
            <j-col :span="6">
                <TopCard
                    title="播放中数量"
                    tooltip="当前正在播放的通道数量之和"
                    :img="getImage('/media/dashboard-4.png')"
                    :footer="aggPlayingFooter"
                    :value="aggPlayingTotal"
                />
            </j-col>
            <j-col :span="24" class="dash-board-bottom">
                <full-page>
                    <Card
                        title="播放数量(人次)"
                        :chartData="chartData"
                        @change="getPlayCount"
                    />
                </full-page>
            </j-col>
        </j-row>
    </page-container>
</template>

<script setup lang="ts">
import TopCard from '@/views/media/DashBoard/components/TopCard.vue';
import Card from '@/views/media/DashBoard/components/Card.vue';
import { getImage } from '@/utils/comm';
import homeApi from '@/api/media/home';
import dashboardApi from '@/api/media/dashboard';
import type { Footer } from '@/views/media/DashBoard/typings';
import encodeQuery from '@/utils/encodeQuery';
import { timestampFormat } from '@/utils/utils';
import moment from 'moment';

// 设备
const deviceFooter = ref<Footer[]>([]);
const deviceTotal = ref(0);
const getDeviceData = () => {
    homeApi.deviceCount({}).then((res) => {
        deviceTotal.value = res.result;
    });

    homeApi
        .deviceCount(encodeQuery({ terms: { state: 'online' } }))
        .then((res) => {
            deviceFooter.value[0] = {
                title: '在线',
                value: res.result,
                status: 'success',
            };
        });
    homeApi
        .deviceCount(encodeQuery({ terms: { state: 'offline' } }))
        .then((res) => {
            deviceFooter.value[1] = {
                title: '离线',
                value: res.result,
                status: 'error',
            };
        });
};
getDeviceData();

// 通道
const channelFooter = ref<Footer[]>([]);
const channelTotal = ref(0);
const getChannelData = () => {
    homeApi.channelCount({}).then((res) => {
        channelTotal.value = res.result;
    });
    homeApi
        .channelCount({ terms: [{ column: 'status', value: 'online' }] })
        .then((res) => {
            channelFooter.value[0] = {
                title: '在线',
                value: res.result,
                status: 'success',
            };
        });
    homeApi
        .channelCount({ terms: [{ column: 'status$not', value: 'online' }] })
        .then((res) => {
            channelFooter.value[1] = {
                title: '离线',
                value: res.result,
                status: 'error',
            };
        });
};
getChannelData();

// 录像
const aggFooter = ref<Footer[]>([]);
const aggTotal = ref(0);
const getAggData = () => {
    dashboardApi.agg().then((res) => {
        aggTotal.value = res.result.total;
        aggFooter.value = [
            {
                title: '总时长',
                value: timestampFormat(res.result.duration),
                status: '',
            },
        ];
    });
};
getAggData();

// 播放中
const aggPlayingFooter = ref<Footer[]>([]);
const aggPlayingTotal = ref(0);
const getAggPlayingData = () => {
    dashboardApi.aggPlaying().then((res) => {
        aggPlayingTotal.value = res.result.playingTotal;
        aggPlayingFooter.value = [
            {
                title: '播放人数',
                value: res.result.playerTotal,
                status: '',
            },
        ];
    });
};
getAggPlayingData();

/**
 * 获取播放数量(人次)
 */
const chartData = ref([]);
const getPlayCount = async (params: any) => {
    let _time = '1h';
    let _limit = 12;
    const dt = params.time.end - params.time.start;
    const hour = 60 * 60 * 1000;
    const day = hour * 24;
    const month = day * 30;
    const year = 365 * day;
    if (dt <= day) {
        _limit = Math.abs(Math.ceil(dt / hour));
    } else if (dt > day && dt < year) {
        _limit = Math.abs(Math.ceil(dt / day));
        _time = '1d';
    } else if (dt >= year) {
        _limit = Math.abs(Math.floor(dt / month));
        _time = '1M';
    }
    dashboardApi
        .getPlayCount([
            {
                dashboard: 'media_stream',
                object: 'play_count',
                measurement: 'quantity',
                dimension: 'agg',
                group: 'playCount',
                params: {
                    format: dt > year ? 'YYYY年-MM月': '',
                    time: _time,
                    from: moment(Number(params.time.start)).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
                    to: moment(Number(params.time.end)).format(
                        'YYYY-MM-DD HH:mm:ss',
                    ),
                    limit: _limit,
                },
            },
        ])
        .then((res) => {
            let result: any = [];
            res.result
                .sort((a: any, b: any) => b.data.timestamp - a.data.timestamp)
                .forEach((item: any) => {
                    result.push({ group: item.group, ...item.data });
                });
            chartData.value = result.map((m: any) => ({
                x: m.timeString,
                value: m.value,
            }));
        });
};
</script>

<style lang="less" scoped>
.dash-board-bottom {
    margin-top: 24px;
}
</style>
