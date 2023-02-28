<template>
  <page-container>
    <Search :columns="columns" target="alarm-log-detail"></Search>
    <JTable :columns="columns" model="TABLE" :request="queryList"></JTable>
  </page-container>
</template>

<script lang="ts" setup>
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
const queryList = () =>{
  
}
</script>
<style lang="less" scoped>
</style>