<template>
    <div class="device-home-container">
        <j-row :gutter="10">
            <j-col :span="14">
                <BootCard :cardData="opsBootConfig" cardTitle="运维引导" />
            </j-col>
            <j-col :span="10">
                <BasicCountCard />
            </j-col>
        </j-row>
        <j-row>
            <PlatformPicCard />
        </j-row>
        <j-row>
            <StepCard
                cardTitle="运维管理推荐步骤"
                tooltip="请根据业务需要对下述步骤进行选择性操作。"
                :dataList="opsStepDetails"
            />
        </j-row>
    </div>
</template>

<script setup lang="ts" name="devOpsHome">
import BootCard from '../BootCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import type { bootConfig, recommendList } from '../../typing';
const opsBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '设备接入配置',
        link: 'link/AccessConfig',
    },
    {
        english: 'STEP2',
        label: '日志排查',
        link: 'Log',
        params: {
            tab: 'system',
        },
    },
    {
        english: 'STEP3',
        label: '实时监控',
        link: 'link/DashBoard',
        params: {
            type: 'add',
        },
    },
];
const opsStepDetails: recommendList[] = [
    {
        title: '协议管理',
        details:
            '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: 'link/Protocol',
    },
    {
        title: '证书管理',
        details: '统一维护平台内的证书，用于数据通信加密。',
        iconUrl: '/images/home/bottom-6.png',
        linkUrl: 'link/Certificate',
    },
    {
        title: '网络组件',
        details: '根据不同的传输类型配置平台底层网络组件相关参数。',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: 'link/Type',
    },
    {
        title: '设备接入网关',
        details: '根据不同的传输类型，关联消息协议，配置设备接入网关相关参数。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: 'link/AccessConfig',
    },
    {
        title: '日志管理',
        details: '监控系统日志，及时处理系统异常。',
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: 'Log',
        params: {
            tab: 'system',
        },
    },
];
</script>

<style lang="less" scoped>
.device-home-container {
    .ant-row {
        margin-bottom: 24px;
    }
}
</style>
