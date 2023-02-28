<template>
    <page-container :tabList="isNoCommunity ? list : noList" :tabActiveKey="data.tab" @tabChange="onTabChange">
        <TableComponents :type="data.tab"></TableComponents>
    </page-container>
</template>

<script lang="ts" setup>
import { isNoCommunity } from '@/utils/utils';
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import { queryLevel } from '@/api/rule-engine/config';
import { Store } from 'jetlinks-store';
import  TableComponents  from './TabComponent/indev.vue';
const list = [
    {
        key: 'all',
        tab: '全部',
    },
    {
        key: 'product',
        tab: '产品',
    },
    {
        key: 'device',
        tab: '设备',
    },
    {
        key: 'org',
        tab: '组织',
    },
    {
        key: 'other',
        tab: '其他',
    },
];
const noList = [
    {
        key: 'all',
        tab: '全部',
    },
    {
        key: 'product',
        tab: '产品',
    },
    {
        key: 'device',
        tab: '设备',
    },
    {
        key: 'other',
        tab: '其他',
    },
];
const alarmStore = useAlarmStore();
const { data }  = storeToRefs(alarmStore);
const getDefaulitLevel = () => {
    queryLevel().then((res)=>{
        if(res.status === 200 ){
            Store.set('default-level', res.result?.levels || []);
            data.value.defaultLevel = res.result?.levels || [];
        }
    })
}
getDefaulitLevel();
const onTabChange = (key:string) =>{
    data.value.tab = key;
}
</script>
<style lang="less" scoped>
</style>