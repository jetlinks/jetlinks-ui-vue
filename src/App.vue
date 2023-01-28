<template>
  <ProLayout
    v-bind='layoutConf'
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
  >
    <router-view />
  </ProLayout>
</template>

<script setup lang="ts">
import { ProLayout } from '@/components/Layout'
import DefaultSetting from '../config/config'

const layoutConf = reactive({
  navTheme: DefaultSetting.layout.theme,
  siderWidth: DefaultSetting.layout.theme,
  logo: DefaultSetting.layout.logo,
  title: DefaultSetting.layout.title,
  menuData: [],
});

const state = reactive({
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
});
</script>

<style scoped>
</style>
