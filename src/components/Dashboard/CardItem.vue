<template>
  <div
    class="top-card"
    :style="{ backgroundColor: data.componentProps.background }"
  >
    <div class="top-card-content">
      <div class="content-left">
        <div class="content-left-title">
          <j-ellipsis>{{ data.componentProps.name || '--' }}</j-ellipsis>
          <!-- <j-tooltip
            placement="top"
            v-if="tooltip"
          >
            <template #title>
              <span>{{ tooltip }}</span>
            </template>
            <AIcon type="QuestionCircleOutlined" />
          </j-tooltip> -->
        </div>
        <div class="content-left-value">{{ totalData }}</div>
      </div>
      <div
        class="content-right"
        v-if="img"
      >
        <img
          :src="getImageUrl(imgUrl || '')"
          :style="{ width: ['collectPoints', 'collectorNum', 'channels'].includes(data.type) ? '120px' : '' }"
        />
      </div>
      <div
        class="content-right-echart"
        v-else
      >
        <Charts
          :options="trendData"
          style="width: 100%; height: 100%"
        ></Charts>
      </div>
    </div>
    <div
      class="top-card-footer"
      v-if="data.componentProps.filterType.value === 'all'"
    >
      <!-- {{ footerData }} -->
      <template
        v-for="(item, index) in footerData"
        :key="index"
        v-if="footerData.length"
      >
        <!-- {{ item }} -->
        <span v-if="!item?.status">{{ item?.label }}</span>
        <a-badge
          v-else
          :text="item.label"
          :status="item.status"
        />
        <div class="footer-item-value">{{ item?.value }}</div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  productCount,
  deviceCount,
  channelCount,
  collectorCount,
  collectorPoints,
  videoDevicesNum,
  alarmNum,
  trendData_api
} from '@/api/Dashboard/index'
import { getImageUrl } from '@/utils/comm'
import dayjs from 'dayjs'
import Charts from './components/Charts.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const actionName = ref('')
const cardType = computed(() => {
  return props.data.componentProps.filterType.value
})
const intervalId = ref()
const img = ref(true)
const imgUrl = computed(() => {
  switch (props.data.type) {
    case 'product':
      return 'localhost/device/device-product.svg'
    case 'device':
      return 'localhost/device/device-number.svg'
    case 'channels':
      return 'localhost/dataCollect/channel.png'
    case 'collectorNum':
      return 'localhost/dataCollect/collector.png'
    case 'collectPoints':
      return 'localhost/dataCollect/point.png'
    case 'alarm':
      return 'localhost/device/device-number.svg'
    default:
      img.value = false
      return undefined
  }
})
const totalData = ref(0)
const footerData = ref([])
const trendData = ref([])
const action = {
  /**
   * 获取产品数量
   */
  getProductData() {
    const typeParams: any = {
      all: {},
      normal: {
        terms: [
          {
            column: 'state',
            value: '1'
          }
        ]
      },
      disable: {
        terms: [
          {
            column: 'state',
            value: '0'
          }
        ]
      }
    }

    productCount(typeParams[cardType.value]).then((res) => {
      if (res.success) {
        totalData.value = res.result
      }
    })

    if (cardType.value === 'all') {
      productCount(typeParams.normal)
        .then((res) => {
          if (res.success) {
            footerData.value[0] = {
              label: '正常',
              value: res.result,
              status: 'success'
            }
          }
        })
        .catch(() => {
          footerData.value[0] = {
            label: '正常',
            value: 0,
            status: 'success'
          }
        })
      productCount(typeParams.disable)
        .then((res) => {
          if (res.success) {
            footerData.value[1] = {
              label: '禁用',
              value: res.result,
              status: 'error'
            }
          }
        })
        .catch(() => {
          footerData.value[1] = {
            label: '禁用',
            value: 0,
            status: 'error'
          }
        })
    }
  },
  /**
   * 获取设备数量
   */
  getDeviceData() {
    const typeParams: any = {
      all: {},
      online: {
        terms: [
          {
            column: 'state',
            termType: 'eq',
            value: 'online'
          }
        ]
      },
      offline: {
        terms: [
          {
            column: 'state',
            termType: 'eq',
            value: 'offline'
          }
        ]
      }
    }

    deviceCount(typeParams[cardType.value]).then((res) => {
      if (res.success) {
        totalData.value = res.result
      }
    })
    if (cardType.value === 'all') {
      deviceCount(typeParams.online)
        .then((res) => {
          if (res.success) {
            footerData.value[0] = {
              label: '在线',
              value: res.result,
              status: 'success'
            }
          }
        })
        .catch(() => {
          footerData.value[0] = {
            label: '在线',
            value: 0,
            status: 'success'
          }
        })
      deviceCount(typeParams.offline)
        .then((res) => {
          if (res.success) {
            footerData.value[1] = {
              label: '离线',
              value: res.result,
              status: 'error'
            }
          }
        })
        .catch(() => {
          footerData.value[1] = {
            label: '离线',
            value: 0,
            status: 'error'
          }
        })
    }
  },
  /**
   * 获取在线数量
   */
  getOnline() {
    const startTime = dayjs().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    trendData_api([
      {
        dashboard: 'device',
        object: 'session',
        measurement: 'online',
        dimension: 'agg',
        group: 'aggOnline',
        params: {
          state: 'online',
          limit: 24,
          from: startTime,
          to: endTime,
          time: '1h',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      }
    ]).then((res) => {
      if (res.success) {
        const x: string[] = []
        const y: number[] = []
        ;(res.result as any)?.forEach((item: any) => {
          x.push(item.data.timeString)
          y.push(item.data.value)
        })
        x.reverse()
        const onlineYdata = y
        onlineYdata.reverse()
        trendData.value = setChartOptions(x, onlineYdata, '在线数', '#D3ADF7')
      }
    })
    // // 今日在线
    deviceCount({
      terms: [
        {
          column: 'state',
          termType: 'eq',
          value: 'online'
        }
      ]
    }).then((res) => {
      if (res.success) {
        totalData.value = res.result
      }
    })

    if (cardType.value === 'all') {
      // 昨日在线
      getYesterdayOnline()
    }
  },

  // 获取采集器通道数量
  getChannelsNum() {
    const typeParams: any = {
      all: {},
      normal: {
        terms: [
          {
            column: 'runningState',
            termType: 'eq',
            value: 'running'
          }
        ]
      },
      disable: {
        terms: [
          {
            column: 'runningState',
            termType: 'not',
            value: 'running'
          }
        ]
      }
    }

    channelCount(typeParams[cardType.value]).then((res) => {
      if (res.success) {
        totalData.value = res.result
      }
    })

    if (cardType.value === 'all') {
      // 正常通道
      channelCount(typeParams.normal)
        .then((res) => {
          if (res.success) {
            footerData.value[0] = {
              label: '正常',
              value: res.result,
              status: 'success'
            }
          }
        })
        .catch(() => {
          footerData.value[0] = {
            label: '正常',
            value: 0,
            status: 'success'
          }
        })
      // 异常通道
      channelCount(typeParams.disable)
        .then((res) => {
          if (res.success) {
            footerData.value[1] = {
              label: '异常',
              value: res.result,
              status: 'error'
            }
          }
        })
        .catch(() => {
          footerData.value[1] = {
            label: '异常',
            value: 0,
            status: 'error'
          }
        })
    }
  },

  // 采集器数量
  getCollectorNum() {
    const typeParams: any = {
      all: {},
      normal: {
        terms: [
          {
            column: 'runningState',
            termType: 'eq',
            value: 'running'
          }
        ]
      },
      disable: {
        terms: [
          {
            column: 'runningState',
            termType: 'not',
            value: 'running'
          }
        ]
      }
    }

    collectorCount(typeParams[cardType.value]).then((res) => {
      totalData.value = res.result
    })
    if (cardType.value === 'all') {
      // 正常数量
      collectorCount(typeParams.normal)
        .then((res) => {
          if (res.success) {
            footerData.value[0] = {
              label: '正常',
              value: res.result,
              status: 'success'
            }
          }
        })
        .catch(() => {
          footerData.value[0] = {
            label: '正常',
            value: 0,
            status: 'success'
          }
        })
      // 异常数量
      collectorCount(typeParams.disable)
        .then((res) => {
          if (res.success) {
            footerData.value[1] = {
              label: '异常',
              value: res.result,
              status: 'error'
            }
          }
        })
        .catch(() => {
          footerData.value[1] = {
            label: '异常',
            value: 0,
            status: 'error'
          }
        })
    }
  },
  // 采集点位
  getPointNum() {
    const typeParams: any = {
      all: {},
      normal: {
        terms: [
          {
            column: 'runningState',
            termType: 'eq',
            value: 'running'
          }
        ]
      },
      disable: {
        terms: [
          {
            column: 'runningState',
            termType: 'not',
            value: 'running'
          }
        ]
      }
    }

    collectorPoints(typeParams[cardType.value]).then((res) => {
      totalData.value = res.result
    })
    if (cardType.value === 'all') {
      // 正常点位
      collectorPoints(typeParams.normal)
        .then((res) => {
          if (res.success) {
            footerData.value[0] = {
              label: '正常点位',
              value: res.result,
              status: 'success'
            }
          }
        })
        .catch(() => {
          footerData.value[0] = {
            label: '正常点位',
            value: 0,
            status: 'success'
          }
        })
      // 异常点位
      collectorPoints(typeParams.disable)
        .then((res) => {
          if (res.success) {
            footerData.value[1] = {
              label: '异常点位',
              value: res.result,
              status: 'error'
            }
          }
        })
        .catch(() => {
          footerData.value[2] = {
            label: '异常点位',
            value: 0,
            status: 'error'
          }
        })
    }
  },
  // 视频设备数量
  getVideoDevicesNum() {
    const typeParams: any = {
      all: {},
      online: {
        terms: [
          {
            column: 'state',
            termType: 'eq',
            value: 'online'
          }
        ]
      },
      offline: {
        terms: [
          {
            column: 'state',
            termType: 'eq',
            value: 'offline'
          }
        ]
      }
    }
    videoDevicesNum(typeParams[cardType.value]).then((res) => {
      totalData.value = res.result
    })
    if (cardType.value === 'all') {
      // 在线
      videoDevicesNum(typeParams.online).then((res) => {
        if (res.success) {
          footerData.value[0] = {
            label: '在线',
            value: res.result,
            status: 'success'
          }
        }
      })

      videoDevicesNum(typeParams.offline).then((res) => {
        if (res.success) {
          footerData.value[1] = {
            label: '离线',
            value: res.result,
            status: 'error'
          }
        }
      })
    }
  },
  // 告警配置
  getAlarmNum() {
    const typeParams: any = {
      all: {},
      normal: {
        terms: [
          {
            column: 'state',
            value: 'enabled'
          }
        ]
      },
      disable: {
        terms: [
          {
            column: 'state',
            value: 'disabled'
          }
        ]
      }
    }
    alarmNum(typeParams[cardType.value]).then((res) => {
      if (res.success) {
        totalData.value = res.result
      }
    })
    if (cardType.value === 'all') {
      alarmNum(typeParams.normal).then((res) => {
        if (res.success) {
          footerData.value[0] = {
            label: '正常',
            value: res.result,
            status: 'success'
          }
        }
      })
      alarmNum(typeParams.disable).then((res) => {
        if (res.success) {
          footerData.value[1] = {
            label: '禁用',
            value: res.result,
            status: 'error'
          }
        }
      })
    }
  },
  getTodayAlarmNum() {
    const startTime = dayjs().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    // 告警趋势
    trendData_api([
      {
        dashboard: 'alarm',
        object: 'record',
        measurement: 'trend',
        dimension: 'agg',
        group: 'today',
        params: {
          time: '1d',
          format: 'HH:mm:ss',
          from: startTime,
          to: 'now'
        }
      },
      {
        dashboard: 'alarm',
        object: 'record',
        measurement: 'trend',
        dimension: 'agg',
        group: 'thisMonth',
        params: {
          time: '1M',
          format: 'yyyy-MM',
          limit: 1,
          from: 'now-1M'
        }
      },
      {
        dashboard: 'alarm',
        object: 'record',
        measurement: 'trend',
        dimension: 'agg',
        group: '15day',
        params: {
          time: '1d',
          format: 'yyyy-MM-dd',
          from: 'now-15d',
          to: 'now',
          limit: 15
        }
      }
    ]).then((res) => {
      if (res.success) {
        footerData.value[0] = {
          label: '当月告警',
          value: res.result.find((item) => item.group === 'thisMonth').data.value,
          status: 'success'
        }
      }
      totalData.value = res.result.find((item) => item.group === 'today').data.value

      // 趋势图过滤数据
      const filterData = res.result.filter((item) => item.group === '15day')

      const x: string[] = []
      const y: number[] = []
      ;(filterData as any)?.forEach((item: any) => {
        x.push(item.data.timeString)
        y.push(item.data.value)
      })
      x.reverse()
      const onlineYdata = y
      onlineYdata.reverse()
      trendData.value = setChartOptions(x, onlineYdata, '告警数', '#ff595e')
    })
  },
  // 今日设备消息量
  getTodayDeviceMsgNum() {
    const startTime = dayjs().subtract(0, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    trendData_api([
      {
        dashboard: 'device',
        object: 'message',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'today',
        params: {
          time: '1h',
          format: 'yyyy-MM-dd HH:mm:ss',
          limit: 24,
          from: startTime,
          to: endTime
        }
      },
      {
        dashboard: 'device',
        object: 'message',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'oneday',
        params: {
          time: '1d',
          format: 'yyyy-MM-dd',
          from: 'now-1d'
        }
      },
      {
        dashboard: 'device',
        object: 'message',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'thisMonth',
        params: {
          time: '1M',
          format: 'yyyy-MM',
          limit: 1,
          from: 'now-1M'
        }
      }
    ]).then((res) => {
      if (res.success) {
        if (cardType.value === 'all') {
          totalData.value = res.result?.find((item) => item.group === 'oneday')?.data?.value || 0
          footerData.value[0] = {
            label: '当月设备消息量',
            value: res.result?.find((item) => item.group === 'thisMonth')?.data?.value || 0,
            status: 'success'
          }
        } else {
          // 趋势图
          totalData.value = res.result.find((item) => item.group === 'thisMonth').data.value
        }
        // 趋势图
        const filterData = res.result.filter((item) => item.group === 'today')
        const x: string[] = []
        const y: number[] = []
        ;(filterData as any)?.forEach((item: any) => {
          x.push(item.data.timeString)
          y.push(item.data.value)
        })
        x.reverse()
        const onlineYdata = y
        onlineYdata.reverse()
        trendData.value = setChartOptions(x, onlineYdata, '消息量', '#f29b55')
      }
    })
  }
}

const setChartOptions = (x: any[], y: number[], name: string, ThemeColor: string) => {
  return {
    xAxis: {
      type: 'category',
      data: x,
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    grid: {
      top: '5%',
      bottom: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    series: [
      {
        name,
        data: y,
        type: 'line',
        smooth: true, // 是否平滑曲线
        symbolSize: 0, // 拐点大小
        showBackground: true,
        color: ThemeColor,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: ThemeColor // 100% 处的颜色
              },
              {
                offset: 1,
                color: '#FFFFFF' //   0% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      }
    ]
  }
}
/**
 * 昨日在线
 */
const getYesterdayOnline = () => {
  const startTime = dayjs().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endTime = dayjs().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')

  trendData_api([
    {
      dashboard: 'device',
      object: 'session',
      measurement: 'online',
      dimension: 'agg',
      group: 'aggOnline',
      params: {
        state: 'online',
        limit: 24,
        from: startTime,
        to: endTime,
        time: '1d',
        format: 'yyyy-MM-dd HH:mm:ss'
      }
    }
  ]).then((res) => {
    if (res.success) {
      footerData.value[0] = {
        label: '昨日在线',
        value: res.result[0]?.data?.value || 0,
        status: 'success'
      }
    }
  })
}
// 数据刷新
const refreshManual = () => {
  action[actionName.value]()
}
// 自动刷新
const refreshInterval = (val) => {
  intervalId.value = setInterval(() => {
    refreshManual()
  }, val * 1000)
}
onMounted(() => {
  switch (props.data.type) {
    case 'product':
      actionName.value = 'getProductData' // 产品
      break
    case 'device':
      actionName.value = 'getDeviceData' // 设备
      break
    case 'currentOnline':
      actionName.value = 'getOnline' // 当前在线
      break
    case 'channels':
      actionName.value = 'getChannelsNum' // 采集器通道数量
      break
    case 'collectorNum':
      actionName.value = 'getCollectorNum' // 采集器数量
      break
    case 'collectPoints':
      actionName.value = 'getPointNum' // 采集点位
      break
    case 'videoDevicesNum':
      actionName.value = 'getVideoDevicesNum' // 视频设备数量
      break
    case 'alarm':
      actionName.value = 'getAlarmNum' // 告警配置
      break
    case 'alarmToday':
      actionName.value = 'getTodayAlarmNum' // 今日告警
      break
    case 'todayDeviceMsgNum':
      actionName.value = 'getTodayDeviceMsgNum' // 今日设备消息量
      break
  }
  action[actionName.value]()
})
onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
})

defineExpose({ refreshManual })
watch(
  () => props.data.componentProps.filterType.value,
  (val) => {
    refreshManual()
  }
)

watch(
  () => [props.data?.componentProps?.auto?.time, props.data?.componentProps?.auto?.value],
  (val) => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    if (val[1] && val[0] > 0) {
      refreshInterval(val[0])
    }
  },
  {immediate: true}
)
</script>

<style lang="less" scoped>
.top-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  border: 1px solid #e0e4e8;
  border-radius: 2px;
  .top-card-content {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: space-between;
    .content-left {
      height: 100%;
      width: 50%;
      &-title {
        color: rgba(0, 0, 0, 0.64);
      }
      &-value {
        padding: 12px 0;
        color: #323130;
        font-weight: 700;
        font-size: 36px;
      }
    }
    .content-right {
      width: 0;
      display: flex;
      flex-grow: 1;
      align-items: flex-end;
      justify-content: flex-end;
      img {
        width: 92px;
      }
    }
    .content-right-echart {
      display: flex;
      flex-grow: 1;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
  .top-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    min-height: 40px;
    .footer-item-value {
      color: #323130;
      font-weight: 700;
      font-size: 16px;
    }
  }
}
</style>
