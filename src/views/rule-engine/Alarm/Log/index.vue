<template>
    <page-container :tabList="list" :tabActiveKey="data.tab" @tabChange="onTabChange">
        <TableComponents :type="data.tab"></TableComponents>
    </page-container>
</template>

<script lang="ts" setup>
import { isNoCommunity } from '@/utils/utils';
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import  TableComponents  from './TabComponent/index.vue';
import { usePermissionStore } from '@/store/permission';


const { hasPermission } = usePermissionStore();

const list = ref()

const alarmStore = useAlarmStore();
const { data }  = storeToRefs(alarmStore);
const onTabChange = (key:string) =>{
    data.value.tab = key;
}

onMounted(()=>{
    // if(!hasPermission('Alarm/Log:update')){
    //     data.value.tab = 'product'
    //     list.value = [{
    //         key: 'product',
    //         tab: '产品'
    //     }]
    // }else{
        list.value = isNoCommunity ? [{
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
                key: 'organization',
                tab: '组织',
            },
            {
                key: 'scene',
                tab: '场景',
            }]
            : 
           [ {
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
                key: 'scene',
                tab: '场景',
            }]
    // }   
})
</script>
<style lang="less" scoped>
</style>