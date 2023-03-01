<template>
  <page-container>
    <Search :columns="columns" target="alarm-log-detail"></Search>
    <JTable :columns="columns" model="TABLE" :request="queryList"></JTable>
  </page-container>
</template>

<script lang="ts" setup>
import { detail } from '@/api/rule-engine/log'
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params?.id; 
const columns = [{
  title:'告警时间',
  dataIndex:'alarmTime',
  key:'alarmTime',
  search:{
    type:'date'
  }
},{
  title:'告警名称',
  dataIndex:'alarmConfigName',
  key:'alarmConfigName',
},{
  title:'说明',
  dataIndex:'description',
  key:'description'
},{
  title:'操作',
  dataIndex:'action',
  key:'action'
}]

/**
 * 获取详情列表
 */
const queryList = async () =>{
    const res = await detail(id);
    if(res.status === 200){
        if(res.result.targetType === 'devoce'){
            columns.splice(2,0,{
                dataIndex:'targetName',
                title:'告警设备',
                key:'targetName'
            })
        }
        return res
    }
}
</script>
<style lang="less" scoped>
</style>