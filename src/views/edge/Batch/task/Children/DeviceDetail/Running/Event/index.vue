<template>
    <pro-search
        class="device-running-search"
        :columns="columns"
        target="device-instance-running-events"
        @search="handleSearch"
    />
    <JProTable
        ref="eventsRef"
        :columns="columns"
        :request="_getEventList"
        model="TABLE"
        :params="params"
        :bodyStyle="{ padding: '0 0 0 24px' }"
    >
        <template  v-for="i in objectKey" #[i.key]='slotProps'>
            <ValueRender
                v-if="events.data.valueType.properties.find(item => item.id === i.key)?.valueType?.type === 'file'"
                :data="slotProps"
                :dataIndex="i.dataIndex"
            />
            <Ellipsis v-else>
                <span @click="detail(slotProps[i.dataIndex])">{{  JSON.stringify(slotProps[i.dataIndex])}}</span>
            </Ellipsis>
        </template>
        <template #timestamp="slotProps">
            {{ dayjs(slotProps.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <!-- <template #action="slotProps">
            <j-button type="link" @click="detail(slotProps)">
                <AIcon type="SearchOutlined" />
            </j-button>
        </template> -->
    </JProTable>
    <j-modal
        :width="600"
        v-model:visible="visible"
        title="详情"
        class="device-running-event-modal"
    >
        <JsonViewer
            :value="info"
            style="max-height: calc(100vh - 400px); overflow: auto"
        />
        <template #footer>
            <j-button type="primary" @click="visible = false">关闭</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { getEventList } from '@/api/device/instance';
import {getEventListByEdge} from '@/api/edge/batch';
import { useInstanceStore } from '@/store/instance';
import JsonViewer from 'vue-json-viewer';
import { cloneDeep } from 'lodash-es';
import ValueRender from './ValueRender.vue';

const events = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const instanceStore = useInstanceStore();

const defaultColumns = [
    {
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    // {
    //     title: '操作',
    //     dataIndex: 'action',
    //     key: 'action',
    //     scopedSlots: true,
    // },
];

const columns = ref<Array<Record<string, any>>>([...defaultColumns]);
const params = ref<Record<string, any>>({});
const visible = ref<boolean>(false);
const info = ref<Record<string, any>>({});
const objectKey = ref<Array>([]);
const imgLoad = ref(true);
const edgeId = inject('_edgeId')
const _getEventList = (_params: any) =>
    // getEventList(instanceStore.current.id || '', events.data.id || '', _params);
    getEventListByEdge(edgeId,instanceStore.current.id || '', events.data.id || '', _params);

const handleError = () => {
    debugger
}

watchEffect(() => {
    columns.value = [...defaultColumns];
    if (events.data?.valueType?.type === 'object') {
        const eventProperties = cloneDeep(events.data.valueType?.properties || [])
        eventProperties.reverse().map((i: any) => {
            if (i.valueType?.type === 'object') {
                objectKey.value.push({
                    key:i.id,
                    dataIndex: `${i.id}_format`
                });
                columns.value.splice(0, 0, {
                    key: i.id,
                    title: i.name,
                    dataIndex: `${i.id}_format`,
                    search: {
                        type: i?.valueType?.type || 'string',
                        rename: i.id,
                    },
                    scopedSlots: true,
                });
            } else if(i.valueType?.type === 'file') {
                objectKey.value.push({
                    key:i.id,
                    dataIndex: `${i.id}_format`
                });
                columns.value.splice(0, 0, {
                    key: i.id,
                    title: i.name,
                    dataIndex: i.id,
                    scopedSlots: true,
                });
            } else {
                columns.value.splice(0, 0, {
                    key: i.id,
                    title: i.name,
                    dataIndex: `${i.id}_format`,
                    search: {
                        type: i?.valueType?.type || 'string',
                        rename: i.id,
                    },
                    ellipsis: true,
                    scopedSlots: true,
                });
            }
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
    info.value = _info;
    visible.value = true;
    // Modal.info({
    //     title: () => '详情',
    //     width: 850,
    //     content: () => h('JsonViewer', {
    //         'expand-depth': 5,
    //         value: _info
    //     }),
    //     okText: '关闭',
    // });
};
</script>

<style lang="less">
.device-running-search {
    margin: 0 0 24px 0;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.device-running-event-modal {
    .ant-modal-body {
        padding: 0 20px;
    }
}
</style>
