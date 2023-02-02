<!-- 操作记录 -->
<template>
    <page-container>
        <Search
            :columns="columns"
            target="record-search"
            @search="handleSearch"
        />
        <JTable
            ref="RecordRef"
            :columns="columns"
            :request="queryList"
            :defaultParams="{ sorts: [{ name: 'time', order: 'desc' }] }"
            :params="params"
            :model="'TABLE'"
        >
            <template #time="slotProps">
                {{
                    slotProps.time
                        ? moment(slotProps.time).format('YYYY-MM-DD HH:mm:ss')
                        : ''
                }}
            </template>
        </JTable>
    </page-container>
</template>

<script setup lang="ts">
import { queryList } from '@/api/iot-card/record';
import moment from 'moment';

const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '卡号',
        dataIndex: 'cardId',
        key: 'cardId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作类型',
        dataIndex: 'type',
        key: 'type',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作时间',
        dataIndex: 'time',
        key: 'time',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style scoped lang="less"></style>
