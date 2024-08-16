<template>
    <pro-search
        :columns="columns"
        target="device-instance"
        type="simple"
        @search="handleSearch"
    />
    <JProTable
        ref="deviceAlarm"
        :columns="columns"
        model="TABLE"
        :request="queryAlarmRecord"
        :defaultParams="defaultParams"
        :params="params"
    >
        <template #alarmTime="slotProps">
            {{ dayjs(slotProps.alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #duration="slotProps">
            <Duration :data="slotProps" />
        </template>
        <template #handleTime="slotProps">
            {{
                slotProps.handleTime
                    ? dayjs(slotProps.handleTime).format('YYYY-MM-DD HH:mm:ss')
                    : '--'
            }}
        </template>
        <template #sourceId="slotProps">
            <Ellipsis>
                {{ $t('Alarm.index.584342-0') }}
                <span class="deviceId"  @click="() => gotoDevice(slotProps.sourceId)">{{ slotProps.sourceId }}</span></Ellipsis
            >
        </template>
        <template #handleType="slotProps">
            {{ slotProps?.handleType?.text || '--' }}
        </template>
        <template #state="slotProps">
            {{ slotProps?.state?.value === 'normal' ? $t('Alarm.index.584342-1') : $t('Alarm.index.584342-2') }}
        </template>
        <template #actions="slotProps">
            <j-space>
                <template v-for="i in getActions(slotProps)" :key="i.key">
                    <PermissionButton
                        :popConfirm="i.popConfirm"
                        :tooltip="{
                            ...i.tooltip,
                        }"
                        @click="i.onClick"
                        type="link"
                        style="padding: 0 5px"
                        :hasPermission="
                            i.key == 'solve'
                                ? 'rule-engine/Alarm/Log:action'
                                : 'rule-engine/Alarm/Log:view'
                        "
                    >
                        {{ i.text }}
                    </PermissionButton>
                </template>
            </j-space>
        </template>
    </JProTable>
    <Solve
        v-if="solveVisible"
        :data="currentAlarm"
        :solveType="solveType"
        :handleDes="handleDescription"
        @closeSolve="closeSolve"
        @refresh="solveRefresh"
    />
    <AlarmLog
        v-if="visibleDrawer"
        :data="currentAlarm"
        @closeDrawer="visibleDrawer = false"
        @refreshTable="refresh"
    />
</template>

<script setup>
import {
    queryByDevice as queryAlarmRecord,
    queryHandleHistory,
} from '@/api/rule-engine/log';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import dayjs from 'dayjs';
import Duration from '@/views/rule-engine/Alarm/Log/components/Duration.vue';
import Solve from '@/views/rule-engine/Alarm/Log/SolveComponent/index.vue';
import AlarmLog from './components/AlarmLog.vue';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    goal: {
        type: String,
        default: 'device',
    },
});
const menuStory = useMenuStore();
const { current } =
    props.goal === 'device' ? useInstanceStore() : useProductStore();
