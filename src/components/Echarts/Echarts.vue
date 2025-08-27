<template>
  <div ref="echartsDom" class="echarts-warp"></div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineOptions } from 'vue'
import { useEcharts } from '@/hooks'

defineOptions({
  name: 'JEcharts'
})

const props = defineProps({
  option: {
    type: Object,
    default: undefined,
  },
  library: {
    type: Array,
    default: () => [],
  }
})

const echartsDom = ref<HTMLDivElement>()
useEcharts(echartsDom, props)

</script>

<style scoped>
.echarts-warp {
  width: 100%;
  height: 100%;
}
</style>
