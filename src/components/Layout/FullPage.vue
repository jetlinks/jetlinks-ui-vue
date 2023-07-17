<template>
  <div ref='fullPage' :style="{ minHeight: MinHeight}" class='full-page-warp' >
    <div class="full-page-warp-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang='ts' name='FullPage'>
import { useElementBounding } from '@vueuse/core'

const props = defineProps({
  extraHeight: {
    type: Number,
    default: 0
  }
})

const fullPage = ref(null)
const { y } = useElementBounding(fullPage)

const MinHeight = computed(() => {
  const _y = (y.value < 0 ? 0 : y.value) + props.extraHeight
  return `calc(100vh - ${_y + 24}px)`
})

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