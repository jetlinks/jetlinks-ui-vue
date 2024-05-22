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
import SDM from './components/SMD.vue';

interface listType {
    key: string;
    tab: string;
}

const activeKey = ref('0');

const current = ref<string[]>(['0']);

const componentList = [Abnormal, OverSpeed, Overload, SDM];
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
        tab: 'DSM报警',
    },
];

const onTabChange = (e: string) => {
    activeKey.value = e;
};
</script>

<style scoped lang="scss">

// :deep(.ant-menu-item-selected) {
//     color: red !important;
// }


</style>
