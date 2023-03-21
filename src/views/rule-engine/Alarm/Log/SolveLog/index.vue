<template>
    <j-modal
        visible
        title="处理记录"
        :width="1200"
        cancelText="取消"
        okText="确定"
        @ok="clsoeModal"
        @cancel="clsoeModal"
    >
        <pro-search
            :columns="columns"
            target="bind-channel"
            @search="handleSearch"
        />
        <JProTable
            model="TABLE"
            :columns="columns"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms,
            }"
            :request="queryHandleHistory"
            :params="params"
        >
            <template #headerTitle>
                <h3>记录列表</h3>
            </template>
            <template #handleTime="slotsProps">
                <span>
                    {{
                        dayjs(slotsProps.handleTime).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    }}
                </span>
            </template>
            <template #handleType="slotProps">
                <span>{{ slotProps.handleType.text }}</span>
            </template>
            <template #alarmTime="slotProps">
                <span>
                    {{
                        dayjs(slotProps.alarmTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}
                </span>
            </template>
        </JProTable>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
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
        scopedSlots: true,
        search: {
            type: 'date',
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
const params = ref();
const emit = defineEmits(['closeLog']);
/**
 * 关闭弹窗
 */
const clsoeModal = () => {
    emit('closeLog');
};

const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
</style>