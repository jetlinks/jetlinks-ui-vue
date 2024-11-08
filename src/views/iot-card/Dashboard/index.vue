<!-- 物联卡-仪表盘 -->
<template>
  <page-container>
    <div class="card-dashboard-container">
      <j-card style="margin-bottom: 24px">
        <j-row :gutter="24">
          <j-col :span="24">
            <Guide title="数据统计"/>
          </j-col>
          <j-col :span="8">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">昨日流量消耗</div>
                <j-tooltip placement="bottomLeft">
                  <template #title>
                    <span>{{ dayTotal }} M</span>
                  </template>
                  <div class="value">
                    {{ dayTotal }}
                    <span class="unit">M</span>
                  </div>
                </j-tooltip>
              </div>
              <LineChart
                  color="#FBA500"
                  :chartData="dayOptions"
              />
            </div>
          </j-col>
          <j-col :span="8">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">当月流量消耗</div>
                <j-tooltip placement="bottomLeft">
                  <template #title>
                    <span>{{ monthTotal }} M</span>
                  </template>
                  <div class="value">
                    {{ monthTotal }}
                    <span class="unit">M</span>
                  </div>
                </j-tooltip>
              </div>
              <LineChart :chartData="monthOptions"/>
            </div>
          </j-col>
          <j-col :span="8">
            <div class="data-statistics-item">
              <div class="flow-info" style="width: 100%">
                <div class="label">本年流量消耗</div>
                <j-tooltip placement="bottomLeft">
                  <template #title>
                    <span>{{ yearTotal }} M</span>
                  </template>
                  <div class="value">
                    {{ yearTotal }}
                    <span class="unit">M</span>
                  </div>
                </j-tooltip>
              </div>
              <LineChart
                  color="#58E1D3"
                  :chartData="yearOptions"
              />
            </div>
          </j-col>
        </j-row>
      </j-card>
      <j-row :gutter="24">
        <j-col :span="16">
          <div class="static-card">
            <Guide title="流量统计">
              <template #extra>
                <TimeSelect
                    key="flow-static"
                    :type="'week'"
                    :quickBtnList="quickBtnList"
                    @change="getEcharts"
                />
              </template>
            </Guide>
            <FullPage v-if="flowData.length !== 0">
              <LineChart
                  :showX="true"
                  :showY="true"
                  style="min-height: 490px"
                  :chartData="flowData"
              />
            </FullPage>
            <div class="empty-body" v-else>
              <j-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
            </div>
          </div>
        </j-col>
        <j-col :span="8">
          <div class="static-card">
            <Guide title="流量使用TOP10">
              <template #extra>
                <TimeSelect
                    key="flow-top10"
                    :quickBtn="false"
                    :type="'week'"
                    @change="getTopRang"
                />
              </template>
            </Guide>
            <FullPage v-if="topList.length !== 0">
              <div
                  v-if="topList.length !== 0"
                  class="rankingList"

              >
                <div
                    v-for="(item, index) in topList"
                    :key="item.cardNum"
                    class="rankItem"
                >
                  <div
                      class="number"
                      :class="`number-item-${index + 1}`"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="cardNum">{{ item.cardNum }}</div>
                  <div class="progress">
                    <j-progress
                        :strokeColor="'#ADC6FF'"
                        :trailColor="'#E0E4E8'"
                        :strokeLinecap="'butt'"
                        :showInfo="false"
                        :percent="
                                            Math.ceil(
                                                (item.value / topTotal) * 100,
                                            )
                                        "
                    ></j-progress>
                  </div>
                  <div class="total">
                    {{ item?.value?.toFixed(2) }} M
                  </div>
                </div>
              </div>
            </FullPage>
            <div class="empty-body" v-else>
              <j-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
            </div>
          </div>
        </j-col>
      </j-row>
    </div>
  </page-container>
</template>

<script setup lang="ts">
import Guide from '../components/Guide.vue';
import LineChart from '../components/LineChart.vue';
import dayjs from 'dayjs';
import {getIsTimer, queryFlow} from '@/api/iot-card/home';
import TimeSelect from '@/views/iot-card/components/TimeSelect.vue';
import {Empty} from 'ant-design-vue';

const dayTotal = ref(0);
const monthTotal = ref(0);
const yearTotal = ref(0);
const dayOptions = ref<any[]>([]);
const monthOptions = ref<any[]>([]);
const yearOptions = ref<any[]>([]);

const flowData = ref<any[]>([]);
const topList = ref<any[]>([]);
const topTotal = ref(0);
const isTimer = ref(false)

const quickBtnList = [
  {label: '昨日', value: 'yesterday'},
  {label: '近一周', value: 'week'},
  {label: '近一月', value: 'month'},
  {label: '近一年', value: 'year'},
];

