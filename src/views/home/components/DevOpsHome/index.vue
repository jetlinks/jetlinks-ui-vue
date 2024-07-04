<template>
    <div class="device-home-container">
        <j-row :gutter="10">
            <j-col :span="14">
                <BootCard :cardData="opsBootConfig" :cardTitle="$t('DevOpsHome.index.926510-0')" />
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
                :cardTitle="$t('DevOpsHome.index.926510-1')"
                :tooltip="$t('DevOpsHome.index.926510-2')"
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const opsBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: $t('DevOpsHome.index.926510-3'),
        link: 'link/AccessConfig',
    },
    {
        english: 'STEP2',
        label: $t('DevOpsHome.index.926510-4'),
        link: 'Log',
        params: {
            tab: 'system',
        },
    },
    {
        english: 'STEP3',
        label: $t('DevOpsHome.index.926510-5'),
        link: 'link/DashBoard',
    },
];
const opsStepDetails: recommendList[] = [
    {
        title: $t('DevOpsHome.index.926510-6'),
        details:
            $t('DevOpsHome.index.926510-7'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Protocol',
    },
    {
        title: $t('DevOpsHome.index.926510-8'),
        details: $t('DevOpsHome.index.926510-9'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Certificate',
    },
    {
        title: $t('DevOpsHome.index.926510-10'),
        details: $t('DevOpsHome.index.926510-11'),
        iconUrl: '/images/home/Frame4528.png',
        linkUrl: 'link/Type',
    },
    {
        title: $t('DevOpsHome.index.926510-12'),
        details: $t('DevOpsHome.index.926510-13'),
        iconUrl: '/images/home/Frame4528(1).png',
        linkUrl: 'link/AccessConfig',
    },
    {
        title: $t('DevOpsHome.index.926510-14'),
        details: $t('DevOpsHome.index.926510-15'),
        iconUrl: '/images/home/Frame4528.png',
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
