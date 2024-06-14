<template>
    <pro-search
        :columns="columns"
        target="device-instance"
        @search="handleSearch"
    />
    <JProTable
        :columns="columns"
        model="TABLE"
        :request="queryAlarmRecord"
        :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            column: 'sourceId',
                            value: current.id,
                            termType: 'eq',
                        },
                    ],
                    type: 'and',
                },
            ],
        }"
        :params="params"
    >
    </JProTable>
</template>

<script setup>
import { query as queryAlarmRecord } from '@/api/rule-engine/log';
import { useInstanceStore } from '@/store/instance';
const { current } = useInstanceStore();
const columns = [
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
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
        title: '告警持续时长',
        dataIndex: 'handleTime',
        key: 'handleTime',
        scopedSlots: true,
    },
    {
        title: '处理类型',
        dataIndex: 'handleType',
        key: 'handleType',
        scopedSlots: true,
    },
];
const params = ref();
const handleSearch = (e) => {
    params.value = e;
};
onMounted(() => {});
</script>
<style lang="less" scoped></style>
