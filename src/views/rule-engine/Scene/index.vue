<template>
  <page-container>
    <search
      :columns='columns'
    />
    <j-table
      :columns='columns'
    />
  </page-container>
</template>

<script setup lang='ts'>

import type { SceneItem } from './typings'

const columns = [
  {
    dataIndex: 'name',
    fixed: 'left',
    ellipsis: true,
    width: 300,
    title: '名称',
    search: {
      type: 'string'
    }
  },
  {
    dataIndex: 'triggerType',
    title: '触发方式',
    search: {
      type: 'select',
      options: [
        { label: '手动触发', value: 'manual'},
        { label: '定时触发', value: 'timer'},
        { label: '设备触发', value: 'device'}
      ]
    }
  },
  {
    dataIndex: 'description',
    title: '说明',
  },
  {
    dataIndex: 'state',
    title: '状态',
    search: {
      type: 'select',
      options: [
        { label: '正常', value: 'started'},
        { label: '禁用', value: 'disable'},
      ]
    }
  }
]
</script>

<style scoped>

</style>