<template>
  <Suspense v-if="!!props.value && myComponents">
    <component :is="myComponents" ref="componentRef"></component>
  </Suspense>
</template>

<script setup>
import {loadModule} from 'vue3-sfc-loader/dist/vue3-sfc-loader'
import {defineAsyncComponent, ref, watch} from 'vue'
import * as Vue from 'vue'
import {debounce} from 'lodash-es'
import * as JetlinksCore from '@jetlinks-web/core'
import * as JetlinksUtils from '@jetlinks-web/utils'
import * as JetlinksTypes from '@jetlinks-web/types'
import * as JetlinksConstants from '@jetlinks-web/constants'
import * as JetlinksHooks from '@jetlinks-web/hooks'
import * as pinia from 'pinia'
import * as Router from 'vue-router'
import * as LocalUtils from '@/utils'
import * as LodashEs from 'lodash-es'
import {useLocales} from '@/hooks'

defineOptions({name: 'RenderComponents'})

const props = defineProps({
  value: {
    type: String
  }
})

const myComponents = ref()

const render = debounce(() => {
  myComponents.value = defineAsyncComponent(() => loadModule('./components/PluginRender.vue', {
    moduleCache: {
      vue: Vue,
      '@jetlinks-web/core': JetlinksCore,
      '@jetlinks-web/utils': JetlinksUtils,
      '@jetlinks-web/types': JetlinksTypes,
      '@jetlinks-web/constants': JetlinksConstants,
      '@jetlinks-web/hooks': JetlinksHooks,
      pinia: pinia,
      'vue-router': Router,
      'local-utils': LocalUtils,
      'lodash-es': LodashEs,
      '@hooks': {useLocales}
    },
    getFile(url) {
      return Promise.resolve(props.value)
    },
    addStyle(textContent) {
      const style = Object.assign(document.createElement('style'), {textContent});
      const ref = document.head.getElementsByTagName('style')[0] || null;
      document.head.insertBefore(style, ref);
    }
  }))
}, 500)

watch(() => props.value, () => {
  render()
}, {immediate: true})
</script>

<style scoped>

</style>
