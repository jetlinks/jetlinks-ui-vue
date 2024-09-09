<template>
  <ConfigProvider
    :locale='zhCN'
    :IconConfig="{
      scriptUrl: '//at.alicdn.com/t/c/font_4035907_i1jazcune3.js'
    }"
  >
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
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import weekdays from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'

dayjs.extend(weekdays)
dayjs.extend(localeData)
dayjs.locale('zh-cn');

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
    primaryColor: "#1677FF"
  }
})
</script>

<style scoped>
</style>
