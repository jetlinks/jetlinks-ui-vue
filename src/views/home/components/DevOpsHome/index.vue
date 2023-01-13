<template>
    <div class="device-home-container">
        <a-row :gutter="10">
            <a-col :span="14">
                <BootCard :cardData="opsBootConfig" cardTitle="运维引导" />
            </a-col>
            <a-col :span="10">
                <BasicCountCard />
            </a-col>
        </a-row>
        <a-row>
            <PlatformPicCard />
        </a-row>
        <a-row>
            <StepCard
                cardTitle="运维管理推荐步骤"
                tooltip="请根据业务需要对下述步骤进行选择性操作。"
                :dataList="opsStepDetails"
            />
        </a-row>
    </div>
</template>

<script setup lang="ts" name="devOpsHome">
import BootCard from '../BootCard.vue';
import BasicCountCard from '../BasicCountCard.vue';
import PlatformPicCard from '../PlatformPicCard.vue';
import StepCard from '../StepCard.vue';

import { opsBootConfig, opsStepDetails } from '../../modules/config';

</script>

<style lang="less" scoped>
.device-home-container {
    .ant-row {
        margin-bottom: 24px;
    }
}
</style>
