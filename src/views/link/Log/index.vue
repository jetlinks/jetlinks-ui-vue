<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="访问日志">
      <AccessLog />
    </a-tab-pane>
    <a-tab-pane key="2" tab="系统日志" force-render>
      <SystemLog />
    </a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup name="LogPage">
import { defineComponent, ref } from 'vue';
import AccessLog from './Access/index.vue';
import SystemLog from './System/index.vue';

const activeKey = ref('1');
</script>
