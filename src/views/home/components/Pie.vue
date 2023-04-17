<template>
    <div :ref="props.chartRef"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ComponentInternalInstance, onBeforeUnmount } from 'vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const props = defineProps({
    chartRef: String,
    value: Number,
    image: String,
    colorArr: Array<string>,
});

const options = computed(() => ({
    color: props.colorArr || ['#D3ADF7', '#979AFF'],
    graphic: [
        {
            type: 'image',
            style: {
                image: props.image || '',
                width: 16,
                height: 16,
            },
            left: 'center',
            top: '41%',
        },
    ],
    series: [
        {
            type: 'pie',
            radius: ['100%', '60%'],
            center: ['50%', '50%'],
            label: {
                show: false,
            },
            data: [100 - (props.value || 0), props.value],
            itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
            },
        },
    ],
}));

const myChart = ref()

watch(options, () => {
    if (myChart.value) {
      myChart.value.setOption(options.value)
    } else {
      initChart()
    }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

const resize = () => {
  if (myChart.value) {
    myChart.value.resize();
  }
}

const initChart = () => {
    nextTick(() => {
        myChart.value = echarts.init(proxy?.$refs[props.chartRef as string] as HTMLElement);

        myChart.value.setOption(options.value);

        window.addEventListener('resize', resize);
    });
};

initChart();
</script>
