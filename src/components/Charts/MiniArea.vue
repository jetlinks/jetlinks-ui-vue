<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="dataSource" :padding="[36, 0, 18, 0]">
        <v-tooltip :showTitle="false" :crosshairs="false"/>
        <v-smooth-area position="x*y" :tooltip="tooltip"/>
      </v-chart>
    </div>
  </div>
</template>

<script>
const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]
const scale = [{
  dataKey: 'x',
  min: 2
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 22
}]

export default {
  name: 'MiniArea',
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tooltip,
      scale,
      height: 100
    }
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
