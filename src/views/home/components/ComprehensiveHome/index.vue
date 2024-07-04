<template>
    <div class="comprehensive-home-conatiner">
        <j-row :gutter="24" class="top" style="margin-bottom: 24px">
            <j-col :span="6" class="left">
                <BootCardSmall
                    :cardData="deviceBootConfig"
                    :cardTitle="$t('ComprehensiveHome.index.926510-0')"
                />
                <div style="width: 100%; height: 24px"></div>
                <BootCardSmall :cardData="opsBootConfig" :cardTitle="$t('ComprehensiveHome.index.926510-1')" />
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
            :cardTitle="$t('ComprehensiveHome.index.926510-2')"
            :tooltip="$t('ComprehensiveHome.index.926510-3')"
            :dataList="deviceStepDetails"
            style="margin-bottom: 24px"
        />
        <StepCard
            :cardTitle="$t('ComprehensiveHome.index.926510-4')"
            :tooltip="$t('ComprehensiveHome.index.926510-5')"
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
        label: $t('ComprehensiveHome.index.926510-6'),
        link: 'device/Product',
        auth: productPermission('add'),
        image: '/images/home/guide-home1.png',
        params: {
            save: true,
        },
    },
    {
        english: 'STEP2',
        label: $t('ComprehensiveHome.index.926510-7'),
        link: 'device/Instance',
        auth: devicePermission('add'),
        image: '/images/home/guide-home1.png',
        params: {
            type: 'add',
        },
    },
    {
        english: 'STEP3',
        label: $t('ComprehensiveHome.index.926510-8'),
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
        title: $t('ComprehensiveHome.index.926510-6'),
        details:
            $t('ComprehensiveHome.index.926510-9'),
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: 'device/Product',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        title: $t('ComprehensiveHome.index.926510-10'),
        details:
            $t('ComprehensiveHome.index.926510-11'),
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: 'device/Product/Detail',
        auth: productPermission('update'),
        onClick: () => {
            productDialogVisible.value = true;
        },
    },
    {
        title: $t('ComprehensiveHome.index.926510-12'),
        details: $t('ComprehensiveHome.index.926510-13'),
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: 'device/Instance',
        auth: devicePermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        title: $t('ComprehensiveHome.index.926510-14'),
        details:
            $t('ComprehensiveHome.index.926510-15'),
        iconUrl: '/images/home/bottom-2.png',
        linkUrl: 'device/Instance/Detail',
        auth: devicePermission('update'),
        onClick: () => {
            deviceDialogVisible.value = true;
        },
    },
    {
        title: $t('ComprehensiveHome.index.926510-16'),
        details: $t('ComprehensiveHome.index.926510-17'),
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
        label: $t('ComprehensiveHome.index.926510-18'),
        link: 'link/AccessConfig',
        image: '/images/home/guide-home4.png',
    },
    {
        english: 'STEP2',
        label: $t('ComprehensiveHome.index.926510-19'),
        link: 'Log',
        params: {
            tab: 'system',
        },
        image: '/images/home/guide-home5.png',
    },
    {
        english: 'STEP3',
        label: $t('ComprehensiveHome.index.926510-20'),
        link: 'link/DashBoard',
        image: '/images/home/guide-home6.png',
    },
];

// 运维管理推荐步骤-数据
const opsStepDetails: recommendList[] = [
    {
        title: $t('ComprehensiveHome.index.926510-21'),
        details:
            $t('ComprehensiveHome.index.926510-22'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Protocol',
    },
    {
        title: $t('ComprehensiveHome.index.926510-23'),
        details: $t('ComprehensiveHome.index.926510-24'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Certificate',
    },
    {
        title: $t('ComprehensiveHome.index.926510-25'),
        details: $t('ComprehensiveHome.index.926510-26'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Type',
    },
    {
        title: $t('ComprehensiveHome.index.926510-27'),
        details: $t('ComprehensiveHome.index.926510-28'),
        iconUrl: '/images/home/Frame4528(1).png',
        linkUrl: 'link/AccessConfig',
    },
    {
        title: $t('ComprehensiveHome.index.926510-29'),
        details: $t('ComprehensiveHome.index.926510-30'),
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