const getData = (
    start: number,
    end: number,
    params: any
): Promise<{ sortArray: any[] }> => {
  return new Promise((resolve) => {
    queryFlow(start, end, params).then((resp: any) => {
      if (resp.status === 200) {
        let sortArray = [];
        if(isTimer.value){
          sortArray = resp.result.reverse()
        } else {
          sortArray = resp.result.sort(
              (a: any, b: any) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
        }
        const arr = sortArray.map(i => ({...i, value: Number(i.value / 1024)}))
        resolve({
          sortArray: arr
        });
      }
    });
  });
};

/**
 * 查询今日、当月、本年数据
 */
const getDataTotal = () => {
  const dTime = [
    dayjs().subtract(1, 'day').startOf('day').valueOf(),
    dayjs().subtract(1, 'day').endOf('day').valueOf(),
  ];
  const dParams = isTimer.value ? {
    context: {
      format: "M月dd日 HH:mm:ss",
      time: "1h",
      from: dTime?.[0],
      to: dTime?.[1],
      limit: 24
    }
  } : {
    orderBy: 'date',
  }
  const mTime = [
    dayjs().startOf('month').valueOf(),
    dayjs().endOf('month').valueOf(),
  ];
  const mParams = isTimer.value ? {
    "context": {
      format: "Y年M月d日",
      time: "1d",
      from: mTime?.[0],
      to: mTime?.[1],
      limit: 30
    }
  } : {
    orderBy: 'date',
  }
  const yTime = [
    dayjs().startOf('year').valueOf(),
    dayjs().endOf('year').valueOf(),
  ];
  const yParams = isTimer.value ? {
    "context": {
      "format": "Y年M月",
      "time": "1M",
      from: yTime?.[0],
      to: yTime?.[1],
      "limit": 12
    }
  } : {
    orderBy: 'date',
  }
  getData(dTime[0], dTime[1], dParams).then((resp) => {
    dayTotal.value = resp.sortArray
        .reduce((r, n) => r + Number(n.value), 0)
        .toFixed(2)
    dayOptions.value = resp.sortArray;
  });
  getData(mTime[0], mTime[1], mParams).then((resp) => {
    monthTotal.value = resp.sortArray
        .reduce((r, n) => r + Number(n.value), 0)
        .toFixed(2);
    monthOptions.value = resp.sortArray;
  });
  getData(yTime[0], yTime[1], yParams).then((resp) => {
    yearTotal.value = resp.sortArray
        .reduce((r, n) => r + Number(n.value), 0)
        .toFixed(2);
    yearOptions.value = resp.sortArray;
  });
};

/**
 * 流量统计
 * @param data
 */
const getEcharts = (data: any) => {
  let startTime = data.start;
  let endTime = data.end;

  if (data.type !== 'day') {
    startTime = dayjs(data.start).startOf('days').valueOf();
    endTime = dayjs(data.end).startOf('days').valueOf();
  }
  let _time = '1m';
  let format = 'M月dd日 HH:mm';
  let limit = 12;
  const dt = endTime - startTime;
  const hour = 60 * 60 * 1000;
  const days = hour * 24;
  const months = days * 30;
  const year = 365 * days;
  if (dt <= (hour + 10)) {
    _time = '1h'
    limit = 24
    format = 'HH:mm';
  } else if (dt > hour && dt <= days) {
    _time = '1h'
    limit = 24;

  } else if (dt > days && dt < year) {
    limit = Math.abs(Math.ceil(dt / days)) + 1;
    _time = '1d';
    format = 'M月dd日';
  } else if (dt >= year) {
    limit = Math.abs(Math.floor(dt / months));
    _time = '1M';
    format = 'yyyy年-M月';
  }
  const params = {
    context: {
      time: _time,
      format: format,
      limit: limit,
      from: data.start,
      to: data.end,
    }
  }
  getData(startTime, endTime, params).then((resp) => {
    flowData.value = resp.sortArray;
  });
};

/**
 * 流量使用TOP10
 * @param data 开始时间 结束时间
 */
const getTopRang = (data: any) => {
  let startTime = data.start;
  let endTime = data.end;
  const params = isTimer.value ? {
    orderBy: 'usage',
    context: {
      "from": startTime,
      "to": endTime,
      "limit": 10
    }
  } : {
    orderBy: 'usage'
  }
  queryFlow(startTime, endTime, params).then((resp: any) => {
    if (resp.status === 200) {
      const arr = resp.result
          .slice(0, 10)
          .map(i => ({...i, value: i.value / 1024}))
          .sort((a: any, b: any) => b.value - a.value);
      topTotal.value = arr.length ? arr[0].value : 0;
      topList.value = arr;
    }
  });
};

onMounted(() => {
  getIsTimer().then(resp => {
    if (resp.success) {
      isTimer.value = resp.result
      getDataTotal();
    }
  })
})
</script>
<style scoped lang="less">
.card-dashboard-container {
  .data-statistics-item {
    height: 140px;
    background: #fcfcfc;
    border: 1px solid #e0e4e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;

    .flow-info {
      // width: 180px;
      width: 28%;

      .label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.64);
      }

      .value {
        font-size: 32px;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .unit {
          font-size: 20px;
          font-weight: normal;
        }
      }
    }
  }

  .static-card {
    background-color: #fff;
    padding: 24px;
  }

  .empty-body {
    height: 490px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 100%;
    // height: 100%;
  }

  .rankingList {
    padding: 0;
    overflow-y: auto;
    list-style: none;

    .rankItem {
      display: flex;
      justify-content: space-between;
      min-width: 0;
      padding: 12px 0;
    }

    .number {
      flex: 0 0 24px;
      height: 24px;
      color: #fff;
      font-weight: bold;
      line-height: 24px;
      text-align: center;
      background-color: #d1d1d1;
    }

    .number-item-1 {
      color: #e50012;
      background-color: rgba(#e50012, 0.1);
    }

    .number-item-2 {
      color: #fba500;
      background-color: rgba(#fba500, 0.1);
    }

    .number-item-3 {
      color: #597ef7;
      background-color: rgba(#597ef7, 0.1);
    }

    .cardNum {
      flex: 0 0 100px;
      margin-left: 16px;
    }

    .progress {
      flex: 1 1 auto;
      margin: 0 8px;

      :deep(.ant-progress-inner) {
        border-radius: 0px;
      }

      :deep(.ant-progress-bg) {
        border-radius: 0px;
      }
    }

    .total {
      flex: 0 0 80px;
      color: #999;
      text-align: right;
    }
  }
}
</style>
