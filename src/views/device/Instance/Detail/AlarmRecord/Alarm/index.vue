<template>
    <pro-search
        :columns="columns"
        target="device-instance"
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
            {{ dayjs(slotProps.handleTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #handleType="slotProps">
            {{ slotProps?.handleType || '--' }}
        </template>
        <template #state="slotProps">
            {{ slotProps?.state?.text }}
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
    query as queryAlarmRecord,
    queryHandleHistory,
} from '@/api/rule-engine/log';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import dayjs from 'dayjs';
import Duration from '@/views/rule-engine/Alarm/Log/components/Duration.vue';
import Solve from '@/views/rule-engine/Alarm/Log/SolveComponent/index.vue';
import AlarmLog from './components/AlarmLog.vue';
const props = defineProps({
    goal: {
        type: String,
        default: 'device',
    },
});
const { current } =
    props.goal === 'device' ? useInstanceStore() : useProductStore();
const columns = [
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: '告警持续时长',
        dataIndex: 'duration',
        key: 'duration',
        scopedSlots: true,
    },
    {
        title: '触发条件',
        dataIndex: 'triggerDesc',
        key: 'triggerDesc',
    },
    {
        title: '告警原因',
        dataIndex: 'actualDesc',
        key: 'actualDesc',
    },
    {
        title: '处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: '处理类型',
        dataIndex: 'handleType',
        key: 'handleType',
        search: {
            type: 'select',
            options: [
                {
                    label: '人工',
                },
                {
                    label: '系统',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '无告警',
                    value: ' normal',
                },
                {
                    label: '告警中',
                    value: 'warning',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '操作',
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
              sorts: [{ name: 'createTime', order: 'desc' }],
              terms: [
                  {
                      terms: [
                          {
                              column: 'targetId',
                              value: current.id,
                              termType: 'eq',
                          },
                      ],
                      type: 'and',
                  },
              ],
          }
        : {
              sorts: [{ name: 'createTime', order: 'desc' }],
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
    if (res.success && res.result?.data.length) {
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
                      text: '查看详情',
                      tooltip: {
                          title: '查看详情',
                      },
                      onClick: () => {
                          solveVisible.value = true;
                          solveType.value = 'view';
                          queryHandle(data.id);
                      },
                  },
                  {
                      key: 'log',
                      text: '查看日志',
                      tooltip: {
                          title: '查看日志',
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
                      text: '告警处理',
                      tooltip: {
                          title: '告警处理',
                      },
                      onClick: () => {
                          solveVisible.value = true;
                          currentAlarm.value = data;
                      },
                  },
                  {
                      key: 'log',
                      text: '查看日志',
                      tooltip: {
                          title: '查看日志',
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
const refresh = () => {
    deviceAlarm.value?.reload();
};
const solveRefresh = () => {
    solveVisible.value = false;
    refresh();
};
</script>
<style lang="less" scoped></style>