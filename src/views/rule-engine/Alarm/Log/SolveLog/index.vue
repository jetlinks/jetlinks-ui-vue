<template>
    <a-modal
        visible
        title="处理记录"
        :width="1200"
        cancelText="取消"
        okText="确定"
    >
        <Search :columns="columns" target="bind-channel"></Search>
        <JTable
            model="TABLE"
            :columns="columns"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms,
            }"
            :request="queryHandleHistory"
        >
            <template #alarmTime="slotProps">
                <span>
                    {{
                        moment(slotProps.alarmTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}
                </span>
            </template>
        </JTable>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
import moment from 'moment';
const props = defineProps({
    data: {
        type: Object,
    },
});
const terms = [
    {
        column: 'alarmRecordId',
        termType: 'eq',
        value: props.data.id,
        type: 'and',
    },
];
const columns = [
    {
        title: '处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
        search: {
            type: 'string',
        },
    },
    {
        dataIndex: 'handleType',
        title: '处理类型',
        key: 'handleType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '系统',
                    value: 'system',
                },
                {
                    label: '人工',
                    value: 'user',
                },
            ],
        },
    },
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '告警处理',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
];
</script>
<style lang="less" scoped>
</style>