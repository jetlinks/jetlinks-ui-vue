<!-- 可交互时间轴图表 -->
<template>
  <!-- <a-spin :spinning="loading"> -->
  <div
    class="dash-board"
    :style="{ backgroundColor: timeLineConfig?.componentProps?.background }"
  >
    <div class="header">
      <h3>{{ titleObj[chartType] }}</h3>
      <div>
        <!-- <a-radio-group
              default-value="a"
              button-style="solid"
              style="margin-right: 10px"
              v-model:value="data.type"
            >
              <a-radio-button value="hour">最近1小时</a-radio-button>
              <a-radio-button value="day">最近24小时</a-radio-button>
              <a-radio-button value="week">近一周</a-radio-button>
            </a-radio-group> -->
        <a-range-picker
          @change="pickerTimeChange"
          :allowClear="false"
          :show-time="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          v-model:value="data.time"
        ></a-range-picker>
      </div>
    </div>
    <div>
      <j-empty
        v-if="isEmpty"
        style="height: 200px; margin-top: 100px"
      />
      <template v-else>
        <div style="height: 300px">
          <Echarts :options="echartsOptions" />
        </div>

        <ServerList
          v-if="serverOptions.length > 1"
          v-model:value="serverActive"
          :options="serverOptions"
          :color="timeLineConfig.type === 'Jvm' ? colorJvm : colorCpu"
        />
      </template>
    </div>
  </div>
  <!-- </a-spin> -->
</template>

<script lang="ts" setup>
import { dashboard } from '@/api/Dashboard/index'
import dayjs from 'dayjs'
import {
  getTimeByType,
  arrayReverse,
  defaultParamsData,
  typeDataLine,
  areaStyleJvm,
  areaStyleCpu,
  colorCpu,
  colorJvm
} from './components/tools'
import ServerList from './components/ServerList.vue'
import Echarts from './components/EchartsTime.vue'

const props = defineProps({
  timeLineConfig: {
    type: Object,
    default: () => ({})
  }
})
const titleObj: any = {
  jvm: 'JVM内存使用率趋势',
  cpu: 'CPU使用率趋势'
}
const chartRef = ref<Record<string, any>>({})
const loading = ref(false)
const colorConfig = ref([])
const data = ref<any>({
  type: props.timeLineConfig.componentProps.filterTime.value,
  time: [null, null]
})
const isEmpty = ref(false)
const serverActive = ref<string[]>([])
const serverOptions = ref<string[]>([])
const serverData = reactive({
  xAxis: [],
  data: []
})
const chartType = computed(() => {
  return props.timeLineConfig.type === 'Jvm' ? 'jvm' : 'cpu'
})
const pickerTimeChange = () => {
  data.value.type = undefined
  getcharts(data.value)
}

const echartsOptions = computed(() => {
  const series = serverActive.value.length
    ? serverActive.value.map((key) => setOptions(serverData.data, key))
    : typeDataLine
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: arrayReverse(serverData.xAxis)
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: any) => `${value}%`
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      left: '50px',
      right: '50px'
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: data.value.type !== 'hour' ? 5 : 100
      },
      {
        start: 0,
        end: data.value.type !== 'hour' ? 5 : 100
      }
    ],
    color: colorConfig.value,
    series: series
  }
})
const getcharts = async (val: any) => {
  loading.value = true
  const res = await dashboard(defaultParamsData(chartType.value, val))

  if (res.success) {
    const _options = {}
    const _xAxis = new Set()
    if (res.result?.length) {
      isEmpty.value = false
      const filterArray = res.result
      filterArray.forEach((item: any) => {
        const value = item.data.value
        const nodeID = item.data.clusterNodeId
        let _value
        if (props.timeLineConfig.type === 'Cpu') {
          _xAxis.add(dayjs(value.timestamp).format('YYYY-MM-DD HH:mm'))
        } else if (props.timeLineConfig.type === 'Jvm') {
          const memoryJvmHeapFree = value.memoryJvmHeapFree
          const memoryJvmHeapTotal = value.memoryJvmHeapTotal
          _value = (((memoryJvmHeapTotal - memoryJvmHeapFree) / memoryJvmHeapTotal) * 100).toFixed(2)
        }

        if (!_options[nodeID]) {
          _options[nodeID] = []
        }
        if (props.timeLineConfig.type === 'Cpu') {
          _options[nodeID]?.push(Number(value.cpuSystemUsage).toFixed(2))
        } else if (props.timeLineConfig.type === 'Jvm') {
          _xAxis.add(dayjs(value.timestamp).format('YYYY-MM-DD HH:mm'))
          _options[nodeID]?.push(_value)
        }
      })
      handleOptions(_options, [..._xAxis.keys()])
    } else {
      handleOptions([], [])
      isEmpty.value = true
    }
  }
  setTimeout(() => {
    loading.value = false
  }, 300)
}

const setOptions = (optionsData: any, key: string) => ({
  data: arrayReverse(optionsData[key]),
  name: key != 'undefined' ? key : '',
  type: 'line',
  smooth: true,
  symbol: 'none'
  // areaStyle: areaStyleCpu(index),
})

const handleOptions = (optionsData: any, xAxis: any) => {
  const dataKeys = Object.keys(optionsData)
  serverActive.value = dataKeys
  serverOptions.value = dataKeys
  serverData.xAxis = xAxis
  serverData.data = optionsData
}

// 数据刷新
const refreshManual = () => {
  getcharts(data.value)
}
// 自动刷新
const refreshInterval = () => {
  setInterval(() => {
    refreshManual()
  }, props.timeLineConfig.componentProps.auto.time * 1000)
}
watch(
  () => data.value.type,
  (value) => {
    if (value === undefined) return
    const date = getTimeByType(value)
    data.value.time = [dayjs(date), dayjs(new Date())]
    getcharts(data.value)
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  switch (props.timeLineConfig.type) {
    case 'Jvm':
      colorConfig.value = colorJvm

    case 'Cpu':
      colorConfig.value = colorCpu
  }

  if (props.timeLineConfig.componentProps.auto.value) {
    refreshInterval()
  }
})
defineExpose({ refreshManual })
</script>

<style lang="less" scoped>
.dash-board {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  // box-shadow: 0px 2.73036px 5.46071px rgba(31, 89, 245, 0.2);
  border-radius: 2px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    width: 200px;
    margin-top: 8px;
  }
}
</style>
