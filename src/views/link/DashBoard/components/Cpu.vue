<template>
    <j-spin :spinning="loading">
        <div class="dash-board">
            <div class="header">
                <h3>CPU使用率趋势</h3>
                <j-range-picker
                    @change="pickerTimeChange"
                    :allowClear="false"
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    v-model:value="data.time"
                >
                    <template #suffixIcon
                        ><AIcon type="CalendarOutlined"
                    /></template>
                    <template #renderExtraFooter>
                        <j-radio-group
                            default-value="a"
                            button-style="solid"
                            style="margin-right: 10px"
                            v-model:value="data.type"
                        >
                          <j-radio-button value="hour">
                            最近1小时
                          </j-radio-button>
                          <j-radio-button value="day"> 最近24小时 </j-radio-button>
                          <j-radio-button value="week"> 近一周 </j-radio-button>
                        </j-radio-group>
                    </template>
                </j-range-picker>
            </div>
            <div>
                <j-empty
                    v-if="isEmpty"
                    style="height: 200px; margin-top: 100px"
                />
                <template v-else>
                  <div style="height: 300px">
                    <Echarts
                        :options="echartsOptions"
                    />
                  </div>

                  <ServerList
                      v-if="serverOptions.length > 1"
                      v-model:value="serverActive"
                      :options="serverOptions"
                      :color="colorCpu"
                  />
                </template>
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup name="Cpu">
import { dashboard } from '@/api/link/dashboard';
import dayjs from 'dayjs';
import {
    getTimeByType,
    arrayReverse,
    defaultParamsData,
    areaStyleCpu,
    typeDataLine,
    colorCpu
} from './tool.ts';
import { DataType } from '../typings';
import ServerList from './ServerList.vue'
import Echarts from './echarts.vue'

const props = defineProps({
  serviceId: {
    type: String,
    default: undefined
  },
  isNoCommunity: {
    type:Boolean,
    default: false
  }
})

const chartRef = ref<Record<string, any>>({});
const loading = ref(false);
const data = ref<DataType>({
    type: 'hour',
    time: [null, null],
});
const isEmpty = ref(false);
const serverActive = ref<string[]>([])
const serverOptions = ref<string[]>([])
const serverData = reactive({
  xAxis: [],
  data: []
})

const pickerTimeChange = () => {
    data.value.type = undefined;
  getCPUEcharts(data.value)
};

const echartsOptions = computed(() => {
  const series = serverActive.value.length
          ? serverActive.value.map((key) => setOptions(serverData.data, key))
          : typeDataLine
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: arrayReverse(serverData.xAxis),
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: any) => `${value}%`,
    },
    yAxis: {
      type: 'value',
    },
    grid: {
      left: '50px',
      right: '50px',
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: data.value.type !== 'hour' ? 5 : 100,
      },
      {
        start: 0,
        end: data.value.type !== 'hour' ? 5 : 100,
      },
    ],
    color: colorCpu,
    series: series
  };
})
const getCPUEcharts = async (val: any) => {
    loading.value = true;
    const res: any = await dashboard(defaultParamsData('cpu', val));
    if (res.success) {
        const _cpuOptions = {};
        const _cpuXAxis = new Set();
        if (res.result?.length) {
          isEmpty.value = false;
          // 根据服务节点来筛选数据
          // const filterArray = props.isNoCommunity ? res.result.filter((item : any) => item.data?.clusterNodeId === props.serviceId) : res.result
          const filterArray = res.result
          filterArray.forEach((item: any) => {
                const value = item.data.value;
                const nodeID = item.data.clusterNodeId;
                _cpuXAxis.add(
                    dayjs(value.timestamp).format('YYYY-MM-DD HH:mm'),
                );

                if (!_cpuOptions[nodeID]) {
                    _cpuOptions[nodeID] = [];
                }
                _cpuOptions[nodeID]?.push(
                    Number(value.cpuSystemUsage).toFixed(2),
                );
            });
            handleCpuOptions(_cpuOptions, [..._cpuXAxis.keys()]);
        } else {
            handleCpuOptions([], []);
            isEmpty.value = true;
        }
    }
    setTimeout(() => {
        loading.value = false;
    }, 300);
};

const setOptions = (optionsData: any, key: string) => ({
    data: arrayReverse(optionsData[key]),
    name: key != 'undefined' ? key : '',
    type: 'line',
    smooth: true,
    symbol: 'none',
    // areaStyle: areaStyleCpu(index),
});

const handleCpuOptions = (optionsData: any, xAxis: any) => {
    const dataKeys = Object.keys(optionsData);
    serverActive.value = dataKeys
    serverOptions.value = dataKeys
    serverData.xAxis = xAxis
    serverData.data = optionsData
}

watch(
    () => data.value.type,
    (value) => {
        if (value === undefined) return;
        const date = getTimeByType(value);
        data.value.time = [dayjs(date), dayjs(new Date())];
      getCPUEcharts(data.value);
    },
    { immediate: true, deep: true },
);

// watchEffect(() => {
//   const time = data.value.time
//   if (time && Array.isArray(time) && time.length === 2 && time[0]) {
//
//   }
// })

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
