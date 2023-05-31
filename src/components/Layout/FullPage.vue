<template>
  <div class='full-page-warp' ref='fullPage' :style='{ minHeight: `calc(100vh - ${y + 24}px)`}'>
    <div class="full-page-warp-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang='ts' name='FullPage'>
import { useElementBounding } from '@vueuse/core'

const fullPage = ref(null)
const { y } = useElementBounding(fullPage)

</script>

<style scoped lang="less">
.full-page-warp {
  background: #fff;
  display: flex;
  .full-page-warp-content {
    width: 100%;
  }
}

</style>