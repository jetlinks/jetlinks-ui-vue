<!-- 物联卡查看 -->
<template>
  <page-container v-if="type === 'card'">
    <!-- 新增、编辑 -->
    <div>
      <Save v-if="visible" :type="saveType" :data="current" @change="saveChange" />
      <j-row :gutter="[24, 24]">
        <j-col :span="24">
          <j-card>
            <j-descriptions size="small" :column="3" bordered>
              <template #title>
                <Guide>
                  <template #title>
                    <span>基本信息</span>
                    <j-button type="link" @click="() => {
                        visible = true;
                        current = detail;
                        saveType = 'edit';
                      }
                      ">
                      <AIcon type="EditOutlined"></AIcon>
                      编辑
                    </j-button>
                  </template>
                </Guide>
              </template>

              <j-descriptions-item label="卡号">{{
                detail.id
              }}
              </j-descriptions-item>
              <j-descriptions-item label="ICCID">{{
                detail.iccId
              }}
              </j-descriptions-item>
              <j-descriptions-item label="绑定设备">{{
                detail.deviceName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="平台类型">{{
                platformTypeList.find(
                  (item) =>
                    item.value ===
                    detail.operatorName,
                )?.label || detail.operatorName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="平台名称">{{
                detail.platformConfigName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="运营商">{{
                OperatorList.find(
                  (item) =>
                    item.value === detail.operatorName,
                )?.label || detail.operatorName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="类型">{{
                detail.cardType?.text
              }}
              </j-descriptions-item>
              <j-descriptions-item label="激活日期">{{
                detail.activationDate
                  ? dayjs(detail.activationDate).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                  : ''
              }}
              </j-descriptions-item>
              <j-descriptions-item label="更新时间">{{
                detail.updateTime
                  ? dayjs(detail.updateTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                  : ''
              }}
              </j-descriptions-item>
              <j-descriptions-item label="总流量">{{
                detail.totalFlow
                  ? detail.totalFlow.toFixed(2) + ' M'
                  : '0 M'
              }}
              </j-descriptions-item>
              <j-descriptions-item label="使用流量">{{
                detail.usedFlow
                  ? detail.usedFlow.toFixed(2) + ' M'
                  : '0 M'
              }}
              </j-descriptions-item>
              <j-descriptions-item label="剩余流量">{{
                detail.residualFlow
                  ? detail.residualFlow.toFixed(2) + ' M'
                  : '0 M'
              }}
              </j-descriptions-item>
              <j-descriptions-item label="运营商状态">
                {{ detail?.cardState?.text }}
                <span v-if="deactivateData.show" style="padding-left: 8px">
                  <a-tooltip :title="deactivateData.tip">
                    <AIcon type="ExclamationCircleOutlined" style="
                                                color: var(--ant-error-color);
                                            " />
                  </a-tooltip>
                </span>
              </j-descriptions-item>
              <j-descriptions-item label="平台状态">
                {{ detail?.cardStateType?.text }}
              </j-descriptions-item>
              <j-descriptions-item>
                <template #label>
                  <div>
                    同步状态
                    <a-tooltip>
                      <template #title>批量操作中物联网卡的同步状态</template>
                      <AIcon type="QuestionCircleOutlined"></AIcon>
                    </a-tooltip>
                  </div>
                </template>
                <div style="display: flex; gap: 10px; align-items: center;">
                  <div style="min-width: 60px">
                    {{ detail?.syncCardStatus?.text }}
                  </div>
                  <div style="display: flex; color: red; align-items: center; gap: 5px"
                    v-if="detail?.syncCardStatus?.value === 'failed'">
                    <AIcon type="ExclamationCircleFilled" />
                    <j-ellipsis>{{ detail?.errorMessage }}</j-ellipsis>
                  </div>
                </div>
              </j-descriptions-item>
              <j-descriptions-item label="说明">{{
                detail?.describe
              }}
              </j-descriptions-item>
            </j-descriptions>
          </j-card>
        </j-col>
        <j-col :span="24">
          <!-- 流量统计 -->
          <j-row :gutter="24">
            <j-col :span="16">
              <div class="card">
                <Guide title="流量统计">
                  <template #extra>
                    <TimeSelect :type="'week'" :quickBtnList="quickBtnList" @change="getEcharts" :is-timer="isTimer" />
                  </template>
                </Guide>
                <LineChart :showX="true" :showY="true" style="min-height: 490px" :chartData="flowData" />
              </div>
            </j-col>
            <j-col :span="8">
              <div class="card">
                <Guide title="数据统计" />
                <div class="static-info" style="min-height: 490px">
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        昨日流量消耗
                      </div>
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
                    <LineChart color="#FBA500" :chartData="dayOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        当月流量消耗
                      </div>
                      <j-tooltip placement="bottomLeft">
                        <template #title>
                          <span>{{
                            monthTotal
                          }}
                            M</span>
                        </template>
                        <div class="value">
                          {{ monthTotal }}
                          <span class="unit">M</span>
                        </div>
                      </j-tooltip>
                    </div>
                    <LineChart :chartData="monthOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        本年流量消耗
                      </div>
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
                    <LineChart color="#58E1D3" :chartData="yearOptions" />
                  </div>
                </div>
              </div>
            </j-col>
          </j-row>
        </j-col>
      </j-row>
    </div>
  </page-container>
  <div v-else>
    <div v-if="cardId">
      <Save v-if="visible" :type="saveType" :data="current" @change="saveChange" />
      <j-row :gutter="[24, 24]">
        <j-col :span="24">
          <j-card>
            <j-descriptions size="small" :column="3" bordered>
              <template #title>
                <Guide>
                  <template #title>
                    <span>基本信息</span>
                    <j-button type="link" @click="() => {
                        visible = true;
                        current = detail;
                        saveType = 'edit';
                      }
                      ">
                      <AIcon type="EditOutlined"></AIcon>
                      编辑
                    </j-button>
                  </template>
                </Guide>
              </template>

              <j-descriptions-item label="卡号">{{
                detail.id
              }}
              </j-descriptions-item>
              <j-descriptions-item label="ICCID">{{
                detail.iccId
              }}
              </j-descriptions-item>
              <j-descriptions-item label="绑定设备">{{
                detail.deviceName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="平台类型">{{
                platformTypeList.find(
                  (item) =>
                    item.value ===
                    detail.operatorName,
                )?.label || detail.operatorName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="平台名称">{{
                detail.platformConfigName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="运营商">{{
                OperatorList.find(
                  (item) =>
                    item.value === detail.operatorName,
                )?.label || detail.operatorName
              }}
              </j-descriptions-item>
              <j-descriptions-item label="类型">{{
                detail.cardType?.text
              }}
              </j-descriptions-item>
              <j-descriptions-item label="激活日期">{{
                detail.activationDate
                  ? dayjs(detail.activationDate).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                  : ''
              }}
              </j-descriptions-item>
              <j-descriptions-item label="更新时间">{{
                detail.updateTime
                  ? dayjs(detail.updateTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )
                  : ''
              }}
              </j-descriptions-item>
              <j-descriptions-item label="总流量">{{
                detail.totalFlow
                  ? detail.totalFlow.toFixed(2) + ' M'
                  : '0 M'
              }}
              </j-descriptions-item>
              <j-descriptions-item label="使用流量">{{
                detail.usedFlow
                  ? detail.usedFlow.toFixed(2) + ' M'
                  : '0 M'
              }}
              </j-descriptions-item>
              <j-descriptions-item label="剩余流量">{{
                detail.residualFlow
                  ? detail.residualFlow.toFixed(2) + ' M'
                  : '0 M'
              }}
              </j-descriptions-item>
              <j-descriptions-item label="运营商状态">
                {{ detail?.cardState?.text }}
                <span v-if="deactivateData.show" style="padding-left: 8px">
                  <a-tooltip :title="deactivateData.tip">
                    <AIcon type="ExclamationCircleOutlined" style="
                                                color: var(--ant-error-color);
                                            " />
                  </a-tooltip>
                </span>
              </j-descriptions-item>
              <j-descriptions-item label="平台状态">
                {{ detail?.cardStateType?.text }}
              </j-descriptions-item>
              <j-descriptions-item label="说明">{{
                detail?.describe
              }}
              </j-descriptions-item>
            </j-descriptions>
          </j-card>
        </j-col>
        <j-col :span="24">
          <!-- 流量统计 -->
          <j-row :gutter="24">
            <j-col :span="16">
              <div class="card">
                <Guide title="流量统计">
                  <template #extra>
                    <TimeSelect :type="'week'" :quickBtnList="quickBtnList" @change="getEcharts" :is-timer="isTimer"/>
                  </template>
                </Guide>
                <LineChart :showX="true" :showY="true" style="min-height: 490px" :chartData="flowData" />
              </div>
            </j-col>
            <j-col :span="8">
              <div class="card">
                <Guide title="数据统计" />
                <div class="static-info" style="min-height: 490px">
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        昨日流量消耗
                      </div>
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
                    <LineChart color="#FBA500" :chartData="dayOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        当月流量消耗
                      </div>
                      <j-tooltip placement="bottomLeft">
                        <template #title>
                          <span>{{
                            monthTotal
                          }}
                            M</span>
                        </template>
                        <div class="value">
                          {{ monthTotal }}
                          <span class="unit">M</span>
                        </div>
                      </j-tooltip>
                    </div>
                    <LineChart :chartData="monthOptions" />
                  </div>
                  <div class="data-statistics-item">
                    <div class="flow-info" style="width: 100%">
                      <div class="label">
                        本年流量消耗
                      </div>
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
                    <LineChart color="#58E1D3" :chartData="yearOptions" />
                  </div>
                </div>
              </div>
            </j-col>
          </j-row>
        </j-col>
      </j-row>
    </div>
    <JEmpty v-else></JEmpty>
  </div>
</template>

<script setup lang="ts" name="CardDetail">
import dayjs from 'dayjs';
import type { CardManagement } from '../typing';
import {
  queryDeactivate,
  queryDetail,
  query,
} from '@/api/iot-card/cardManagement';
import Save from '../Save.vue';
import Guide from '@/views/iot-card/components/Guide.vue';
import LineChart from '@/views/iot-card/components/LineChart.vue';
import { queryFlow, getIsTimer } from '@/api/iot-card/home';
import TimeSelect from '@/views/iot-card/components/TimeSelect.vue';
import { OperatorList, platformTypeList } from '@/views/iot-card/data';

const props = defineProps({
  type: {
    type: String,
    default: 'card',
  },
});

const route = useRoute();
const cardId = ref();
const isTimer = ref(false);
const visible = ref<boolean>(false);
const current = ref<Partial<CardManagement>>({});
const saveType = ref<string>('');
const detail = ref<any>({});

const flowData = ref<any[]>([]);
const dayTotal = ref(0);
const monthTotal = ref(0);
const yearTotal = ref(0);
const dayOptions = ref<any[]>([]);
const monthOptions = ref<any[]>([]);
const yearOptions = ref<any[]>([]);

const deactivateData = reactive({
  show: false,
  tip: '',
});

const quickBtnList = [
  { label: '昨日', value: 'yesterday' },
  { label: '近一周', value: 'week' },
  { label: '近一月', value: 'month' },
  { label: '近一年', value: 'year' },
];

const getDetail = () => {
  queryDetail(cardId.value).then((resp: any) => {
    if (resp.success) {
      detail.value = resp.result;

      if (resp.result.cardStateType?.value === 'deactivate' && detail.value.operatorName === 'onelink') {
        deactivateData.show = true;
        //   获取停机原因
        queryDeactivate(cardId.value).then((deacResp: any) => {
          if (deacResp.success && deacResp.result?.message) {
            deactivateData.tip = deacResp.result.message.toString();
          }
        });
      }
    }
  });
};

/**
 * 新增、编辑关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
  visible.value = false;
  current.value = {};
  if (val) {
    getDetail();
  }
};

const getData = (
  start: number,
  end: number,
  params: any
): Promise<{ sortArray: any[] }> => {
  return new Promise((resolve) => {
    queryFlow(start, end, params).then((resp: any) => {
      if (resp.status === 200) {
        let sortArray = [];
        if (isTimer.value) {
          sortArray = resp.result.reverse();
        } else {
          sortArray = resp.result.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        }
        resolve({
          sortArray,
        });
      }
    });
  });
};

/**
 * 查询左日、当月、本年数据
 */
const getDataTotal = () => {
  const dTime = [
    dayjs(new Date()).subtract(1, "day").startOf("day").valueOf(),
    dayjs(new Date()).subtract(1, "day").endOf("day").valueOf(),
  ];
  const dParams = isTimer.value
    ? {
      context: {
        format: "M月dd日 HH:mm:ss",
        time: "1h",
        from: dTime?.[0],
        to: dTime?.[1],
        cardId: cardId.value,
        limit: 24,
      },
    }
    : {
      orderBy: "date",
      terms: [
        {
          column: "cardId",
          termType: "eq",
          value: cardId.value,
        },
      ],
    };
  const mTime = [
    dayjs().startOf("month").valueOf(),
    dayjs().endOf("month").valueOf(),
  ];
  const mParams = isTimer.value
    ? {
      context: {
        format: "Y年M月d日",
        time: "1d",
        from: mTime?.[0],
        to: mTime?.[1],
        cardId: cardId.value,
        limit: 31,
      },
    }
    : {
      orderBy: "date",
      terms: [
        {
          column: "cardId",
          termType: "eq",
          value: cardId.value,
        },
      ],
    };
  const yTime = [
    dayjs().startOf("year").valueOf(),
    dayjs().endOf("year").valueOf(),
  ];
  const yParams = isTimer.value
    ? {
      context: {
        format: "Y年M月",
        time: "1M",
        from: yTime?.[0],
        to: yTime?.[1],
        cardId: cardId.value,
        limit: 12,
      },
    }
    : {
      orderBy: "date",
      terms: [
        {
          column: "cardId",
          termType: "eq",
          value: cardId.value,
        },
      ],
    };
  getData(dTime[0], dTime[1], dParams).then((resp) => {
    dayTotal.value = resp.sortArray
      .reduce((r, n) => r + Number(n.value), 0)
      .toFixed(2);
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
  if (data.type !== "day") {
    startTime = dayjs(data.start).startOf("days").valueOf();
    endTime = dayjs(data.end).startOf("days").valueOf();
  }
  let _time = "1m";
  let format = "M月dd日 HH:mm";
  let limit = 12;
  const dt = endTime - startTime;
  const hour = 60 * 60 * 1000;
  const days = hour * 24;
  const months = days * 30;
  const year = 365 * days;
  if (dt <= hour + 10) {
    _time = "1h";
    limit = 24;
    format = "HH:mm";
  } else if (dt > hour && dt <= days) {
    _time = "1h";
    limit = 24;
  } else if (dt > days && dt < year) {
    limit = Math.abs(Math.ceil(dt / days)) + 1;
    _time = "1d";
    format = "M月dd日";
  } else if (dt >= year) {
    limit = Math.abs(Math.floor(dt / months));
    _time = "1M";
    format = "yyyy年-M月";
  }
  const params = isTimer.value
    ? {
      context: {
        time: _time,
        format: format,
        limit: limit,
        cardId: cardId.value,
        from: data.start,
        to: data.end,
      },
    }
    : {
      orderBy: "date",
      terms: [
        {
          column: "cardId",
          termType: "eq",
          value: cardId.value,
        },
      ],
    };
  getData(startTime, endTime, params).then((resp) => {
    flowData.value = resp.sortArray;
  });
};

/**
 * 获取绑定设备的物联卡的信息
 */
const queryCard = async () => {
  const res: any = await query({
    terms: [
      {
        column: 'deviceId',
        termType: 'eq',
        value: route.params.id,
      },
    ],
  });
  if (res.success && res.result?.data) {
    cardId.value = res.result?.data?.[0]?.id;
  }
};

onMounted(async () => {
  if (props.type === 'device') {
    await queryCard();
  } else {
    cardId.value = route.params.id;
  }
  if (cardId.value) {
    getDetail();
    getIsTimer().then((resp) => {
      if (resp.success) {
        isTimer.value = resp.result;
        getDataTotal();
      }
    });
  }
});
</script>
<style scoped lang="less">
.card {
  padding: 24px;
  background-color: #fff;
}

.static-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

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
}
</style>
