<template>
  <div class="region-map">
    <AMapComponent @init="initMap"/>
    <div class="region-map-loading" v-if="_loading || loading">
      <a-spin :spinning="_loading || loading"></a-spin>
    </div>
  </div>
</template>

<script name="RegionMap" setup>
const props = defineProps({
  selectCode: {
    type: String,
    default: undefined
  },
})

const MapRef = ref()
const loading = ref(true)
const _loading = ref(true)
let polygon = null
let district = null
const initMap = (e) => {
  loading.value = true
  MapRef.value = e
  loading.value = false
}

const queryBounds = (code) => {
  _loading.value = true
  if (!district) {
    //实例化DistrictSearch
    const opts = {
      subdistrict: 0,
      extensions: 'all',
      level: 'district'
    };
    district = new AMap.DistrictSearch(opts);
  }
  district.search(code, function (status, result) {
    if (polygon) {
      MapRef.value.remove(polygon)// 清除上次结果
      polygon = null;
    }
    const bounds = result?.districtList?.[0]?.boundaries;
    if (bounds) {
      //生成行政区划polygon
      for (let i = 0; i < bounds.length; i += 1) {// 构造MultiPolygon的path
        bounds[i] = [bounds[i]]
      }
      polygon = new AMap.Polygon({
        strokeWeight: 1,
        path: bounds,
        fillOpacity: 0.4,
        fillColor: '#80d8ff',
        strokeColor: '#0091ea'
      });
      MapRef.value.add(polygon)
      MapRef.value.setFitView(polygon);// 视口自适应
    }
    _loading.value = false
  });
}

watch(() => [props.selectCode, loading.value], () => {
  if (props.selectCode && !loading.value) {
    queryBounds(String(props.selectCode).padEnd(6, '0'))
  }
}, {immediate: true})

</script>

<style lang="less" scoped>
.region-map {
  position: relative;
  height: 100%;

  .region-map-loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: yellow;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(#000, 0.35);
  }
}
</style>
