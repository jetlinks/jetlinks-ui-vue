<template>
    <div class="device-home-container">
        <a-row :gutter="24">
            <a-col :span="14">
                <BootCard :cardData="deviceBootConfig" cardTitle="物联网引导" />
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
                :dataList="deviceStepDetails"
            />
        </a-row>
    </div> 
</template>

<script setup lang="ts" name="deviceHome">
import BootCard from '../BootCard.vue';
import DeviceCountCard from '../DeviceCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import { usePermissionStore } from '@/store/permission';
import { bootConfig, recommendList } from '../../typing';

// 按钮权限控制
const hasPermission = usePermissionStore().hasPermission;
const productPermission = (action: string) =>
    hasPermission(`device/Product:${action}`);
const devicePermission = (action: string) =>
    hasPermission(`device/Instance:${action}`);
const rulePermission = (action: string) =>
    hasPermission(`rule-engine/Instance:${action}`);

const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '创建产品',
        link: 'device/Product',
        auth: productPermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        english: 'STEP2',
        label: '创建设备',
        link: 'device/Instance',
        auth: devicePermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        english: 'STEP3',
        label: '规则引擎',
        link: 'rule-engine/Instance',
        auth: rulePermission('add'),
        params: {
            type: 'add',
        },
    },
];
const deviceStepDetails: recommendList[] = [
    {
        title: '创建产品',
        details:
            '产品是设备的集合，通常指一组具有相同功能的设备。物联设备必须通过产品进行接入方式配置。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: 'iot/device/Product',
        auth: productPermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        title: '配置产品接入方式',
        details:
            '通过产品对同一类型的设备进行统一的接入方式配置。请参照设备铭牌说明选择匹配的接入方式。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: 'iot/device/Product/detail',
        auth: productPermission('update'),
        dialogTag: 'accessMethod',
    },
    {
        title: '添加测试设备',
        details: '添加单个设备，用于验证产品模型是否配置正确。',
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: 'iot/device/Instance',
        auth: devicePermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        title: '功能调试',
        details:
            '对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确。',
        iconUrl: '/images/home/bottom-2.png',
        linkUrl: 'iot/device/Instance/detail',
        // auth: devicePermission('update'),
        auth: true,
        dialogTag: 'funcTest',
    },
    {
        title: '批量添加设备',
        details: '批量添加同一产品下的设备',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: 'iot/device/Instance',
        auth: devicePermission('import'),
        params: {
            import: true,
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
