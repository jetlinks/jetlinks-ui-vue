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
        <j-empty v-else description="请配置高德地图key" style="padding: 20%" />
    </div>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType } from 'vue';
import { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
import { getAMapUiPromise } from './utils';
import { useSystemStore } from '@/store/system';

const emit = defineEmits(['init']);

const system = useSystemStore();
interface AMapProps {
    style?: CSSProperties;
    class?: string;
    AMapUI?: string | boolean;
}
const amapKey = computed(() => system.systemInfo.amap?.apiKey)
const secretKey = computed(() => system.systemInfo.amap?.secretKey);


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
  if (mapInstance) {
    mapInstance.setBounds(bounds)
  }
}

watch(() => amapKey.value, () => {
  initAMapApiLoader({
    key: amapKey.value,
    securityJsCode: secretKey.value,
    plugins: ['AMap.DistrictSearch', 'AMap.GeoJSON'],
  });
}, { immediate: true })

defineExpose({
  setBounds
})
</script>

<style lang="less" scoped></style>
