<template>
  <v-chart :force-fit="true" :height="height" :data="GetData" :scale="scale" :padding="[26, 0, 0, 0]">
    <v-coord
      :force-fit="true"
      type="polar"
      :startAngle="-202.5"
      :endAngle="22.5"
      :radius="0.75"
    ></v-coord>
    <v-axis dataKey="1" :show="false"></v-axis>
    <v-axis
      dataKey="value"
      :zIndex="2"
      :line="null"
      :label="axisLabel"
    ></v-axis>
    <v-series
      gemo="point"
      position="value*1"
      shape="pointer"
      color="#1890FF"
      :active="false"
    ></v-series>
    <!-- 仪表盘---刻度层 -->
    <v-guide
      type="arc"
      :zIndex="0"
      :start="arcGuide1Start"
      :end="arcGuide1End"
      :vStyle="arcGuide1Style"
    ></v-guide>
    <!-- 仪表盘---进度条层 -->
    <template v-if="warnLevel.length > 0">
      <v-guide
        v-if="showData >= warnLevel[0]"
        type="arc"
        :zIndex="1"
        :start="[0, 0.965]"
        :end="[showData, 0.965]"
        :vStyle="{ // 底灰色
          stroke: warnColor[0],
          lineWidth: 10,
        }"
      ></v-guide>
      <v-guide
        v-if="showData >= warnLevel[1]"
        type="arc"
        :zIndex="1"
        :start="[warnLevel[0], 0.965]"
        :end="[warnLevel[1], 0.965]"
        :vStyle="{ // 底灰色
          stroke: warnColor[1],
          lineWidth: 10,
        }"
      ></v-guide>
      <v-guide
        v-if="showData >= warnLevel[1] && showData <= warnLevel[2]"
        type="arc"
        :zIndex="1"
        :start="[warnLevel[1], 0.965]"
        :end="[showData, 0.965]"
        :vStyle="{ // 底灰色
          stroke: warnColor[2],
          lineWidth: 10,
        }"
      ></v-guide>
      <v-guide
        v-if="showData >= warnLevel[0] && showData < warnLevel[1]"
        type="arc"
        :zIndex="1"
        :start="[warnLevel[0], 0.965]"
        :end="[showData, 0.965]"
        :vStyle="{ // 底灰色
          stroke: warnColor[1],
          lineWidth: 10,
        }"
      ></v-guide>
      <v-guide
        v-if="showData < warnLevel[0]"
        type="arc"
        :zIndex="1"
        :start="[0, 0.965]"
        :end="[showData, 0.965]"
        :vStyle="{ // 底灰色
          stroke: warnColor[0],
          lineWidth: 10,
        }"
      ></v-guide>
    </template>
    <template v-else>
      <v-guide
        type="arc"
        :zIndex="1"
        :start="[0, 0.965]"
        :end="[showData, 0.965]"
        :vStyle="{ // 底灰色
          stroke: warnColor[0],
          lineWidth: 10,
        }"
      ></v-guide>
    </template>
    <v-guide
      type="html"
      :position="htmlGuidePosition"
      :html="htmlGuideHtml"
    ></v-guide>
  </v-chart>
</template>

<script>
import { registerShape } from 'viser-vue'

registerShape('point', 'pointer', {
  draw (cfg, container) {
    let point = cfg.points[0]
    point = this.parsePoint(point)
    const center = this.parsePoint({
      x: 0,
      y: 0
    })
    container.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2,
        lineCap: 'round'
      }
    })
    return container.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 6,
        stroke: cfg.color,
        lineWidth: 3,
        fill: '#fff'
      }
    })
  }
})

const scale = [{
  dataKey: 'value',
  min: 0,
  max: 10,
  tickInterval: 1,
  nice: false
}]

export default {
  props: {
    height: {
      type: Number,
      default: 200
    },
    dashboardMax: {
      type: Number,
      default: 10
    },
    warnLevel: {
      type: Array,
      default: () => []
    },
    warnColor: {
      type: Array,
      default: () => ['#4ECB73', '#FFBF00', '#F5222D']
    },
    showData: {
      type: Number,
      default: 0
    },
    dataUnit: {
      type: String,
      default: '%'
    }

  },
  data () {
    const _max = { max: this.dashboardMax }
    const dashboardmax = this.dashboardMax
    const dataunit = this.dataUnit
    // :data="{'value': showData}"
    const showdata = this.showData
    return {
      scale: [ { ...scale[0], ..._max } ],
      axisLabel: {
        offset: -12,
        textStyle: {
          fontSize: 12,
          textAlign: 'center',
          fill: 'rgba(0, 0, 0, 0.65)'
        }
      },
      axisSubTickLine: {
        length: -8,
        stroke: '#fff',
        strokeOpacity: 1
      },
      axisTickLine: {
        length: -17,
        stroke: '#fff',
        strokeOpacity: 1
      },
      arcGuide1Start: [0, 0.965],
      arcGuide1End: [dashboardmax, 0.965],
      arcGuide1Style: { // 底灰色
        stroke: 'rgba(0, 0, 0, 0.09)',
        lineWidth: 10
      },
      htmlGuidePosition: ['50%', '95%'],
      htmlGuideHtml: `
        <div style="width: 300px;text-align: center;font-size: 12px!important;">
          <p style="font-size: 24px;color: rgba(0,0,0,0.85);margin: 0;">
            ${(showdata)}${dataunit}
          </p>
        </div>`
    }
  },
  computed: {
    GetData () {
      return [{ value: this.showData }]
    }
  }
}
</script>
