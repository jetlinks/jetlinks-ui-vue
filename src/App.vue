<template>
  <ConfigProvider :locale='zhCN'>
    <router-view />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'jetlinks-ui-components'
import zhCN from 'jetlinks-ui-components/es/locale/zh_CN';
import { storeToRefs } from 'pinia';
import { useSystem } from './store/system';
import {LocalStore} from "@/utils/comm";
import {TOKEN_KEY} from "@/utils/variable";

const system = useSystem();
const {configInfo} = storeToRefs(system);

system.setDocumentTitle()

const route = useRoute()

watch(() => JSON.stringify(route.query || {}), () => {
  if (route.query.token) {
    LocalStore.set(TOKEN_KEY, route.query.token);
  }
}, { immediate: true })


ConfigProvider.config({
  theme: {
    primaryColor: "#315efb"
  }
})
</script>

<style scoped>
</style>
