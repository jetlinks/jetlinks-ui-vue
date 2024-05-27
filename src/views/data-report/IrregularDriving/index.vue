<template>
    <page-container>
        <a-menu v-model:selectedKeys="current" mode="horizontal">
            <a-menu-item v-for="item in list" :key="item.key">{{
                item.tab
            }}</a-menu-item>
        </a-menu>
        <component :is="componentList[current[0]]"></component>
    </page-container>
</template>

<script setup lang="ts">
import Abnormal from './components/Abnormal.vue';
import OverSpeed from './components/OverSpeed.vue';
import Overload from './components/Overload.vue';
import DSM from './components/DSM/index.vue';
import ADAS from './components/ADAS/index.vue';

interface listType {
    key: string;
    tab: string;
}
const current = ref<string[]>(['0']);

const componentList = [Abnormal, OverSpeed, Overload, ADAS, DSM];
const list: listType[] = [
    {
        key: '0',
        tab: '异常震动',
    },
    {
        key: '1',
        tab: '超速报警',
    },
    {
        key: '2',
        tab: '超载报警',
    },
    {
        key: '3',
        tab: 'ADAS报警',
    },
    {
        key: '4',
        tab: 'DSM报警',
    },
];
</script>

<style scoped lang="less"></style>
