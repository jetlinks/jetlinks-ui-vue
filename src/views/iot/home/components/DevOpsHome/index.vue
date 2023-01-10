<template>
    <div class="device-home-container">
        <a-row :gutter="10">
            <a-col :span="14">
                <BootCard :cardData="bootConfig" cardTitle="运维引导" />
            </a-col>
            <a-col :span="10">
                <BasicCountCard />
            </a-col>
        </a-row>
        <a-row>
            <PlatformPicCard />
        </a-row>
        <a-row>
            <StepCard
                cardTitle="运维管理推荐步骤"
                tooltip="请根据业务需要对下述步骤进行选择性操作。"
                :dataList="stepDetails"
            />
        </a-row>
    </div>
</template>

<script setup lang="ts" name="devOpsHome">
import BootCard from '../BootCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import {recommendList} from '../../index'
// import {getImage} from '@/utils/comm'

// 运维引导-数据
const bootConfig = [
    {
        english: 'STEP1',
        label: '设备接入配置',
        link: '/a',
        auth: true,
        save: true,
    },
    {
        english: 'STEP2',
        label: '日志排查',
        link: '/b',
        auth: true,
        save: true,
    },
    {
        english: 'STEP3',
        label: '实时监控',
        link: '/c',
        auth: false,
        save: true,
    },
];
// 运维管理推荐步骤-数据
const stepDetails = [
    {
        title: '创建产品',
        details:
            '产品是设备的集合，通常指一组具有相同功能的设备。物联设备必须通过产品进行接入方式配置。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '配置产品接入方式',
        details:
            '通过产品对同一类型的设备进行统一的接入方式配置。请参照设备铭牌说明选择匹配的接入方式。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '添加测试设备',
        details: '添加单个设备，用于验证产品模型是否配置正确。',
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '功能调试',
        details:
            '对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确。',
        iconUrl: '/images/home/bottom-2.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '批量添加设备',
        details: '批量添加同一产品下的设备',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: '/a',
        auth: false,
    },
] as recommendList[];
</script>

<style lang="less" scoped>
.device-home-container {
    .ant-row {
        margin-bottom: 24px;
    }
}
</style>
