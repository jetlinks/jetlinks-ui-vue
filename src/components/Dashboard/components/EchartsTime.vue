<template>
 <div ref="echartsDom" class="echarts-warp"></div>
</template>

<script lang="ts" name="Echarts" setup>
import * as echarts from 'echarts';
import {onUnmounted, watch} from "vue";

const props = defineProps({
 options: {
   type: Object,
   default: undefined
 }
})

const echartsDom = ref<HTMLElement>()
const myChart = ref()

const echartsRender = () => {
 if (!echartsDom.value) return
 if (!myChart.value) {
   myChart.value = echarts.init(echartsDom.value)
   toRaw(myChart.value).setOption(props.options);
 } else {
   toRaw(myChart.value).setOption(props.options, true);
 }
}

const echartsResize = () => {
 toRaw(myChart.value)?.resize?.()
}

onMounted(() => {
 window.addEventListener('resize', echartsResize)
})

onUnmounted(() => {
 window.removeEventListener('resize', echartsResize)
})

watch(() => props.options, () => {
 if (props.options) {
   nextTick(() => {
     echartsRender()
   })
 }
}, { immediate: true, deep: true })

</script>

<style scoped>
.echarts-warp {
 width: 100%;
 height: 100%;
}
</style>