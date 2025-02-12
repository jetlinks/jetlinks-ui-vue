<template>
  <a-select style="width: 100px;" v-model:value="systemStore.language" :options="options" @change="handleChangeLanguage" />
</template>

<script setup lang="ts">
import { LocalStore } from '@jetlinks-web/utils';
import { useSystemStore } from '@/store'
import { langKey, ruleEditorKey } from "@/utils/consts";

const systemStore = useSystemStore()

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
  LocalStore.set(ruleEditorKey, systemStore.language)
  window.location.reload();
}
</script>

<style scoped lang="less">

</style>
