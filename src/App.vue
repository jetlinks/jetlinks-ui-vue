<template>
  <ConfigProvider :locale='zhCN'>
<!--    <router-view v-slot="{ Component }">-->
<!--      <keep-alive>-->
<!--        <component :is="Component" />-->
<!--      </keep-alive>-->
<!--    </router-view>-->
    <router-view />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'jetlinks-ui-components'
import zhCN from 'jetlinks-ui-components/es/locale/zh_CN';
import { storeToRefs } from 'pinia';
import { useSystem } from './store/system';
import DefaultSetting from '../config/config'

const system = useSystem();
const {configInfo} = storeToRefs(system);

system.setDocumentTitle()

</script>

<style scoped>
</style>
