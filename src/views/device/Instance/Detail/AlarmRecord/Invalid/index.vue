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
                {{ $t('Invalid.index.584341-0') }}
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
        title: $t('Invalid.index.584341-1'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: $t('Invalid.index.584341-2'),
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: $t('Invalid.index.584341-3'),
        dataIndex: 'value',
        key: 'value',
        search: {
            type: 'string',
        },
    },
] : [
    {
        title: $t('Invalid.index.584341-1'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: $t('Invalid.index.584341-4'),
        dataIndex: 'thingId',
        key: 'thingId',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Invalid.index.584341-2'),
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: $t('Invalid.index.584341-3'),
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

