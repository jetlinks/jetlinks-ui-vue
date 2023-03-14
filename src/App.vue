<template>
  <ConfigProvider :locale='zhCN'>
    <router-view />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'jetlinks-ui-components'
import zhCN from 'jetlinks-ui-components/es/locale/zh_CN';

</script>

<style scoped>
</style>
