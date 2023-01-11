<template>
    <div class="comprehensive-home-conatiner">
        <a-row :gutter="24" class="top" style="margin-bottom: 24px">
            <a-col :span="6" class="left">
                <BootCardSmall
                    :cardData="devBootConfig"
                    cardTitle="物联网引导"
                />
                <div style="width: 100%; height: 24px"></div>
                <BootCardSmall :cardData="opsBootConfig" cardTitle="运维引导" />
            </a-col>
            <a-col :span="18" class="right">
                <a-row :gutter="24">
                    <a-col :span="12"><DeviceCountCard /></a-col>
                    <a-col :span="12"><BasicCountCard /></a-col>
                    <a-col :span="24" style="margin-top: 24px">
                        <PlatformPicCard image="/images/home/content1.png" />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>

        <StepCard
            cardTitle="设备接入推荐步骤"
            tooltip="不同的设备因为通信协议的不同，存在接入步骤的差异"
            :dataList="devStepDetails"
            style="margin-bottom: 24px"
        />
        <StepCard
            cardTitle="运维管理推荐步骤"
            tooltip="请根据业务需要对下述步骤进行选择性操作。"
            :dataList="opsStepDetails"
        />
    </div>
</template>

<script setup lang="ts" name="ComprehensiveHome">
import BootCardSmall from '../BootCardSmall.vue';
import DeviceCountCard from '../DeviceCountCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import { recommendList } from '../../index';

import StepCard from '../StepCard.vue';

// 物联网引导-数据
const devBootConfig = [
    {
        english: 'STEP1',
        label: '创建产品',
        link: '/a',
        auth: true,
        save: true,
        image: '/images/home/guide-home1.png',
    },
    {
        english: 'STEP2',
        label: '创建设备',
        link: '/b',
        auth: true,
        save: true,
        image: '/images/home/guide-home2.png',
    },
    {
        english: 'STEP3',
        label: '规则引擎',
        link: '/c',
        auth: false,
        save: true,
        image: '/images/home/guide-home3.png',
    },
];
// 运维管理引导-数据
const opsBootConfig = [
    {
        english: 'STEP1',
        label: '创建产品',
        link: '/a',
        auth: true,
        save: true,
        image: '/images/home/guide-home4.png',
    },
    {
        english: 'STEP2',
        label: '创建设备',
        link: '/b',
        auth: true,
        save: true,
        image: '/images/home/guide-home5.png',
    },
    {
        english: 'STEP3',
        label: '规则引擎',
        link: '/c',
        auth: false,
        save: true,
        image: '/images/home/guide-home6.png',
    },
];
// 设备接入推荐步骤-数据
const devStepDetails = [
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
        dialogTag: 'accessMethod',
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
        dialogTag: 'funcTest',
    },
    {
        title: '批量添加设备',
        details: '批量添加同一产品下的设备',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: '/a',
        auth: false,
    },
] as recommendList[];
// 运维管理推荐步骤-数据
const opsStepDetails = [
    {
        title: '协议管理',
        details:
            '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: '/a',
        auth: true,
        params: {
            a: 1,
            save: true,
        },
    },
    {
        title: '证书管理',
        details: '统一维护平台内的证书，用于数据通信加密。',
        iconUrl: '/images/home/bottom-6.png',
        linkUrl: '/a',
        auth: true,
        params: {
            a: 1,
            save: false,
        },
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
