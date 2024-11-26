<template>
    <div style="width: 100%; height: 500px;position: relative">
      <div class="loading" v-if="loading.value">
        <a-spin :spinning="loading.value" size="large" tip="点位加载中..." />
      </div>
      <AmapComponent @init="onMapInit">
        <el-amap-marker-cluster
          :points="deviceList"
          :extraOptions="extraOptions"
          @click="onClick"
        />
      </AmapComponent>
    </div>
</template>

<script lang="ts" setup name="DashBoardMap">
import AmapComponent from 'components/AMapComponent/AMap.vue';
import {ElAmapMarkerCluster} from "@vuemap/vue-amap";
import {getCenterPoint} from "@/utils/map";
import { EventSourcePolyfill } from 'event-source-polyfill';
import {BASE_API_PATH, TOKEN_KEY} from "@/utils/variable";
import {LocalStore} from "@/utils/comm";

const deviceList = ref([])
const _pageSize = 5000
const loading = reactive({
  value: false,
  schedule: 0
})

let map
let source

const extraOptions = {
  gridSize: 10,
  renderClusterMarker(context) {
    const div = document.createElement('div');
    const Hue = 180 - 0.9 * 180;
    const bgColor = 'hsla(' + Hue + ',100%,40%,0.7)';
    const fontColor = 'hsla(' + Hue + ',100%,90%,1)';
    const borderColor = 'hsla(' + Hue + ',100%,40%,1)';
    const shadowColor = 'hsla(' + Hue + ',100%,90%,1)';
    div.style.backgroundColor = bgColor;
    const size = 44;
    div.style.width = div.style.height = size + 'px';
    div.style.border = 'solid 1px ' + borderColor;
    div.style.borderRadius = size / 2 + 'px';
    div.style.boxShadow = '0 0 5px ' + shadowColor;
    div.innerHTML = context.count;
    div.style.lineHeight = size + 'px';
    div.style.color = fontColor;
    div.style.fontSize = '14px';
    div.style.textAlign = 'center';
    context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
    context.marker.setContent(div)
  }, // 自定义聚合点样式
  renderMarker(context) {
    context.marker.setContent(`
      <div class="device-dashboard-marker-content">
        <span class="device-dashboard-marker-label">${context.data[0].label}</span>
        <img src="/images/marker.png" style="height: 34px; width:25px" />
      </div>
    `)
    context.marker.setAnchor('bottom-center')
    context.marker.setOffset(new AMap.Pixel(0, 3))
    // context.marker.setIcon(icon)
  }, // 自定义非聚合点样式
}

const queryDeviceGeoJson = async () => {
  source = new EventSourcePolyfill(
    `${BASE_API_PATH}/geo/object/device/_search/geo.json?:X_Access_Token=${LocalStore.get(
      TOKEN_KEY,
    )}&filter.paging=false`
  )

  source.onmessage = (e: any) => {
    const result = JSON.parse(e.data);
    const features = result.features
    const arr = []
    if (!loading.value) {
      loading.value = true
      loading.schedule = 0
    }
    features.forEach(item => {
      arr.push({
        lnglat: item.geometry.coordinates,
        label: item.properties.deviceName
      })
    })
    deviceList.value.push(...arr)
  }

  source.onerror = (e) => {
    console.log('[event source error] > ', e)
    source.close();
    loading.value = false
  };

}

const onClick = ({ clusterData }) => {
  if (clusterData.length <=1) {
    return
  }

  const [ northEast, southWest] = getCenterPoint(clusterData.map(item => {
    return [item.lnglat.lng, item.lnglat.lat]
  }))

  const bounds = new AMap.Bounds(
    new AMap.LngLat(northEast[0], northEast[1]),
    new AMap.LngLat(southWest[0], southWest[1]),
  )

  const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds,  [10, 10, 10, 10],19)
  map.setZoomAndCenter(zoom, center)
}

const onMapInit = (instance) => {
  if (!map) {
    map = instance
  }
}

queryDeviceGeoJson()
</script>
<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  z-index: 9999;
}
</style>
<style lang="less">
.device-dashboard-marker-content {
  position: relative;

  .device-dashboard-marker-label {
    position: absolute;
    transform: translate(-50%, -120%);
    left: 50%;
    top: 0;
    background-color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    box-shadow: 0 0 16px rgba(0, 0, 0, .2);
    width: 120px;
    display: -webkit-box;
    text-align: center;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-break: break-all;
    overflow: hidden;
    vertical-align: bottom;
  }
}
</style>
