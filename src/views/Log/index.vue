<template>
    <page-container :tabList="list" @tabChange="onTabChange">
        <AccessLog v-if="activeKey === '1'" />
        <SystemLog v-else />
    </page-container>
</template>
<script lang="ts" setup name="LogPage">
import { defineComponent, ref } from 'vue';
import AccessLog from './Access/index.vue';
import SystemLog from './System/index.vue';

const activeKey = ref('1');

const list = [
    {
        key: '1',
        tab: '访问日志',
    },
    {
        key: '2',
        tab: '系统日志',
    },
];

const onTabChange = (e: string) => {
    activeKey.value = e;
};
</script>
