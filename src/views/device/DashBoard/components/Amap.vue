<template>
    <div style="width: 100%; height: 400px">
        <AmapComponent>
            <el-amap-label-marker
                v-for="i in point"
                :key="i"
                :position="i.geometry.coordinates"
                :text="{
                    content: i.properties.deviceName,
                    direction: 'right',
                    style: {
                        fontSize: 15,
                        fillColor: '#fff',
                        strokeColor: 'rgba(255,0,0,0.5)',
                        strokeWidth: 2,
                        padding: [3, 10],
                        backgroundColor: 'yellow',
                        borderColor: '#ccc',
                        borderWidth: 3,
                    },
                }"
                :icon="{
                    image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
                    anchor: 'bottom-center',
                    size: [25, 34],
                    clipOrigin: [459, 92],
                    clipSize: [50, 68],
                }"
                ></el-amap-label-marker
            >
        </AmapComponent>
    </div>
</template>

<script lang="ts" setup>
import AmapComponent from '@/components/AMapComponent/index.vue';
import { getGo } from '@/api/device/dashboard';
let point = ref();
const getMapData = async () => {
    const res = await getGo({
    filter:{
        paging:false
    }
});
    point.value = res.result?.features;
};
getMapData();
</script>
<style scoped>
</style>