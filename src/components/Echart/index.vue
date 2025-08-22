<template>
	<div class="chart-content" ref="echartsRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onActivated, onBeforeMount, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { useEventListener } from '@vueuse/core';

interface Props {
	option: Record<string, any>;
}

const props = defineProps<Props>();

const echartsRef = ref<echarts.EChartsType>();
let echartsInstance: echarts.EChartsType | null = null;

const handleInit = () => {
	nextTick(() => {
		const userGrowthChart = echarts.init(echartsRef.value as unknown as HTMLElement);

		userGrowthChart.setOption(props.option, true);
		echartsInstance = userGrowthChart;
	});
};

const echartsResize = () => {
	nextTick(() => {
		echartsInstance?.resize();
	});
};

onActivated(() => {
	echartsResize();
});

onMounted(() => {
	useEventListener(window, 'resize', echartsResize);
});

onBeforeMount(() => {
	echartsInstance?.dispose();
});

watch(
	() => props.option,
	(newVal) => {
		if (newVal) {
			handleInit();
		}
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style scoped>
.chart-content {
	width: 100%;
	height: 100%;
}
</style>
