<template>
    <j-modal
        visible
        :title="$t('Issue.index.925642-0')"
        :width="1000"
        @ok="onSave"
        @cancel="onCancel"
    >
        <div class="resource-issue-alert">
            <AIcon
                type="InfoCircleOutlined"
                style="margin-right: 10px"
            />{{ $t('Issue.index.925642-1') }}
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
                    slotProps?.registerTime ? dayjs(slotProps.registerTime).format('YYYY-MM-DD HH:mm:ss') : ''
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const defaultParams = {
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
        title: $t('Issue.index.925642-2'),
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
        title: $t('Issue.index.925642-3'),
        ellipsis: true,
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Issue.index.925642-4'),
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
        title: $t('Issue.index.925642-5'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Issue.index.925642-6'), value: 'notActive' },
                { label: $t('Issue.index.925642-7'), value: 'offline' },
                { label: $t('Issue.index.925642-8'), value: 'online' },
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
        onlyMessage($t('Issue.index.925642-9'), 'error');
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