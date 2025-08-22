<template>
  <div ref="echartsDom" class="echarts-warp" :style="style"></div>
</template>

<script lang="ts" setup>
import type {CSSProperties, Ref, PropType} from 'vue'
import { nextTick, ref, watch, defineProps, defineOptions } from 'vue'
import {useECharts} from './useEcharts'

defineOptions({
  name: 'JEcharts'
})

const props = defineProps({
  options: {
    type: Object,
    default: undefined,
  },
  style: Object as PropType<CSSProperties>,
})

const echartsDom = ref<Ref<HTMLDivElement> | HTMLDivElement>()

const {setOptions} = useECharts(echartsDom)

watch(
  () => JSON.stringify(props.options),
  () => {
    if (props.options) {
      nextTick(() => {
        setOptions(props.options)
      })
    }
  },
  {immediate: true},
)
</script>

<style scoped>
.echarts-warp {
  width: 100%;
  height: 100%;
}
</style>
