<!-- 坐标点拾取组件 -->
<template>
    <div style="width: 100%; height: 400px">
        <div style="position: relative">
            <div style="position: absolute; right: 0; top: 5px; z-index: 999">
                <a-space>
                    <a-button type="primary" @click="start">开始动画</a-button>
                    <a-button type="primary" @click="stop">停止动画</a-button>
                </a-space>
            </div>
        </div>
        <el-amap :center="center" :zooms="[3, 20]" @init="initMap" ref="map"></el-amap>
    </div>
</template>

<script setup lang="ts">
import { initAMapApiLoader } from '@vuemap/vue-amap';
import AMapUI from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css';

initAMapApiLoader({
    key: 'a0415acfc35af15f10221bfa5a6850b4',
    securityJsCode: 'cae6108ec3dd222f946d1a7237c78be0',
});

interface EmitProps {
    (e: 'update:points', data: string): void;
}
const props = defineProps({
    points: { type: Array, default: () => [] },
});
const emit = defineEmits<EmitProps>();

// 地图拾取的坐标点(经纬度字符串)
const mapPoint = ref('');

const map = ref(null);

const center = ref([106.55, 29.56]);
const marker = ref(null);

/**
 * 地图初始化
 * @param e
 */
const initMap = (e: any) => {
    console.log(e)
    // map = e;
    // const pointStr = mapPoint.value as string;
};
</script>

<style lang="less" scoped>
</style>
