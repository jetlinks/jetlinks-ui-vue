<template>
  <!-- 仪表盘 -->
  <div
    class="echarts-item"
    :style="{ backgroundColor: cardData?.componentProps?.background }"
  >
    <!-- <div class="echarts-item-left">
      <div class="echarts-item-title">{{ data?.componentProps?.name || '--' }}</div>
      <div class="echarts-item-value">{{ topValues[gaugeType] || 0 }} {{ formatter || '%' }}</div>
      <div
        v-if="!!bottom"
        class="echarts-item-bottom"
      >
        {{ bottom }}
      </div>
    </div>
    <div class="echarts-item-right">
      <div
        ref="chartRef"
        style="width: 100%; height: 100px"
      ></div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { wsClient } from '@jetlinks-web/core'
import { map } from 'rxjs/operators'
import * as echarts from 'echarts'
import { topOptionsSeries } from './components/tools'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const formatter = ref()
const max = ref()
const bottom = ref()
const topValues = ref({
  cpu: 0,
  jvm: 0,
  jvmTotal: 0,
  usage: 0,
  usageTotal: 0,
  systemUsage: 0,
  systemUsageTotal: 0
})
const gaugeType = computed(() => {
  return props.data.type
})
const chartRef = ref(null)
let myChart = null
const options = ref({})
const wsRef = ref()

const unSub = () => {
  if (wsRef.value) {
    wsRef.value.unsubscribe()
  }
}
// 获取数据

const getData = () => {
  const id = 'operations-statistics-system-info-realTime'
  const topic = '/dashboard/systemMonitor/stats/info/realTime'
  unSub()

  wsRef.value = wsClient.getWebSocket(id, topic, {
    type: 'all',
    // serverNodeId: serverId.value,
    serverNodeId: '',
    interval: '1s',
    agg: 'avg'
  })
    .pipe(map((res) => res.payload))
    .subscribe((payload) => {
      if (payload?.value) {
        const { cpu, memory, disk } = payload.value
        topValues.value = {
          cpu: cpu.systemUsage,
          jvm: Number(((memory.jvmHeapUsage / 100) * (memory.jvmHeapTotal / 1024)).toFixed(1)),
          jvmTotal: Math.ceil(memory.jvmHeapTotal / 1024),
          usage: Number(((disk.total / 1024) * (disk.usage / 100)).toFixed(1)),
          usageTotal: Math.ceil(disk.total / 1024),
          systemUsage: Number(((memory.systemTotal / 1024) * (memory.systemUsage / 100)).toFixed(1)),
          systemUsageTotal: Math.ceil(memory.systemTotal / 1024)
        }
        switch (gaugeType.value) {
          case 'jvm':
            max.value = topValues.value.jvmTotal
            bottom.value = `总JVM内存:${topValues.value.jvmTotal}`
            break
          case 'cpu':
            max.value = 100
            break
          case 'disk':
            bottom.value = `总磁盘大小:${topValues.value.usageTotal}`
            break
          case 'system':
            bottom.value = `系统内存:${topValues.value.systemUsageTotal}`
            break
        }
        getOptions()
      }
    })
}

function createChart() {
  const chart = chartRef.value
  if (chart && !myChart) {
    myChart = echarts.init(chart)
    myChart.setOption(options.value)
  } else if (myChart) {
    myChart.setOption(options.value)
  }
}

function resize() {
  myChart?.resize()
}
const getOptions = () => {
  let formatterCount = 0
  options.value = {
    series: [
      {
        ...topOptionsSeries,
        max: max.value || 100,
        axisLabel: {
          distance: -22,
          color: 'auto',
          fontSize: 12,
          width: 30,
          padding: [6, 10, 0, 10],
          formatter: (value) => {
            formatterCount += 1
            if ([1, 3, 6, 9, 11].includes(formatterCount)) {
              return value + (formatter.value || '%')
            }
            return ''
          }
        },
        data: [{ value: topValues.value[gaugeType.value] || 0 }]
      }
    ]
  }
  createChart()
  window.addEventListener('resize', resize)
}

// 数据刷新
const refreshManual = () => {
  getData()
}
// 自动刷新
const refreshInterval = () => {
  setInterval(() => {
    refreshManual()
  }, props.data?.componentProps?.auto?.time * 1000)
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

onMounted(() => {
  switch (props.data.type) {
    case 'cpu':
      formatter.value = '%'
      break

    default:
      formatter.value = 'G'
      break
  }
  getData()
  if (props.data?.componentProps?.auto?.value) {
    // refreshInterval()
  }
})
defineExpose({ refreshManual })
</script>

<style lang="less" scoped>
.echarts-item {
  display: flex;
  height: 150px;
  padding: 16px;
  background-color: #fff;
  // box-shadow: 0px 2.73036px 5.46071px rgba(31, 89, 245, 0.2);
  border: 1px solid #e0e4e8;
  border-radius: 2px;
  .echarts-item-left {
    display: flex;
    flex-direction: column;
    width: 45%;
  }

  .echarts-item-right {
    width: 55%;
  }

  .echarts-item-title {
    margin-bottom: 8px;
    color: rgba(#000, 0.6);
    font-size: 16px;
  }

  .echarts-item-value {
    font-weight: bold;
    font-size: 36px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;
    text-overflow: ellipsis;
  }

  .echarts-item-bottom {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    height: 0;
    padding-left: 12px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 12px;
      background-color: #ff595e;
      transform: translateY(-50%);
      content: ' ';
    }
  }
}
</style>
