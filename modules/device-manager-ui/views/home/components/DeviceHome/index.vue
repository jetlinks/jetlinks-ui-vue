<template>
    <div class="device-home-container">
        <a-row :gutter="24">
            <a-col :span="14">
                <BootCard :cardData="deviceBootConfig" :cardTitle="$t('DeviceHome.index.926510-0')" />
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
                :cardTitle="$t('DeviceHome.index.926510-1')"
                :tooltip="$t('DeviceHome.index.926510-2')"
                :dataList="deviceStepDetails"
            />
        </a-row>

        <div class="dialog">
            <ProductChooseDialog
                v-if="productDialogVisible"
                v-model:visible="productDialogVisible"
                @confirm="(id:string)=>jumpPage('device/Product/Detail', { params: { id, tab: 'Device'}})"
            />
            <DeviceChooseDialog
                v-if="deviceDialogVisible"
                v-model:visible="deviceDialogVisible"
                @confirm="(id:string)=>jumpPage('device/Instance/Detail', { params: { id, tab: 'Diagnose' }})"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="deviceHome">
import ProductChooseDialog from '../dialogs/ProductChooseDialog.vue';
import DeviceChooseDialog from '../dialogs/DeviceChooseDialog.vue';
import BootCard from '../BootCard.vue';
import DeviceCountCard from '../DeviceCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';
import { home } from '../../../../assets'

import { useAuthStore } from '@jetlinks-web-core/store';
import { bootConfig, recommendList } from '../../typing';
import { useMenuStore } from '@jetlinks-web-core/store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
// 按钮权限控制
const hasPermission = useAuthStore().hasPermission;
const productPermission = (action: string) =>
    hasPermission(`device/Product:${action}`);
const devicePermission = (action: string) =>
    hasPermission(`device/Instance:${action}`);
const rulePermission = (action: string) =>
    hasPermission(`rule-engine/Instance:${action}`);

const { jumpPage } = useMenuStore();

const productDialogVisible = ref(false);
const deviceDialogVisible = ref(false);

const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: $t('DeviceHome.index.926510-3'),
        link: 'device/Product',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        english: 'STEP2',
        label: $t('DeviceHome.index.926510-4'),
        link: 'device/Instance',
        auth: devicePermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        english: 'STEP3',
        label: $t('DeviceHome.index.926510-5'),
        link: 'rule-engine/Instance',
        auth: rulePermission('add'),
        params: {
            save: true,
        },
    },
];
const deviceStepDetails: recommendList[] = [
    {
        title: $t('DeviceHome.index.926510-3'),
        details:
            $t('DeviceHome.index.926510-6'),
        iconUrl: home.bottom4,
        linkUrl: 'device/Product',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        title: $t('DeviceHome.index.926510-7'),
        details:
            $t('DeviceHome.index.926510-8'),
        iconUrl: home.bottom1,
        linkUrl: 'device/Product/Detail',
        auth: productPermission('update'),
        onClick: () => {
            productDialogVisible.value = true;
        },
    },
    {
        title: $t('DeviceHome.index.926510-9'),
        details: $t('DeviceHome.index.926510-10'),
        iconUrl: home.bottom5,
        linkUrl: 'device/Instance',
        auth: devicePermission('add'),
        params: {
            type: 'add',
        },
    },
    {
        title: $t('DeviceHome.index.926510-11'),
        details:
            $t('DeviceHome.index.926510-12'),
        iconUrl: home.bottom2,
        linkUrl: 'device/Instance/Detail',
        onClick: () => {
            deviceDialogVisible.value = true;
        },
    },
    {
        title: $t('DeviceHome.index.926510-13'),
        details: $t('DeviceHome.index.926510-14'),
        iconUrl: home.bottom3,
        linkUrl: 'device/Instance',
        auth: devicePermission('import'),
        params: {
            type: 'import',
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
