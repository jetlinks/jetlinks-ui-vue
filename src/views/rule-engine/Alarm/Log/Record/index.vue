<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="bind-channel"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                model="TABLE"
                :columns="columns"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :request="query"
                :params="params"
            >
                <template #headerTitle>
                    <h3>记录列表</h3>
                </template>
                <template #handleTime="slotsProps">
                    <span>
                        {{
                            slotsProps?.handleTime
                                ? dayjs(slotsProps.handleTime).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : '--'
                        }}
                    </span>
                </template>
                <template #handleType="slotProps">
                    <span>{{ slotProps.handleType?.text || '--' }}</span>
                </template>
                <template #alarmDuration="slotProps">
                    <Ellipsis><Duration :data="slotProps" /></Ellipsis>
                </template>
                <template #state="slotProps">{{
                    slotProps?.state?.text
                }}</template>
                <template #alarmTime="slotProps">
                    <span>
                        {{
                            dayjs(slotProps.alarmTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </span>
                </template>
                <template #description="slotProps">
                    {{ slotProps?.description || '--' }}
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import Duration from '../components/Duration.vue';
const route = useRoute();
const id = route.query?.id;
const columns = [
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        width: 180,
    },
    {
        title: '处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
        scopedSlots: true,
        width: 180,
        search: {
            type: 'date',
        },
    },
    {
        title: '告警持续时长',
        dataIndex: 'alarmDuration',
        key: 'alarmDuration',
        scopedSlots: true,
        width: 180,
    },
    {
        title: '处理状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        scopedSlots: true,
    },
    {
        dataIndex: 'handleType',
        title: '处理类型',
        key: 'handleType',
        scopedSlots: true,
        width: 120,
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
        title: '处理结果',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        scopedSlots:true,
        search: {
            type: 'string',
        },
    },
];
const params = ref();
const query = async (queryParams) => {
    return queryHandleHistory(id, queryParams);
};
const emit = defineEmits(['closeLog']);
/**
 * 关闭弹窗
 */

const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped></style>