const columns =
    props.goal === 'device'
        ? [
              {
                  title: $t('Alarm.index.584342-3'),
                  dataIndex: 'alarmTime',
                  key: 'alarmTime',
                  search: {
                      type: 'date',
                  },
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-4'),
                  dataIndex: 'duration',
                  key: 'duration',
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-5'),
                  dataIndex: 'triggerDesc',
                  key: 'triggerDesc',
              },
              {
                  title: $t('Alarm.index.584342-6'),
                  dataIndex: 'actualDesc',
                  key: 'actualDesc',
              },
              {
                  title: $t('Alarm.index.584342-7'),
                  dataIndex: 'handleTime',
                  key: 'handleTime',
                  search: {
                      type: 'date',
                  },
                  scopedSlots: true,
              },

              {
                  title: $t('Alarm.index.584342-8'),
                  dataIndex: 'handleType',
                  key: 'handleType',
                  search: {
                      type: 'select',
                      options: [
                          {
                              label: $t('Alarm.index.584342-9'),
                              value: 'user',
                          },
                          {
                              label: $t('Alarm.index.584342-10'),
                              value: 'system',
                          },
                      ],
                  },
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-11'),
                  dataIndex: 'state',
                  key: 'state',
                  search: {
                      type: 'select',
                      options: [
                          {
                              label: $t('Alarm.index.584342-1'),
                              value: 'normal',
                          },
                          {
                              label: $t('Alarm.index.584342-2'),
                              value: 'warning',
                          },
                      ],
                  },
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-12'),
                  dataIndex: 'actions',
                  key: 'actions',
                  scopedSlots: true,
              },
          ]
        : [
              {
                  title: $t('Alarm.index.584342-3'),
                  dataIndex: 'alarmTime',
                  key: 'alarmTime',
                  search: {
                      type: 'date',
                  },
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-4'),
                  dataIndex: 'duration',
                  key: 'duration',
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-5'),
                  dataIndex: 'triggerDesc',
                  key: 'triggerDesc',
              },
              {
                  title: $t('Alarm.index.584342-13'),
                  dataIndex: 'sourceId',
                  key: 'sourceId',
                  scopedSlots: true,
                  search: {
                      type: 'string',
                  },
              },
              {
                  title: $t('Alarm.index.584342-6'),
                  dataIndex: 'actualDesc',
                  key: 'actualDesc',
              },
              {
                  title: $t('Alarm.index.584342-7'),
                  dataIndex: 'handleTime',
                  key: 'handleTime',
                  search: {
                      type: 'date',
                  },
                  scopedSlots: true,
              },

              {
                  title: $t('Alarm.index.584342-8'),
                  dataIndex: 'handleType',
                  key: 'handleType',
                  search: {
                      type: 'select',
                      options: [
                          {
                              label: $t('Alarm.index.584342-9'),
                              value: 'user',
                          },
                          {
                              label: $t('Alarm.index.584342-10'),
                              value: 'system',
                          },
                      ],
                  },
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-11'),
                  dataIndex: 'state',
                  key: 'state',
                  search: {
                      type: 'select',
                      options: [
                          {
                              label: $t('Alarm.index.584342-1'),
                              value: 'normal',
                          },
                          {
                              label: $t('Alarm.index.584342-2'),
                              value: 'warning',
                          },
                      ],
                  },
                  scopedSlots: true,
              },
              {
                  title: $t('Alarm.index.584342-12'),
                  dataIndex: 'actions',
                  key: 'actions',
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
const defaultParams =
    props.goal === 'device'
        ? {
              sorts: [{ name: 'alarmTime', order: 'desc' }],
              terms: [
                  {
                      terms: [
                          {
                              column: 'targetId',
                              value: current.id,
                              termType: 'eq',
                          },
                          {
                              column: 'alarmConfigSource',
                              value: 'device-property-preprocessor',
                              termType: 'eq',
                          },
                      ],
                      type: 'and',
                  },
              ],
          }
        : {
              sorts: [{ name: 'alarmTime', order: 'desc' }],
              terms: [
                  {
                      terms: [
                          {
                              column: 'targetId$dev-instance',
                              value: [
                                  {
                                      column: 'product_id',
                                      value: current.id,
                                      termType: 'eq',
                                  },
                              ],
                          },
                          {
                              column: 'alarmConfigSource',
                              value: 'device-property-preprocessor',
                              termType: 'eq',
                          },
                      ],
                      type: 'and',
                  },
              ],
          };
const handleSearch = (e) => {
    params.value = e;
};
const queryHandle = async (id) => {
    const res = await queryHandleHistory({
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                column: 'alarmRecordId',
                termType: 'eq',
                value: id,
                type: 'and',
            },
        ],
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
                      text: $t('Alarm.index.584342-14'),
                      tooltip: {
                          title: $t('Alarm.index.584342-14'),
                      },
                      onClick: async () => {
                          solveType.value = 'view';
                          await queryHandle(data.id);
                          solveVisible.value = true;
                      },
                  },
                  {
                      key: 'log',
                      text: $t('Alarm.index.584342-15'),
                      tooltip: {
                          title: $t('Alarm.index.584342-15'),
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
                      text: $t('Alarm.index.584342-16'),
                      tooltip: {
                          title: $t('Alarm.index.584342-16'),
                      },
                      onClick: () => {
                          solveVisible.value = true;
                          solveType.value = 'handle';
                          currentAlarm.value = data;
                      },
                  },
                  {
                      key: 'log',
                      text: $t('Alarm.index.584342-15'),
                      tooltip: {
                          title: $t('Alarm.index.584342-15'),
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
            {
                column: 'alarmConfigSource',
                value: 'device-property-preprocessor',
                termType: 'eq',
            },
        ],
    });
    if (res.success && res.result?.data?.length) {
        currentAlarm.value = res.result.data[0];
    }
};

const gotoDevice = (id) => {
    menuStory.jumpPage('device/Instance/Detail', { id, tab: 'Running' });
};
const refresh = () => {
    deviceAlarm.value?.reload();
    refreshCurrent();
};
const solveRefresh = () => {
    solveVisible.value = false;
    refresh();
};
</script>
<style lang="less" scoped>
.deviceId {
    cursor: pointer;
    color: #4096ff;
}
</style>
