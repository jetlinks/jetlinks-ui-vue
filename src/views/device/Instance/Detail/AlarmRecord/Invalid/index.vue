<template>
    <pro-search
        :columns="columns"
        target="device-instance"
        @search="handleSearch"
    ></pro-search>
    <JProTable
        ref="deviceAlarm"
        :columns="columns"
        model="TABLE"
        :request="queryInvalidData"
        :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            column:
                                props.goal === 'device'
                                    ? 'thingId'
                                    : 'templateId',
                            value: current.id,
                            termType: 'eq',
                        },
                    ],
                    type: 'and',
                },
            ],
        }"
        :params="params"
        ><template #createTime="slotProps">
            {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #thingId="slotProps">
            <Ellipsis>
                设备ID：
                <span
                    class="deviceId"
                    >{{ slotProps.thingId }}</span
                ></Ellipsis
            >
        </template>
    </JProTable>
</template>

<script setup>
import { queryInvalidData } from '@/api/rule-engine/log';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import dayjs from 'dayjs';
const props = defineProps({
    goal: {
        type: String,
        default: 'device',
    },
});
const { current } =
    props.goal === 'device' ? useInstanceStore() : useProductStore();
const columns = props.goal === 'device' ? [
    {
        title: '上报时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: '阈值限制',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '原始值',
        dataIndex: 'value',
        key: 'value',
        search: {
            type: 'string',
        },
    },
] : [
    {
        title: '上报时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: '告警源',
        dataIndex: 'thingId',
        key: 'thingId',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '阈值限制',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '原始值',
        dataIndex: 'value',
        key: 'value',
        search: {
            type: 'string',
        },
    },
]
const handleSearch = (e) => {
    params.value = e;
};
const params = ref();
</script>
<style lang="less" scoped>
.deviceId {
    cursor: pointer;
    color:#4096FF;
}
</style>

