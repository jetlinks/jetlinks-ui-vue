<template>
    <div style="width: 100%; height: 400px;position: relative">
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
import {getDeviceGeoJson} from '@/api/device/dashboard';
import {ElAmapMarkerCluster} from "@vuemap/vue-amap";

const deviceList = ref([])
const _pageSize = 5000
const loading = reactive({
  value: false
})

let map


const extraOptions = {
  gridSize: 60, // 设置网格像素大小
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
    // context.marker.setIcon(icon)
  }, // 自定义非聚合点样式
}

const queryDeviceGeoJson = async (pageIndex: number, pageSize = _pageSize) => {

  if (!loading.value) {
    loading.value = true
  }

  const res = await getDeviceGeoJson({
    filter: {
      pageSize,
      pageIndex,
      terms: []
    }
  })

  if (res.success) {
    const { data: list, pageIndex: _index, total} = res.result
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      deviceList.value.push({
        lnglat: [item.point.lon, item.point.lat],
        label: item.tags.deviceName
      })
    }

    const currentTotal = (_index + 1 ) * _pageSize // 当前累积总数
    const remaining = total - currentTotal // 剩余数量

    if (remaining > 0) {
      setTimeout(() => {
        queryDeviceGeoJson(pageIndex + 1, remaining >= _pageSize ? _pageSize : remaining)
      }, 10)
    } else {
      loading.value = false
    }
  }
}

const onClick = ({ clusterData, markers }) => {
  if (clusterData.length <=1) {
    return
  }

  let allLng = 0
  let allLat = 0

  for (const item of clusterData) {
    allLng += item.lnglat.lng
    allLat += item.lnglat.lat
  }

  const lat = allLat / clusterData.length
  const lng = allLng / clusterData.length

  map.setZoom(map.getZoom() + 2, [lng, lat])
}

const onMapInit = (instance) => {
  if (!map) {
    map = instance
  }
}

queryDeviceGeoJson(0)
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
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-break: break-all;
    overflow: hidden;
    vertical-align: bottom;
  }
}
</style>
