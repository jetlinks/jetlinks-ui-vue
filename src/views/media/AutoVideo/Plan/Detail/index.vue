<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="mediaStore.tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>

        </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component
                    :is="tabs[mediaStore.tabActiveKey]"
                    @onJump="onTabChange"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts" name="Detail">
import {useMediaStore} from '@/store/media';
import Rule from './Rule/index.vue';
import Channel from './Channel/index.vue';
import Log from './Log/index.vue';

const mediaStore = useMediaStore();

const list = [
    {
        key: 'Rule',
        tab: '录制规则',
    },
    {
        key: 'Channel',
        tab: '关联通道',
    },
    {
        key: 'Log',
        tab: '执行日志',
    },
];

const tabs = {
    Rule,
    Channel,
    Log,
};

const onTabChange = (e: string) => {
    mediaStore.tabActiveKey = e;
};
</script>

<style lang="less" scoped></style>
