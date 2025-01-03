<template>
  <a-select style="width: 100px;" v-model:value="language" :options="options" @change="handleChangeLanguage" />
</template>

<script setup lang="ts">
import { LocalStore } from '@jetlinks-web/utils';
const language = ref(LocalStore.get('lang') || navigator.language || 'zh-CN');
const options = [
  {
    label: '中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en-US'
  }
]

const handleChangeLanguage = () => {
  LocalStore.set('lang', language.value)
  location.reload()
}
</script>

<style scoped lang="less">

</style>