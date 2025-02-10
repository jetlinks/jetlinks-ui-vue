<template>
  <a-select style="width: 100px;" v-model:value="systemStore.language" :options="options" @change="handleChangeLanguage" />
</template>

<script setup lang="ts">
import { LocalStore } from '@jetlinks-web/utils';
import { useSystemStore, useUserStore, useMenuStore } from '@/store'
import {langKey} from "@/utils/consts";
import i18n from "@/locales";

const systemStore = useSystemStore()
const userStore = useUserStore()
const menuStore = useMenuStore()

const options = [
  {
    label: '中文',
    value: 'zh'
  },
  {
    label: 'English',
    value: 'en'
  }
]

const handleChangeLanguage = async () => {
  LocalStore.set(langKey, systemStore.language)
  window.location.reload();
}
</script>

<style scoped lang="less">

</style>
