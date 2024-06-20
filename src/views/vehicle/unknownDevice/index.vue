<template>
    <page-container
        :tabList="list"
        @tabChange="onTabChange"
        :tabActiveKey="tab"
    >
        <DataUPload v-if="tab == 'DataUpload'"></DataUPload>
        <ProtocolParsing v-else></ProtocolParsing>
    </page-container>
</template>

<script setup lang="ts">
import DataUPload from './components/DataUpload/index.vue';
import ProtocolParsing from './components/ProtocolParsing/index.vue';

type tabType = 'DataUpload' | 'protocolParsing';
let tab = ref<tabType>('DataUpload');
const list = [
    {
        key: 'DataUpload',
        tab: '数据上传异常',
    },
    {
        key: 'protocolParsing',
        tab: '协议解析异常',
    },
];

const onTabChange = (e: tabType) => {
    tab.value = e;
};
</script>

<style lang="less" scoped></style>
