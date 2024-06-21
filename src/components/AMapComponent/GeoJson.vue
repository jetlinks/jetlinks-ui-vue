<template>

</template>

<script setup>
import { useMap } from './useMap'

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

  console.log('drawBounds', props.geo)
  geoJsonLayer = new AMap.GeoJSON({
    geoJSON: props.geo
  })

  instance.$amapComponent.add(geoJsonLayer)

  if (props.view) {
    // const points = props.geo.features.reduce((prev, next) => {
    //   const coordinates = next.geometry.coordinates[0]
    //   console.log(coordinates[0])
    //   prev.push(...coordinates[0])
    //   return prev
    // }, [])
    //
    // console.log(points)
    // const bounds = new AMap.Bounds(points)
    // instance.$amapComponent.setBounds(bounds)
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
