<template>
  <ConfigProvider
    :locale="language[systemStore.language]"
    :componentsLocale="componentsLocale[systemStore.language]"
    :IconConfig="{
      scriptUrl: '/icons/iconfont.js'
    }"
    :theme="themeConfig"
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
import { useAuthStore, useSystemStore } from '@jetlinks-web-core/store';
import { ComponentsEnum, LOCAL_BASE_API } from '@jetlinks-web/constants'
import {initPackages} from "@jetlinks-web-core/package";
import { setToken} from "@jetlinks-web/utils";
import { getBaseApi, initPersonal } from '@jetlinks-web-core/utils'
import { componentsRegistry } from './utils/components-registry'

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

const themeConfig = {
  token: theme
}

provide(ComponentsEnum.Permission, { hasPermission })

initPersonal()
initPackages()

componentsRegistry.batchRegister()

if (import.meta.env.DEV) {
  localStorage.setItem(LOCAL_BASE_API, getBaseApi())
}

window.addEventListener('vite:preloadError', (event) => {
  console.error('资源版本不对，请清除浏览器缓存')
})

watch(() => JSON.stringify(route.query || {}), () => {
  if (route.query.token) {
    setToken(route.query.token as string)
  }

}, { immediate: true })

</script>
<style scoped></style>
