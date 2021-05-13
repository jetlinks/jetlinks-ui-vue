<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper">
      <v-chart :force-fit="true" :height="height" :data="dataSource" :padding="[36, 5, 30, 5]">
        <v-tooltip :showTitle="false" :crosshairs="false"/>
        <v-bar position="x*y" :tooltip="tooltip" />
      </v-chart>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
// const data = []
// const beginDay = new Date().getTime()

// for (let i = 0; i < 30; i++) {
//   data.push({
//     x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
//     y: Math.round(Math.random() * 10)
//   })
// }

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
  max: 30
}]

export default {
  name: 'MiniBar',
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
