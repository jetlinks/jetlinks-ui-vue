<template>
    <div class="page-container">
        <a-row :gutter="24">
            <a-col :span="6">
                <TopCard
                    title="设备数量"
                    :img="getImage('/media/dashboard-1.png')"
                    :footer="deviceFooter"
                    :value="deviceTotal"
                />
            </a-col>
            <a-col :span="6">
                <TopCard
                    title="通道数量"
                    :img="getImage('/media/dashboard-2.png')"
                    :footer="channelFooter"
                    :value="channelTotal"
                />
            </a-col>
            <a-col :span="6">
                <TopCard
                    title="录像数量"
                    :img="getImage('/media/dashboard-3.png')"
                    :footer="aggFooter"
                    :value="aggTotal"
                />
            </a-col>
            <a-col :span="6">
                <TopCard
                    title="播放中数量"
                    tooltip="当前正在播放的通道数量之和"
                    :img="getImage('/media/dashboard-4.png')"
                    :footer="aggPlayingFooter"
                    :value="aggPlayingTotal"
                />
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import TopCard from '@/views/media/DashBoard/components/TopCard.vue'
import { getImage } from '@/utils/comm';
import homeApi from '@/api/media/home';
import dashboardApi from '@/api/media/dashboard';
import type { Footer } from '@/views/media/DashBoard/typings';

// 设备
const deviceFooter = ref<Footer[]>([]);
const deviceTotal = ref(0);
const getDeviceData = () => {
    homeApi.deviceCount().then((res) => {
        deviceTotal.value = res.result;
    });
};
getDeviceData();

// 通道
const channelFooter = ref<Footer[]>([]);
const channelTotal = ref(0);
const getChannelData = () => {
    homeApi.channelCount().then((res) => {
        channelTotal.value = res.result;
    });
};
getChannelData();

// 录像
const aggFooter = ref<Footer[]>([]);
const aggTotal = ref(0);
const getAggData = () => {
    dashboardApi.agg().then((res) => {
        aggTotal.value = res.result.total;
    });
};
getAggData();

// 播放中
const aggPlayingFooter = ref<Footer[]>([]);
const aggPlayingTotal = ref(0);
const getAggPlayingData = () => {
    dashboardApi.aggPlaying().then((res) => {
        aggTotal.value = res.result.playingTotal;
    });
};
getAggPlayingData();
</script>

<style lang="less" scoped>
.page-container {
    padding: 24px;
}
</style>
