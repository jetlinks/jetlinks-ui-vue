<template>
    <GoogleMap
        :api-key="googleMapApiKey"
        style="width: 100%; height: 100%"
        :center="position"
        :zoom="15"
        @click="handleMapClick"
    >
        <Marker :options="{ position }" />
    </GoogleMap>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { useSystem } from '@/store/system';
const system = useSystem();

// type IPosition = { lat: number; lng: number };
const configInfo = system.configInfo;

const googleMapApiKey = ref();

const defaultPosition = { lat: 116.4074, lng: 39.9042 };
const position = ref(defaultPosition);

const handleMapClick = (e: any) => {
    const currentPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    position.value = currentPosition;
};
onMounted(() => {
    googleMapApiKey.value = configInfo.amap?.apiKey;
});
</script>
<style scoped></style>
