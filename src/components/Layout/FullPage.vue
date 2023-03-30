<template>
  <div class='full-page-warp' ref='fullPage' :style='{ minHeight: `calc(100vh - ${y + 24}px)`}'>
    <slot></slot>
  </div>
</template>

<script setup lang='ts' name='FullPage'>
import { useElementBounding } from '@vueuse/core'

const fullPage = ref(null)
const { y } = useElementBounding(fullPage)

</script>

<style scoped>
.full-page-warp {
  background: #fff;
}
</style>