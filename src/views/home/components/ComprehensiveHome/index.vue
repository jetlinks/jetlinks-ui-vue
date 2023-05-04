<template>
    <div class="comprehensive-home-conatiner">
        <j-row :gutter="24" class="top" style="margin-bottom: 24px">
            <j-col :span="6" class="left">
                <BootCardSmall
                    :cardData="deviceBootConfig"
                    cardTitle="物联网引导"
                />
                <div style="width: 100%; height: 24px"></div>
                <BootCardSmall :cardData="opsBootConfig" cardTitle="运维引导" />
            </j-col>
            <j-col :span="18" class="right">
                <j-row :gutter="24">
                    <j-col :span="12"><DeviceCountCard /></j-col>
                    <j-col :span="12"><BasicCountCard /></j-col>
                    <j-col :span="24" style="margin-top: 24px">
                        <PlatformPicCard image="/images/home/content.png" />
                    </j-col>
                </j-row>
            </j-col>
        </j-row>

        <StepCard
            cardTitle="设备接入推荐步骤"
            tooltip="不同的设备因为通信协议的不同，存在接入步骤的差异"
            :dataList="deviceStepDetails"
            style="margin-bottom: 24px"
        />
        <StepCard
            cardTitle="运维管理推荐步骤"
            tooltip="请根据业务需要对下述步骤进行选择性操作。"
            :dataList="opsStepDetails"
        />

        <div class="dialog">
            <ProductChooseDialog
                v-if="productDialogVisible"
                v-model:visible="productDialogVisible"
                @confirm="(id:string)=>jumpPage('device/Product/Detail', { id, tab: 'Device'})"
            />
            <DeviceChooseDialog
                v-if="deviceDialogVisible"
                v-model:visible="deviceDialogVisible"
                @confirm="(id:string)=>jumpPage('device/Instance/Detail', { id, tab: 'Diagnose' })"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="ComprehensiveHome">
import ProductChooseDialog from '../dialogs/ProductChooseDialog.vue';
import DeviceChooseDialog from '../dialogs/DeviceChooseDialog.vue';
import BootCardSmall from '../BootCardSmall.vue';
import DeviceCountCard from '../DeviceCountCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import { usePermissionStore } from '@/store/permission';
import { recommendList, bootConfig } from '../../typing';
import { useMenuStore } from '@/store/menu';

const { jumpPage } = useMenuStore();

// 按钮权限控制
const hasPermission = usePermissionStore().hasPermission;
const productPermission = (action: string) =>
    hasPermission(`device/Product:${action}`);
const devicePermission = (action: string) =>
    hasPermission(`device/Instance:${action}`);
const rulePermission = (action: string) =>
    hasPermission(`rule-engine/Instance:${action}`);

// 物联网引导-数据
const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '创建产品',
        link: 'device/Product',
        auth: productPermission('add'),
        image: '/images/home/guide-home1.png',
        params: {
            save: true,
        },
    },
    {
        english: 'STEP2',
        label: '创建设备',
        link: 'device/Instance',
        auth: devicePermission('add'),
        image: '/images/home/guide-home1.png',
        params: {
            type: 'add',
        },
    },
    {
        english: 'STEP3',
        label: '规则引擎',
        link: 'rule-engine/Instance',
        auth: rulePermission('add'),
        image: '/images/home/guide-home3.png',
        params: {
            save: true,
        },
    },
];

// 设备接入推荐步骤-数据
const deviceStepDetails: recommendList[] = [
    {
        title: '创建产品',
        details:
            '产品是设备的集合，通常指一组具有相同功能的设备。物联设备必须通过产品进行接入方式配置。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: 'device/Product',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        title: '配置产品接入方式',
        details:
            '通过产品对同一类型的设备进行统一的接入方式配置。请参照设备铭牌说明选择匹配的接入方式。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: 'device/Product/Detail',
        auth: productPermission('update'),
        onClick: () => {
            productDialogVisible.value = true;
        },
    },
    {
        title: '添加测试设备',
        details: '添加单个设备，用于验证产品模型是否配置正确。',
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: 'device/Instance',
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
        linkUrl: 'device/Instance/Detail',
        auth: devicePermission('update'),
        onClick: () => {
            deviceDialogVisible.value = true;
        },
    },
    {
        title: '批量添加设备',
        details: '批量添加同一产品下的设备',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: 'device/Instance',
        auth: devicePermission('import'),
        params: {
            type: 'import',
        },
    },
];

// 运维管理引导-数据
const opsBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '设备接入配置',
        link: 'link/AccessConfig',
        image: '/images/home/guide-home4.png',
    },
    {
        english: 'STEP2',
        label: '日志排查',
        link: 'Log',
        params: {
            tab: 'system',
        },
        image: '/images/home/guide-home5.png',
    },
    {
        english: 'STEP3',
        label: '实时监控',
        link: 'link/DashBoard',
        image: '/images/home/guide-home6.png',
    },
];

// 运维管理推荐步骤-数据
const opsStepDetails: recommendList[] = [
    {
        title: '协议管理',
        details:
            '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Protocol',
    },
    {
        title: '证书管理',
        details: '统一维护平台内的证书，用于数据通信加密。',
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Certificate',
    },
    {
        title: '网络组件',
        details: '根据不同的传输类型配置平台底层网络组件相关参数。',
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Type',
    },
    {
        title: '设备接入网关',
        details: '根据不同的传输类型，关联消息协议，配置设备接入网关相关参数。',
        iconUrl: '/images/home/Frame4528(1).png',
        linkUrl: 'link/AccessConfig',
    },
    {
        title: '日志管理',
        details: '监控系统日志，及时处理系统异常。',
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'Log',
        params: {
            tab: 'system',
        },
    },
];

const productDialogVisible = ref(false);
const deviceDialogVisible = ref(false);
</script>
