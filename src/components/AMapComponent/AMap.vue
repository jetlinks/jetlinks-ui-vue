<template>
    <div
        :style="props.style || { width: '100%', height: '100%' }"
        :class="props.class"
    >
        <el-amap v-if="amapKey" :zooms="[3, 20]" @init="initMap" ref="mapRef">
            <template v-if="isOpenUi">
                <template v-if="uiLoading">
                    <slot></slot>
                </template>
            </template>
            <template v-else><slot></slot></template>
        </el-amap>
        <JEmpty v-else description="请配置高德地图key" style="padding: 20%" />
    </div>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType } from 'vue';
import AMap, { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
import { getAMapUiPromise } from './utils';
import { useSystem } from '@/store/system';

const emit = defineEmits(['init']);

const system = useSystem();
interface AMapProps {
    style?: CSSProperties;
    class?: string;
    AMapUI?: string | boolean;
}
const amapKey = system.$state.configInfo.amap?.apiKey;
const secretKey = system.$state.configInfo.amap?.secretKey;

initAMapApiLoader({
    key: amapKey,
    securityJsCode: secretKey,
    plugins: ['AMap.DistrictSearch', 'AMap.GeoJSON'],
});

const props = defineProps({
    style: Object as PropType<AMapProps['style']>,
    class: String as PropType<AMapProps['class']>,
    AMapUI: [String, Boolean],
    center: Array,
});

const mapRef = ref();

const uiLoading = ref<boolean>(false);

let mapInstance:any = null;

const isOpenUi = computed(() => {
    return 'AMapUI' in props || props.AMapUI;
});

const getAMapUI = () => {
    const version = typeof props.AMapUI === 'string' ? props.AMapUI : '1.1';
    getAMapUiPromise(version).then(() => {
        uiLoading.value = true;
    });
};

const marker = ref<any[]>([]);

const initMap = (e: any) => {
    mapInstance = e;
    if (isOpenUi.value) {
        getAMapUI();
    }
    emit('init', e);
};

const setBounds = (bounds: any) => {
  console.log(bounds)
  if (mapInstance) {
    mapInstance.setBounds(bounds)
  }
}

onMounted(()=>{
    console.log(secretKey,'secretKey')
})

defineExpose({
  setBounds
})
</script>

<style lang="less" scoped></style>
