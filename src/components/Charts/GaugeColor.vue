<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :animate="true">
      <v-coord type="polar" :startAngle="-202.5" :endAngle="22.5" :radius="0.9"></v-coord>
      <v-axis
        data-key="value"
        :zIndex="2"
        :line="null"
        :label="axisLabel"
        :subTickCount="4"
        :subTickLine="axisSubTickLine"
        :tickLine="axisTickLine"
        :grid="null"
      ></v-axis>
      <v-axis data-key="1" :show="false"></v-axis>
      <v-series gemo="point" position="value*1" shape="pointer" color="#8C8C8C" :active="false"></v-series>
      <v-guide
        type="arc"
        :zIndex="0"
        :top="false"
        :start="arcGuideBgStart"
        :end="arcGuideBgEnd"
        :vStyle="arcGuideBgStyle"
      ></v-guide>
      <v-guide
        v-for="(item, i) in color"
        :key="i"
        type="arc"
        :zIndex="1"
        :start="[color.length * scale[0].tickInterval * i, 0.945]"
        :end="[Math.max(color.length * scale[0].tickInterval * i, Math.min(color.length * scale[0].tickInterval * (i + 1), data[0].value)), 0.945]"
        :vStyle="{ stroke: item, lineWidth: 10}"
      ></v-guide>
      <v-guide type="html" :position="htmlGuidePosition" :html="htmlGuideHtml"></v-guide>
    </v-chart>
  </div>
</template>

<script>
import { registerShape } from 'viser-vue'

registerShape('point', 'pointer', {
  draw (cfg, container) {
    let point = cfg.points[0] // 获取第一个标记点
    point = this.parsePoint(point)
    const center = this.parsePoint({
      // 获取极坐标系下画布中心点
      x: 0,
      y: 0
    })
    // 绘制指针
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

const _data = [{ value: 5.6 }]

const _scale = [
  {
    dataKey: 'value',
    min: 0,
    max: 10,
    tickInterval: 1,
    nice: false
  }
]

const _color = ['#0086FA', '#FFBF00', '#F5222D']

export default {
  name: 'GaugeColor',
  props: {
    height: {
      type: Number,
      default: 400
    },
    scale: {
      type: Array,
      default: _scale
    },
    color: {
      type: Array,
      default: _color
    },
    data: {
      type: Array,
      default: _data
    }
  },
  data () {
    return {
      axisLabel: {
        offset: -10,
        textStyle: {
          fontSize: 14,
          textAlign: 'center',
          textBaseline: 'middle'
        }
      },
      axisSubTickLine: {
        length: 2,
        stroke: '#ccc',
        strokeOpacity: 0
      },
      axisTickLine: {
        length: 3,
        stroke: '#999',
        strokeOpacity: 1
      },
      arcGuideBgStart: [this.scale[0].min, 0.945],
      arcGuideBgEnd: [this.scale[0].max, 0.945],
      arcGuideBgStyle: {
        stroke: '#e5e5e5',
        lineWidth: 10
      },
      htmlGuidePosition: ['50%', '80%'],
      htmlGuideHtml: `
        <div style="width: 300px;text-align: center;">
          <p style="font-size: 22px;color: #545454;margin: 0;">${this.data[0].value * 10}%</p>
        </div>
      `
    }
  }
}
</script>
