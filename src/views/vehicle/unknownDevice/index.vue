<template>
    <page-container
        :tabList="list"
        @tabChange="onTabChange"
        :tabActiveKey="tab"
    >
        <DataUPload v-if="tab == 'dataUPload'" />
        <ProtocolParsing v-else-if="tab == 'protocolParsing'" />
        <DeviceBinding v-else-if="tab == 'deviceBinding'" />
        <DeviceName v-else />
    </page-container>
</template>

<script setup lang="ts">
import DataUPload from './DataUpload/index.vue';
import ProtocolParsing from './ProtocolParsing/index.vue';
import DeviceName from './DeviceName/index.vue';
import DeviceBinding from './DeviceBinding/index.vue';
type tabType =
    | 'dataUPload'
    | 'protocolParsing'
    | 'equipmentName'
    | 'deviceBinding';
let tab = ref<tabType>('protocolParsing');
const list = [
    // {
    //     key: 'dataUpload',
    //     tab: '数据上传异常',
    // },
    {
        key: 'protocolParsing',
        tab: '协议解析异常',
    },
    {
        key: 'equipmentName',
        tab: '设备命名异常',
    },
    // {
    //     key: 'deviceBinding',
    //     tab: '设备绑定异常',
    // },
];

const onTabChange = (e: tabType) => {
    tab.value = e;
};
</script>

<style lang="less" scoped></style>
