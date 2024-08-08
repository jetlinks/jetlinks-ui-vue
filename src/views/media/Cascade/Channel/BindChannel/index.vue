<!-- 国标级联-绑定通道 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="$t('BindChannel.index.755834-0')"
        :cancelText="$t('BindChannel.index.755834-1')"
        :okText="$t('BindChannel.index.755834-2')"
        width="80%"
        @ok="handleSave"
        @cancel="_vis = false"
        :confirmLoading="loading"
    >
        <pro-search
            :columns="columns"
            target="media-bind"
            @search="handleSearch"
        />

        <JProTable
            ref="listRef"
            model="table"
            :columns="columns"
            :request="CascadeApi.queryChannelList"
            :defaultParams="{
                sorts: [{ name: 'deviceName', order: 'asc' }, { name: 'name', order: 'asc' }],
                terms: [
                    {
                        column: 'id',
                        termType: 'cascade_channel$not',
                        type: 'and',
                        value: route.query.id,
                    },
                    {
                        column: 'catalogType',
                        termType: 'eq',
                        type: 'and',
                        value: 'device',
                    },
                ],
            }"
            :params="params"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelectNone: onSelectNone,
                onSelect: onSelect,
                onSelectAll: onAllSelect,
            }"
        >
            <template #headerTitle>
                <h3>{{ $t('BindChannel.index.755834-3') }}</h3>
            </template>
            <template #status="slotProps">
                <j-space>
                    <j-badge
                        :status="
                            slotProps.status.value === 'online'
                                ? 'success'
                                : 'error'
                        "
                        :text="slotProps.status.text"
                    ></j-badge>
                </j-space>
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import CascadeApi from '@/api/media/cascade';
import { onlyMessage } from '@/utils/comm';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const route = useRoute();

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'submit'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val) => {
        if (val) handleSearch({ terms: [] });
        else _selectedRowKeys.value = [];
    },
);

const columns = [
    {
        title: $t('BindChannel.index.755834-4'),
        dataIndex: 'deviceName',
        key: 'deviceName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindChannel.index.755834-5'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('BindChannel.index.755834-6'),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindChannel.index.755834-7'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindChannel.index.755834-8'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: $t('BindChannel.index.755834-9'), value: 'online' },
                { label: $t('BindChannel.index.755834-10'), value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);

const onSelectNone = () => {
    _selectedRowKeys.value = [];
};

const onSelect = (record: any, selected: boolean) => {
    const _set = new Set([..._selectedRowKeys.value])
    if (selected) {
        _set.add(record.id)
    } else {
        _set.delete(record.id)
    }
    _selectedRowKeys.value = [..._set]
};

const onAllSelect = (selected: boolean, _: any, keys: any[]) => {
    const _keys = keys.map(item => item.id) || []
    const _set = new Set([..._selectedRowKeys.value])
    _keys.map((i: any) => {
        if(selected) {
            _set.add(i)
        } else {
            _set.delete(i)
        }
    });
    _selectedRowKeys.value = [..._set]
};

const loading = ref(false);
const handleSave = async () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage($t('BindChannel.index.755834-11'), 'error');
        return;
    }
    loading.value = true;
    const resp = await CascadeApi.bindChannel(
        route.query.id as string,
        _selectedRowKeys.value,
    ).finally(()=>{
        loading.value = false;
    })
    if (resp.success) {
        onlyMessage($t('BindChannel.index.755834-12'));
        _vis.value = false;
        emit('submit');
    } else {
        onlyMessage($t('BindChannel.index.755834-13'), 'error');
    }
};
</script>
