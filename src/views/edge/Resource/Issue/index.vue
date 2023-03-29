<template>
    <j-modal
        visible
        title="下发设备"
        :width="1000"
        @ok="onSave"
        @cancel="onCancel"
    >
        <div class="resource-issue-alert">
            <AIcon
                type="InfoCircleOutlined"
                style="margin-right: 10px"
            />离线设备无法进行设备模板下发
        </div>
        <pro-search
            :columns="columns"
            target="edge-resource-issue"
            @search="handleSearch"
            type="simple"
            class="resource-issue-search"
        />
        <JProTable
            ref="edgeResourceIssueRef"
            :columns="columns"
            :request="queryDeviceList"
            :defaultParams="defaultParams"
            :params="params"
            model="TABLE"
            :bodyStyle="{ padding: 0 }"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            :pagination="{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
            }"
        >
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state?.text"
                    :status="statusMap.get(slotProps.state?.value)"
                />
            </template>
            <template #sourceId="slotProps">
                {{ slotProps.sourceName }}
            </template>
            <template #registerTime="slotProps">
                <span>{{
                    dayjs(slotProps.registerTime).format('YYYY-MM-DD HH:mm:ss')
                }}</span>
            </template>
        </JProTable>
        <Result
            v-if="visible"
            :data="props.data"
            :list="_data"
            @close="onCancel"
        />
    </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { queryDeviceList } from '@/api/edge/resource';
import dayjs from 'dayjs';
import Result from './Result.vue';
import { queryNoPagingPost } from '@/api/device/product';

const defaultParams = {
    pageSize: 10,
    sorts: [{ name: 'registerTime', order: 'desc' }],
    terms: [
        {
            terms: [
                {
                    termType: 'eq',
                    column: 'productId$product-info',
                    value: 'accessProvider is official-edge-gateway',
                },
            ],
            type: 'and',
        },
    ],
};

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(['close']);

const params = ref({});
const edgeResourceIssueRef = ref();
const _selectedRowKeys = ref<string[]>([]);
const _data = ref<any[]>([]);
const visible = ref<boolean>(false);

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            type: 'select',
            rename: 'productId',
            first: true,
            options: () =>
                new Promise((resolve) => {
                    queryNoPagingPost({ paging: false }).then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: '设备名称',
        ellipsis: true,
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '注册时间',
        dataIndex: 'registerTime',
        key: 'registerTime',
        width: 200,
        scopedSlots: true,
        search: {
            type: 'date',
            rename: 'registryTime'
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
    },
];

const onSelectChange = (keys: string[], _options: any[]) => {
    _selectedRowKeys.value = [...keys];
    _data.value = _options;
};

const handleSearch = (v: any) => {
    params.value = v;
};

const onSave = () => {
    if (_data.value.length) {
        visible.value = true;
    } else {
        onlyMessage('请选择设备', 'error');
    }
};

const onCancel = () => {
    emit('close');
};
</script>

<style lang="less">
.resource-issue-search {
    padding: 18px 0 0 0;
    margin: 0px;
}
.resource-issue-alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
</style>