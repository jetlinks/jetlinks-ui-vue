<template>
  <div style='margin-bottom: 16px' v-if="type === 'product'">
    <AIcon type="InfoCircleOutlined" style="margin-right: 3px" />
    {{ $t('Alarm.index.101383-17') }}
  </div>
  <pro-search
      :columns="columns"
      target="device-instance"
      type="simple"
      @search="handleSearch"
      style="padding: 0;"
  />
  <div v-if="current?.id">
    <JProTable
        ref="deviceAlarm"
        :columns="columns"
        mode="TABLE"
        :request="queryAlarmRecord"
        :defaultParams="defaultParams"
        :params="params"
        style="padding: 0"
    >
      <template #alarmTime="slotProps">
        {{ dayjs(slotProps.alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #duration="slotProps">
        <Duration :data="slotProps"/>
      </template>
      <template #handleTime="slotProps">
        {{
          slotProps.handleTime
              ? dayjs(slotProps.handleTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
        }}
      </template>
      <template #sourceName="slotProps">
        <div class="sourceName">
          <div class="name">{{ $t('Alarm.index.101383-0') }}</div>
          <div class="deviceId" @click="() => gotoDevice(slotProps.sourceId)">
            <j-ellipsis>
              {{ slotProps.sourceName }}
            </j-ellipsis>
          </div>
        </div>
      </template>
      <template #handleType="slotProps">
        {{ slotProps?.handleType?.text || '--' }}
      </template>
      <template #level="slotProps">
        {{getLevelData(slotProps) }}
      </template>
      <template #state="slotProps">
        {{ slotProps?.state?.value === 'normal' ? $t('Alarm.index.101383-1') : $t('Alarm.index.101383-2') }}
      </template>
      <template #actions="slotProps">
        <a-space>
          <template v-for="i in getActions(slotProps)" :key="i.key">
            <j-permission-button
                :popConfirm="i.popConfirm"
                :tooltip="{
                            ...i.tooltip,
                        }"
                @click="i.onClick"
                type="link"
                style="padding: 0 5px"
                :hasPermission="
                            i.key === 'solve'
                                ? 'rule-engine/Alarm/Log:action'
                                : 'rule-engine/Alarm/Log:view'
                        "
            >
              {{ i.text }}
            </j-permission-button>
          </template>
        </a-space>
      </template>
    </JProTable>
  </div>
  <SolveComponent
      v-if="solveVisible"
      :data="currentAlarm"
      :solveType="solveType"
      :goal="type"
      :handleDes="handleDescription"
      @closeSolve="closeSolve"
      @refresh="solveRefresh"
  />
  <AlarmLog
      v-if="visibleDrawer"
      :data="currentAlarm"
      :goal="type"
      @closeDrawer="visibleDrawer = false"
      @refreshTable="refresh"
  />
</template>

<script setup>
import {
  query as queryAlarmRecord,
  queryPreHandleHistory,
} from '@device-manager-ui/api/rule-engine/log';
import {useInstanceStore} from '@device-manager-ui/store/instance';
import {useProductStore} from '@device-manager-ui/store/product';
import dayjs from 'dayjs';
import AlarmLog from './components/AlarmLog.vue';
import {useMenuStore} from '@jetlinks-web-core/store';
import {useI18n} from 'vue-i18n';
import SolveComponent from './components/SolveComponent.vue'
import Duration from './components/Duration.vue'
import {queryLevel} from "@device-manager-ui/api/rule-engine/config";
import {langKey} from "@jetlinks-web-core/utils/consts";

const {t: $t} = useI18n();

const props = defineProps({
  type: {
    type: String,
    default: 'device',
  },
});
const device = useInstanceStore()
const product = useProductStore()
const menuStory = useMenuStore();
const current = computed(() => {
  return props.type === 'device' ? device.current : product.current
})

const localLanguage = localStorage.getItem(langKey)  || 'zh'
const columns =
    props.type === 'device'
        ? [
          {
            title: $t('Alarm.index.101383-3'),
            dataIndex: 'alarmTime',
            key: 'alarmTime',
            search: {
              type: 'date',
            },
            scopedSlots: true,
            width: 180
          },
          {
            title: $t('Alarm.index.101383-4'),
            dataIndex: 'duration',
            key: 'duration',
            scopedSlots: true,
            ellipsis: true
          },
          {
            title: $t('Alarm.index.101383-5'),
            dataIndex: 'triggerDesc',
            key: 'triggerDesc',
            ellipsis: true
          },
          {
            title: $t('Alarm.index.101383-6'),
            dataIndex: 'actualDesc',
            key: 'actualDesc',
            ellipsis: true
          },
          {
            title: $t('Alarm.index.101383-7'),
            dataIndex: 'handleTime',
            key: 'handleTime',
            search: {
              type: 'date',
            },
            scopedSlots: true,
            width: 180
          },

          {
            title: $t('Alarm.index.101383-8'),
            dataIndex: 'handleType',
            key: 'handleType',
            search: {
              type: 'select',
              options: [
                {
                  label: $t('Alarm.index.101383-9'),
                  value: 'user',
                },
                {
                  label: $t('Alarm.index.101383-10'),
                  value: 'system',
                },
              ],
            },
            scopedSlots: true,
          },
          {
            title: $t('Alarm.index.101383-11'),
            dataIndex: 'state',
            key: 'state',
            search: {
              type: 'select',
              options: [
                {
                  label: $t('Alarm.index.101383-1'),
                  value: 'normal',
                },
                {
                  label: $t('Alarm.index.101383-2'),
                  value: 'warning',
                },
              ],
            },
            scopedSlots: true,
          },
          {
            title: $t('Alarm.index.101383-12'),
            dataIndex: 'actions',
            key: 'actions',
            scopedSlots: true,
            fixed: 'right',
            width: 160,
          },
        ]
        : [
          {
            title: $t('Alarm.index.101383-3'),
            dataIndex: 'alarmTime',
            key: 'alarmTime',
            search: {
              type: 'date',
            },
            width: 180,
            scopedSlots: true,
          },
          {
            title: $t('Alarm.index.101383-4'),
            dataIndex: 'duration',
            key: 'duration',
            ellipsis: true,
            width: 100,
            scopedSlots: true,
          },
          {
            title: $t('Detail.index.478940-18'),
            dataIndex: 'alarmName',
            key: 'alarmName',
            width: 100,
            ellipsis: true,
          },
          {
            title: $t('Detail.index.478940-19'),
            dataIndex: 'level',
            key: 'level',
            width: 100,
            ellipsis: true,
            scopedSlots: true,
          },
          {
            title: $t('Alarm.index.101383-5'),
            dataIndex: 'triggerDesc',
            key: 'triggerDesc',
            ellipsis: true
          },
          {
            title: $t('Alarm.index.101383-13'),
            dataIndex: 'sourceName',
            key: 'sourceName',
            scopedSlots: true,
            width: 250,
            search: {
              type: 'string',
            },
          },
          {
            title: $t('Alarm.index.101383-6'),
            dataIndex: 'actualDesc',
            key: 'actualDesc',
            ellipsis: true
          },
          {
            title: $t('Alarm.index.101383-7'),
            dataIndex: 'handleTime',
            key: 'handleTime',
            search: {
              type: 'date',
            },
            scopedSlots: true,
            width: 180
          },
          {
            title: $t('Alarm.index.101383-8'),
            dataIndex: 'handleType',
            key: 'handleType',
            width: 100,
            search: {
              type: 'select',
              options: [
                {
                  label: $t('Alarm.index.101383-9'),
                  value: 'user',
                },
                {
                  label: $t('Alarm.index.101383-10'),
                  value: 'system',
                },
              ],
            },
            scopedSlots: true,
          },
          {
            title: $t('Alarm.index.101383-11'),
            dataIndex: 'state',
            key: 'state',
            width: 100,
            search: {
              type: 'select',
              options: [
                {
                  label: $t('Alarm.index.101383-1'),
                  value: 'normal',
                },
                {
                  label: $t('Alarm.index.101383-2'),
                  value: 'warning',
                },
              ],
            },
            scopedSlots: true,
          },
          {
            title: $t('Alarm.index.101383-12'),
            dataIndex: 'actions',
            key: 'actions',
            fixed: 'right',
            width: 160,
            scopedSlots: true,
          },
        ];
const params = ref();
const handleDescription = ref();
const deviceAlarm = ref();
const solveVisible = ref(false);
const solveType = ref('handle');
const currentAlarm = ref();
const visibleDrawer = ref(false);
const levelList = ref([]);
const defaultParams = computed(() => {
  return props.type === 'device'
      ? {
        sorts: [{name: 'alarmTime', order: 'desc'}],
        "terms": [
          {
            "terms": [
              {
                "column": "sourceId",
                "value": current.value.id,
                "termType": "eq"
              },
              {
                "column": "targetType",
                "value": "device",
                "termType": "eq"
              }
            ],
            "type": "and"
          }
        ]
      }
      : {
        sorts: [{name: 'alarmTime', order: 'desc'}],

        "terms": [
          {
            "terms": [
              {
                "column": "sourceId$dev-instance",
                "value": [
                  {
                    "column": "productId",
                    "value": current.value.id,
                    "termType": "eq"
                  }
                ]
              },
              {
                "column": "targetType",
                "value": [
                  "device",
                  "product"
                ],
                "termType": "in"
              }
            ],
            "type": "and"
          }
        ]
      };
})
const handleSearch = (e) => {
  params.value = e;
};

const getLevelData = (slotProps) => {
  const dt = levelList.value.find(i => i.level === slotProps?.level);
  return dt ? (dt?.i18nMessages?.[localLanguage] || dt.title) : '--'
}
const queryHandle = async (id) => {
  const res = await queryPreHandleHistory(id, {
    sorts: [{name: 'handleTime', order: 'desc'}],
    terms: [
      {
        columns: 'alarmRecordId',
        termType: 'eq',
        value: id
      }
    ]
  });
  if (res.status === 200 && res.result?.data.length) {
    handleDescription.value = res.result.data?.[0]?.description;
  }
};
const getActions = (data) => {
  if (!data) return [];
  const actions =
      data.state.value === 'normal'
          ? [
            {
              key: 'view',
              text: $t('Alarm.index.101383-14'),
              tooltip: {
                title: $t('Alarm.index.101383-14'),
              },
              onClick: async () => {
                solveType.value = 'view';
                await queryHandle(data.id);
                solveVisible.value = true;
              },
            },
            {
              key: 'log',
              text: $t('Alarm.index.101383-15'),
              tooltip: {
                title: $t('Alarm.index.101383-15'),
              },
              onClick: () => {
                visibleDrawer.value = true;
                currentAlarm.value = data;
              },
            },
          ]
          : [
            {
              key: 'solve',
              text: $t('Alarm.index.101383-16'),
              tooltip: {
                title: $t('Alarm.index.101383-16'),
              },
              onClick: () => {
                solveVisible.value = true;
                solveType.value = 'handle';
                currentAlarm.value = data;
              },
            },
            {
              key: 'log',
              text: $t('Alarm.index.101383-15'),
              tooltip: {
                title: $t('Alarm.index.101383-15'),
              },
              onClick: () => {
                visibleDrawer.value = true;
                currentAlarm.value = data;
              },
            },
          ];
  return actions;
};
const closeSolve = () => {
  solveVisible.value = false;
};

const refreshCurrent = async () => {
  const res = await queryAlarmRecord({
    terms: [
      {
        column: 'id',
        termType: 'eq',
        value: currentAlarm.value.id,
      },
      // {
      //   column: 'alarmConfigSource',
      //   value: 'device-property-preprocessor',
      //   termType: 'eq',
      // },
    ],
  });
  if (res.success && res.result?.data?.length) {
    currentAlarm.value = res.result.data[0];
  }
};

const gotoDevice = (id) => {
  menuStory.jumpPage('device/Instance/Detail', {params: {id, tab: 'Running'}});
};
const refresh = () => {
  deviceAlarm.value?.reload();
  refreshCurrent();
};
const solveRefresh = () => {
  solveVisible.value = false;
  refresh();
};

const getLevelList = async () => {
  const resp = await queryLevel()
  if(resp.success){
    levelList.value = resp.result?.levels || []
  }
}

getLevelList()
</script>
<style lang="less" scoped>
.deviceId {
  cursor: pointer;
  color: #4096ff;
}

.sourceName {
  display: flex;

  .name {
    white-space: nowrap;
  }
}
</style>
