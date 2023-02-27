<template>
    <Search :columns="columns" target="device-instance-running-events" />
    <JTable
        ref="eventsRef"
        :columns="columns"
        :request="_getEventList"
        model="TABLE"
        :bodyStyle="{ padding: '0 24px' }"
    >
        <template #timestamp="slotProps">
            {{ moment(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #action="slotProps">
            <a-button type="link" @click="detail(slotProps)">
                <AIcon type="SearchOutlined" />
            </a-button>
        </template>
    </JTable>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { getEventList } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { Modal } from 'ant-design-vue';

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

const _getEventList = () =>
    getEventList(
        instanceStore.current.id || '',
        events.data.id || '',
        params.value,
    );

watchEffect(() => {
    if (events.data?.valueType?.type === 'object') {
        (events.data.valueType?.properties || []).map((i: any) => {
            columns.value.splice(0, 0, {
                key: i.id,
                title: i.name,
                dataIndex: `${i.id}_format`,
                search: {
                    type: 'string',
                },
            });
        });
    } else {
        columns.value.splice(0, 0, {
            title: '数据',
            dataIndex: 'value',
        });
    }
});

const detail = () => {
    Modal.info({
        title: () => '详情',
        width: 850,
        content: () => h('div', {}, [h('p', '暂未开发')]),
        okText: '关闭',
    });
};
</script>