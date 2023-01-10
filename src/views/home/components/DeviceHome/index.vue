<template>
    <div class="device-home-container">
        <a-row :gutter="10">
            <a-col :span="14">
                <BootCard :cardData="bootConfig" cardTitle="物联网引导" />
            </a-col>
            <a-col :span="10">
                <DeviceCountCard />
            </a-col>
        </a-row>
        <a-row>
            <PlatformPicCard />
        </a-row>
        <a-row>
            <StepCard
                cardTitle="设备接入推荐步骤"
                tooltip="不同的设备因为通信协议的不同，存在接入步骤的差异"
                :dataList="stepDetails"
            />
        </a-row>
    </div>
</template>

<script setup lang="ts" name="deviceHome">
import BootCard from '../BootCard.vue';
import DeviceCountCard from '../DeviceCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import {recommendList} from '../../index'

// import {getImage} from '@/utils/comm'

// 物联网引导-数据
const bootConfig = [
    {
        english: 'STEP1',
        label: '创建产品',
        link: '/a',
        auth: true,
        params: {},
    },
    {
        english: 'STEP2',
        label: '创建设备',
        link: '/b',
        auth: true,
        params: {},
    },
    {
        english: 'STEP3',
        label: '规则引擎',
        link: '/c',
        auth: false,
        params: {},
    },
];
// 设备接入推荐步骤-数据
const stepDetails = [
    {
        title: '协议管理',
        details:
            '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '证书管理',
        details: '统一维护平台内的证书，用于数据通信加密。',
        iconUrl: '/images/home/bottom-6.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '网络组件',
        details: '根据不同的传输类型配置平台底层网络组件相关参数。',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '设备接入网关',
        details: '根据不同的传输类型，关联消息协议，配置设备接入网关相关参数。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '日志管理',
        details: '监控系统日志，及时处理系统异常。',
        iconUrl: '/images/home/bottom-5.png',
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
