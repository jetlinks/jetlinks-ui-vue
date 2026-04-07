<template>
    <pro-search
        :columns="columns"
        target="device-instance"
        @search="handleSearch"
        type="simple"
        style="margin: 0; padding-bottom: 0;"
    ></pro-search>
    <JProTable
        ref="deviceAlarm"
        :columns="columns"
        mode="TABLE"
        :request="queryInvalidData"
        :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            column:
                                props.type === 'device'
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
    >
        <template #createTime="slotProps">
            {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #thingName="slotProps">
            <j-ellipsis>
                {{ $t('Invalid.index.031367-0') }}
                <span
                    class="deviceId"
                     @click="() => gotoDevice(slotProps.thingId)"
                    >{{ slotProps.thingName }}</span
                ></j-ellipsis
            >
        </template>
    </JProTable>
</template>

<script setup>
import { queryInvalidData } from '@device-manager-ui/api/rule-engine/log';
import { useInstanceStore } from '@device-manager-ui/store/instance';
import { useProductStore } from '@device-manager-ui/store/product';
import { useMenuStore } from '@jetlinks-web-core/store';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const props = defineProps({
  type: {
        type: String,
        default: 'device',
    },
});
const menuStory = useMenuStore();
const { current } =
    props.type === 'device' ? useInstanceStore() : useProductStore();
const columns = props.type === 'device' ? [
    {
        title: $t('Invalid.index.031367-1'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Invalid.index.031367-2'),
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: $t('Invalid.index.031367-3'),
        dataIndex: 'value',
        key: 'value',
        search: {
            type: 'string',
        },
    },
] : [
    {
        title: $t('Invalid.index.031367-1'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Invalid.index.031367-4'),
        dataIndex: 'thingName',
        key: 'thingName',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Invalid.index.031367-2'),
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: $t('Invalid.index.031367-3'),
        dataIndex: 'value',
        key: 'value',
        search: {
            type: 'string',
        },
    },
]

const gotoDevice = (id) => {
    menuStory.jumpPage('device/Instance/Detail', { params: { id, tab: 'Running' }});
};
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

