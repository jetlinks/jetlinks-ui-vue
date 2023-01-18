<template>
    <div class="device-home-container">
        <a-row :gutter="10">
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

import { deviceBootConfig, deviceStepDetails } from '../../modules/config';
</script>

<style lang="less" scoped>
.device-home-container {
    .ant-row {
        margin-bottom: 24px;
    }
}
</style>
