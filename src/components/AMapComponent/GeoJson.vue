<template>

</template>

<script setup>
import { useMap } from './useMap'
import { maxBy, minBy } from 'lodash-es'

defineOptions({
  name: 'GeoJson'
})

const props = defineProps({
  geo: {
    type: Object,
    default: undefined
  },
  view: {
    type: Boolean,
    default: true
  },
})

const instance = useMap()

let geoJsonLayer

const remove = () => {
  if (geoJsonLayer) {
    instance.$amapComponent.remove(geoJsonLayer)
    geoJsonLayer = null
  }
}
const drawBounds = () => {
  remove()

  if (!props.geo) return

  geoJsonLayer = new AMap.GeoJSON({
    geoJSON: props.geo,
    getPolygon: (geojson, lnglats) => {
      return new AMap.Polygon({
        path: lnglats,
        fillOpacity: 0.25,// 面积越大透明度越高
        strokeColor: '#0091ea',
        fillColor: '#80d8ff'
      });
    }
  })

  instance.$amapComponent.add(geoJsonLayer)

  if (props.view) {

    const points = props.geo.features.reduce((prev, next) => {
      const coordinates = next.geometry.coordinates
      prev.push(...coordinates[0])
      return prev
    }, [])

    if (points.length) {
      const maxLng = maxBy(points, (e) => e[0])[0]
      const maxLat = maxBy(points, (e) => e[1])[1]
      const minLng = minBy(points, (e) => e[0])[0]
      const minLat = minBy(points, (e) => e[1])[1]
      const southWest = new AMap.LngLat(maxLng, maxLat)
      const northEast = new AMap.LngLat(minLng, minLat)
      const bounds = new AMap.Bounds(southWest, northEast)
      instance.$amapComponent.setBounds(bounds)
    }
  }
}

onBeforeUnmount(() => {
  remove()
})

watch(() => JSON.stringify(props.geo), () =>{
  drawBounds()
}, { immediate: true })

</script>

<style scoped>

</style>
