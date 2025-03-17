<template>
  <ConfigProvider
    :locale="language[systemStore.language]"
    :componentsLocale="componentsLocale[systemStore.language]"
    :IconConfig="{
      scriptUrl: '//at.alicdn.com/t/c/font_4035907_e2upz5fi7ew.js'
    }"
  >
    <router-view/>
  </ConfigProvider>
</template>
<script setup lang="ts">
import { ConfigProvider } from '@jetlinks-web/components'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUs from 'ant-design-vue/es/locale/en_US'
import componentsZhCN from '@jetlinks-web/components/es/locale/zh-CN'
import componentsEnUS from '@jetlinks-web/components/es/locale/en-US'
import theme from '../configs/theme'
import { useAuthStore, useSystemStore } from '@/store';
import { ComponentsEnum } from '@jetlinks-web/constants'
import {initPackages} from "@/package";
import { setToken} from "@jetlinks-web/utils";

const route = useRoute()

const systemStore = useSystemStore()

const language = {
    en: enUs,
    zh: zhCN
}

const componentsLocale = {
  en: componentsEnUS,
  zh: componentsZhCN
}
// 为公共hooks提供权限校验方法
const { hasPermission } = useAuthStore();

provide(ComponentsEnum.Permission, { hasPermission })

ConfigProvider.config({
  theme: theme,
})

initPackages()

watch(() => JSON.stringify(route.query || {}), () => {
  if (route.query.token) {
    setToken(route.query.token as string)
  }
}, { immediate: true })

window.addEventListener('vite:preloadError', (event) => {
    console.error('资源版本不对，请清除浏览器缓存')
})

</script>
<style scoped></style>
