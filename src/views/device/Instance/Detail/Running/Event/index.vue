<template>
    <pro-search class="device-search" type="simple" :columns="columns" target="device-instance-running-events" @search="handleSearch" />
    <JProTable
        ref="eventsRef"
        :columns="columns"
        :request="_getEventList"
        model="TABLE"
        :params="params"
        :bodyStyle="{ padding: '0 0 0 24px' }"
    >
        <template #timestamp="slotProps">
            {{ dayjs(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #action="slotProps">
            <j-button type="link" @click="detail(slotProps)">
                <AIcon type="SearchOutlined" />
            </j-button>
        </template>
    </JProTable>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { getEventList } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { Modal } from 'jetlinks-ui-components';
import JsonViewer from 'vue-json-viewer';

const events = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const instanceStore = useInstanceStore();

const columns = ref<Record<string, any>>([
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
]);
const params = ref<Record<string, any>>({});

const _getEventList = (_params: any) =>
    getEventList(
        instanceStore.current.id || '',
        events.data.id || '',
        _params
    );

watchEffect(() => {
    if (events.data?.valueType?.type === 'object') {
        (events.data.valueType?.properties || []).reverse().map((i: any) => {
            columns.value.splice(0, 0, {
                key: i.id,
                title: i.name,
                dataIndex: `${i.id}_format`,
                search: {
                    type: i?.valueType?.type || 'string',
                }
            });
        });
    } else {
        columns.value.splice(0, 0, {
            title: '数据',
            dataIndex: 'value',
        });
    }
});

const handleSearch = (_params: any) => {
    params.value = _params;
};

const detail = (_info: any) => {
    Modal.info({
        title: () => '详情',
        width: 850,
        content: () => h('JsonViewer', {
            'expand-depth': 5,
            value: _info
        }),
        okText: '关闭',
    });
};
</script>

<style lang="less">
.device-search {
    margin: 0 0 24px 0 ;
}
</style>