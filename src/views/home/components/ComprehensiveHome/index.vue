<template>
    <div class="comprehensive-home-conatiner">
        <a-row :gutter="24" class="top" style="margin-bottom: 24px">
            <a-col :span="6" class="left">
                <BootCardSmall
                    :cardData="deviceBootConfig"
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
            :dataList="deviceStepDetails"
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
import StepCard from '../StepCard.vue';

import {
    deviceBootConfig as _deviceBootConfig,
    deviceStepDetails,
    opsBootConfig as _opsBootConfig,
    opsStepDetails,
} from '../../modules/config';

const deviceImages = [
    '/images/home/guide-home1.png',
    '/images/home/guide-home2.png',
    '/images/home/guide-home3.png',
];
const opsImages = [
    '/images/home/guide-home4.png',
    '/images/home/guide-home5.png',
    '/images/home/guide-home6.png',
];

const deviceBootConfig = _deviceBootConfig.map((item,i) => ({...item, image: deviceImages[i]}));
const opsBootConfig = _opsBootConfig.map((item,i) => ({...item, image: opsImages[i]}));
</script>
