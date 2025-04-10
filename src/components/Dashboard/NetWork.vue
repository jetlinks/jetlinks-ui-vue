<template>
  <a-spin :spinning="loading">
    <div
      class="dash-board"
      :style="{ backgroundColor: configData.componentProps.background }"
    >
      <div class="header">
        <div class="left">
          <h3 style="width: 80px">{{ configData.title }}</h3>
          <a-radio-group
            button-style="solid"
            v-model:value="data.type"
            @change="changeType"
            v-if="configData.type === 'all'"
          >
            <a-radio-button value="bytesRead">上行</a-radio-button>
            <a-radio-button value="bytesSent">下行</a-radio-button>
          </a-radio-group>
        </div>
        <div class="right">
          <a-radio-group
            default-value="a"
            button-style="solid"
            style="margin-right: 10px"
            v-model:value="data.time.type"
          >
            <a-radio-button value="hour">最近1小时</a-radio-button>
            <a-radio-button value="day">最近24小时</a-radio-button>
            <a-radio-button value="week">近一周</a-radio-button>
          </a-radio-group>
          <a-range-picker
            :allowClear="false"
            :show-time="{ format: 'HH:mm:ss' }"
            format="YYYY-MM-DD HH:mm:ss"
            v-model:value="data.time.time"
            @change="pickerTimeChange"
          >
            <template #suffixIcon><AIcon type="CalendarOutlined" /></template>
          </a-range-picker>
        </div>
      </div>
      <div>
        <j-empty
          v-if="isEmpty"
          style="height: 250px; margin-top: 100px"
        />
        <template v-else>
          <div style="height: 300px">
            <Echarts :options="echartsOptions" />
          </div>

          <ServerList
            v-if="serverOptions.length > 1"
            v-model:value="serverActive"
            :options="serverOptions"
            color="#979AFF"
          />
        </template>
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts" setup name="Network">
import { dashboard } from '@/api/Dashboard/index'
import { getTimeByType, typeDataLine, areaStyle, colorNetwork, networkParams, arrayReverse } from './components/tools'
import dayjs from 'dayjs'
import ServerList from './components/ServerList.vue'
import Echarts from './components/EchartsTime.vue'

const props = defineProps({
  configData: {
    type: Object,
    default: () => ({})
  }
})

const chartRef = ref<Record<string, any>>({})
const loading = ref(false)
const data = ref<any>({
  type: props.configData.type === 'all' ? 'bytesRead' : props.configData.type,
  time: {
    type: props.configData.componentProps.filterTime.value,
    time: [null, null]
  }
})
const paramsConfig = ref()
const isEmpty = ref(false)
const serverActive = ref<string[]>([])
const serverOptions = ref<string[]>([])
const serverData = reactive({
  xAxis: [],
  data: []
})

const pickerTimeChange = (value: any) => {
  data.value.time.type = undefined
  getNetworkEcharts(data.value)
}
const changeType = (value: any) => {
  getNetworkEcharts(data.value)
}
const getNetworkEcharts = async (val: any) => {
  paramsConfig.value = val
  loading.value = true
  const resp: any = await dashboard(networkParams(val))
  if (resp.success) {
    const _networkOptions = {}
    const _networkXAxis = new Set()
    if (resp.result.length) {
      isEmpty.value = false
      const filterArray = resp.result
      filterArray.forEach((item: any) => {
        const value = item.data.value
        const _data: Array<any> = []
        const nodeID = item.data.clusterNodeId
        value.forEach((item: any) => {
          _data.push(item.value)
          _networkXAxis.add(item.timeString)
        })
        _networkOptions[nodeID] = {
          _data: _networkOptions[nodeID] ? _networkOptions[nodeID]._data.concat(_data) : _data
        }
      })
      handleNetworkOptions(_networkOptions, [..._networkXAxis.keys()])
    } else {
      handleNetworkOptions([], [])
      isEmpty.value = true
    }
  }
  setTimeout(() => {
    loading.value = false
  }, 300)
}

const formatterData = (value: any) => {
  let _data = ''
  const kb = 1024
  const mb = kb ** 2
  const gb = kb ** 3

  if (value >= kb && value < mb) {
    _data = `${Number((value / kb).toFixed(2))}KB`
  } else if (value >= mb && value < gb) {
    _data = `${Number((value / mb).toFixed(2))}M`
  } else if (value >= gb) {
    _data = `${Number((value / gb).toFixed(2))}G`
  } else {
    _data = `${value}B`
  }
  return _data
}

const networkValueRender = (obj: any) => {
  // const { value } = obj;
  let data: any = ''
  obj.forEach((item: any, index: number) => {
    const { value } = item
    if (index === 0) {
      data += `${item?.axisValueLabel}<br />${item?.marker}${item?.seriesName} &nbsp; ${formatterData(value)}<br />`
    } else {
      data += `${item?.marker}${item?.seriesName} &nbsp; ${formatterData(value)}<br />`
    }
  })
  return data
  // return `${obj?.axisValueLabel}<br />${obj?.marker}${
  //     obj?.seriesName
  // } &nbsp; ${formatterData(value)}`;
}

const setOptions = (data: any, key: string) => ({
  data: data[key]._data, // .map((item) => Number((item / 1024 / 1024).toFixed(2))),
  name: key,
  type: 'line',
  smooth: true
  // areaStyle,
})

const handleNetworkOptions = (optionsData: any, xAxis: any) => {
  const dataKeys = Object.keys(optionsData)
  serverActive.value = dataKeys
  serverOptions.value = dataKeys
  serverData.xAxis = xAxis
  serverData.data = optionsData
}

const echartsOptions = computed(() => {
  const series = serverActive.value.length
    ? serverActive.value.map((key) => setOptions(serverData.data, key))
    : typeDataLine
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: serverData.xAxis
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (_value: any) => formatterData(_value)
      }
    },
    grid: {
      left: '70px',
      right: data.value.time.type === 'week' ? 50 : 10,
      bottom: '24px',
      top: 24
    },
    tooltip: {
      trigger: 'axis',
      formatter: (_value: any) => networkValueRender(_value)
    },
    color: colorNetwork,
    series: series
  }
})
// 数据刷新
const refreshManual = () => {
  getNetworkEcharts(paramsConfig.value)
}
// 自动刷新
const refreshInterval = () => {
  setInterval(() => {
    refreshManual()
  }, props.configData.componentProps.auto.time * 1000)
}
watch(
  () => data.value.time.type,
  (value) => {
    if (value === undefined) return
    const date = getTimeByType(value)
    data.value.time.time = [dayjs(date), dayjs(new Date())]

    getNetworkEcharts(data.value)
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  if (props.configData.componentProps.auto.value) {
    // refreshInterval()
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
  .left h3 {
    width: 200px;
    margin-top: 8px;
  }
}
.left,
.right {
  display: flex;
  align-items: center;
}
</style>
