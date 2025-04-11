<template>
  <!-- 设备消息、点位数据量Echarts -->
  <div
    class="message-card"
    :style="{ backgroundColor: data.componentProps.background }"
  >
    <!-- , width: (data.componentProps.gridItem.w/12) + '%',height:(data.componentProps.gridItem.h/30) + '%' -->
    <Guide :title="data.title">
      <template #extra>
        <TimeSelect
          ref="timeSelectRef"
          key="flow-static"
          :quickBtnList="quickBtnList"
          :type="selectTime"
          @change="getEcharts"
        />
      </template>
    </Guide>
    <div
      class="message-chart"
      style="width: 100%;"
    >
      <Charts :options="trendOptions" :style="_style"></Charts>
    </div>
  </div>
</template>

<script setup lang="ts">
import { trendData_api, queryFlow } from '@/api/Dashboard/index'
import Guide from './components/Guide.vue'
import Charts from './components/Charts.vue'
import TimeSelect from './components/TimeSelect.vue'
import dayjs from 'dayjs'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const intervalId = ref()
const timeSelectRef = ref()
const selectTime = ref()
const dataConfig = ref()
const paramsData = computed(() => {
  if (props.data.type === 'deviceMessage') {
    return {
      dashboard: 'device',
      dimension: 'agg',
      group: 'device_msg',
      measurement: 'quantity',
      object: 'message'
    }
  } else if (props.data.type === 'collector') {
    return {
      dashboard: 'collector',
      dimension: 'agg',
      measurement: 'quantity',
      object: 'pointData'
    }
  } else return {}
})
const trendOptions = ref({})
const quickBtnList = ref([
  { label: '最近1小时', value: 'hour' },
  { label: '最近24小时', value: 'day' },
  { label: '近一周', value: 'week' }
])

// 处理数据
const setChartOption = (x: Array<any>, y: Array<number>, maxY: number, name: string, themeColor: string): void => {
  const yLen = String(Math.ceil(maxY)).length
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}<br />{a0}: {c0}'
      // formatter: '{b0}<br />{a0}: {c0}<br />{a1}: {c1}%'
    },
    grid: {
      top: '2%',
      bottom: '5%',
      left: maxY < 900000 ? '60px' : yLen * 7.5 + Math.floor(yLen / 3) * 1.2 + 10 + 'px',
      right: '50px'
    },
    series: [
      {
        name,
        data: y,
        // data: percentageY,
        type: 'line',
        smooth: true,
        symbolSize: 0, // 拐点大小
        color: themeColor,
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
                color: themeColor // 100% 处的颜色
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
const getData = (start: number, end: number): Promise<{ sortArray: any[] }> => {
  const { start: _start, end: _end, type } = dataConfig.value
  const params = {
    day: {
      time: '1h',
      format: 'HH:mm',
      limit: 24,
      from: _start,
      to: _end
    },
    week: {
      time: '1d',
      format: 'M月dd日',
      limit: 7,
      from: _start,
      to: _end
    },
    month: {
      time: '1d',
      format: 'M月dd日',
      limit: 30,
      from: _start,
      to: _end
    },
    year: {
      time: '1M',
      format: 'yyyy年-M月',
      limit: 12,
      from: _start,
      to: _end
    }
  }
  return new Promise((resolve) => {
    queryFlow(start, end, params[type]).then((resp: any) => {
      if (resp.success) {
        const sortArray = resp.result.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        resolve({
          sortArray
        })
      }
    })
  })
}
const getEcharts = (data: any) => {
  dataConfig.value = data

  if (['collector', 'deviceMessage'].includes(props.data?.type)) {
    let _time = '1m'
    let format = 'M月dd日 HH:mm'
    let limit = 12
    const dt = data.end - data.start
    const hour = 60 * 60 * 1000
    const days = hour * 24
    const months = days * 30
    const year = 365 * days
    if (dt <= hour + 10) {
      limit = 60
      format = 'HH:mm'
    } else if (dt > hour && dt <= days) {
      _time = '1h'
      limit = 24
    } else if (dt > days && dt < year) {
      limit = Math.abs(Math.ceil(dt / days)) + 1
      _time = '1d'
      format = 'M月dd日'
    } else if (dt >= year) {
      limit = Math.abs(Math.floor(dt / months))
      _time = '1M'
      format = 'yyyy年-M月'
    }

    if (Object.keys(paramsData.value)?.length) {
      const _paramsData = {
        ...paramsData.value,
        params: {
          time: _time,
          format: format,
          limit: limit,
          from: data.start,
          to: data.end
        }
      }
      if (props.data.type === 'deviceMessage') {
        _paramsData.params.time = _time
      } else {
        _paramsData.params.interval = _time
      }
      trendData_api([_paramsData]).then((res: any) => {
        if (res.success) {
          let x = res.result
            .map((item: any) => (_time === '1h' ? `${item.data.timeString}时` : item.data.timeString))
            .reverse()

          if (res.result.length === 0 || (res.result.length === 1 && !res.result[0].timeString)) {
            x = [dayjs(data.start).format('YYYY-MM-DD HH:mm:ss'), dayjs(data.end).format('YYYY-MM-DD HH:mm:ss')]
          }
          let y = res.result.map((item: any) => item.data.value).reverse()
          if (!y.length) {
            y = [0]
          }
          const maxY = Math.max.apply(null, y.length ? y : [0])
          trendOptions.value = setChartOption(x, y, maxY, props.data.componentProps.name, '#82e5d2')
        }
      })
    }
  } else if (props.data.type === 'trafficStatistics') {
    // 流量统计
    let startTime = data.start
    let endTime = data.end

    if (data.type !== 'day') {
      startTime = dayjs(data.start).startOf('days').valueOf()
      endTime = dayjs(data.end).startOf('days').valueOf()
    }
    getData(startTime, endTime).then((resp) => {
      trendOptions.value = resp.sortArray
    })
  }
}
// 手动数据刷新
const refreshManual = () => {
  getEcharts(dataConfig.value)
}
// 自动刷新
const refreshInterval = (val) => {
  intervalId.value = setInterval(() => {
    refreshManual()
  }, val * 1000)
}
onMounted(() => {
  if (props.data.type === 'trafficStatistics') {
    quickBtnList.value = [
      { label: '今日', value: 'day' },
      { label: '近一周', value: 'week' },
      { label: '近一月', value: 'month' },
      { label: '近一年', value: 'year' }
    ]
    paramsData.value = {}
  }
})
watch(
  () => props.data.componentProps.filterTime.value,
  (val) => {
    selectTime.value = val
  },
  { immediate: true }
)
watch(
  () => [props.data.componentProps.auto.time, props.data.componentProps.auto.value],
  (val) => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }
    if (val[1] && val[0] > 0) {
      refreshInterval(val[0])
    }
  }
)

const _style = ref({
  width: '100%',
})

watch(
  ()=>props.data.componentProps.gridItem,
  (val)=>{
    if(val){
      const el = document.getElementById(props.data.key)
      const { w,h} = val
      const style = {
        width: el?.offsetWidth * (w/12) + 'px',
        height: el?.offsetHeight * (h/30) + 'px'
      }
      _style.value = style
    }
   
  },
  {immediate:true}
)

</script>

<style scoped lang="less">
.message-card,
.device-position {
  // margin-top: 24px;
  padding: 24px;
  background-color: rgb(134, 188, 231);
  height: 100%;
  width: 100%;
}
.message-chart {
  width: 95%;
  height: 95%;
}
.amap-box {
  width: 100%;
  min-height: 500px;
  height: 100%;
}
</style>
