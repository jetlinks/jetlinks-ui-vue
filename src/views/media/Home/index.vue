<template>
    <page-container>
        <j-row :gutter="24">
            <j-col :span="14">
                <BootCard
                    :cardData="deviceBootConfig"
                    cardTitle="视频中心引导"
                />
            </j-col>
            <j-col :span="10">
                <BasicCountCard />
            </j-col>
            <j-col :span="24" style="margin: 20px 0">
                <PlatformPicCard />
            </j-col>
            <j-col :span="24">
                <StepCard
                    cardTitle="设备接入推荐步骤"
                    tooltip="不同的设备因为通信协议的不同，存在接入步骤的差异"
                    :dataList="deviceStepDetails"
                />
            </j-col>
        </j-row>
    </page-container>
</template>

<script setup lang="ts">
import BootCard from '@/views/home/components/BootCard.vue';
import PlatformPicCard from '@/views/home/components/PlatformPicCard.vue';
import StepCard from '@/views/home/components/StepCard.vue';
import BasicCountCard from '@/views/media/Home/components/BasicCountCard.vue';

import { usePermissionStore } from '@/store/permission';
import type { bootConfig, recommendList } from '@/views/home/typing';

// 权限控制
const hasPermission = usePermissionStore().hasPermission;

const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '添加视频设备',
        link: 'media/Device/Save',
        auth: hasPermission('media/Device:add'),
    },
    {
        english: 'STEP2',
        label: '分屏展示',
        link: 'media/SplitScreen',
    },
    {
        english: 'STEP3',
        label: '国标级联',
        link: 'media/Cascade',
    },
];
const deviceStepDetails: recommendList[] = [
    {
        title: '添加视频设备',
        details: '根据视频设备的传输协议，在已创建的产品下添加对应的设备。',
        iconUrl: '/images/home/bottom-6.png',
        linkUrl: 'media/Device/Save',
        auth: hasPermission('media/Device:add'),
    },
    {
        title: '查看通道',
        details: '查看设备下的通道数据，可以进行直播、录制等操作。',
        iconUrl: '/images/home/bottom-7.png',
        linkUrl: 'media/Device/Channel',
        auth: hasPermission('media/Device:view'),
    },
    {
        title: '分屏展示',
        details: '对多个通道的视频流数据进行分屏展示。',
        iconUrl: '/images/home/bottom-8.png',
        linkUrl: 'media/SplitScreen',
    },
];
</script>
