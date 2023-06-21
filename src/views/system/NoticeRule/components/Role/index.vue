<template>
    <pro-search
        style="padding: 0"
        type="simple"
        :columns="columns"
        target="category"
        @search="onSearch"
    />
    <j-pro-table
        ref="tableRef"
        :columns="columns"
        :request="queryRoleList"
        model="TABLE"
        :params="params"
        :bodyStyle="{ padding: 0 }"
        :scroll="{ y: 500 }"
        :defaultParams="{
            // pageSize: 10,
            sorts: [
                { name: 'createTime', order: 'desc' },
                { name: 'id', order: 'desc' },
            ],
        }"
        :rowSelection="{
            selectedRowKeys: _selectedRowKeys,
            onSelect: onSelect,
            onSelectAll: onSelectAll,
            onSelectNone: cancelSelect,
        }"
    >
        <!-- <template #headerTitle>
                <j-checkbox v-model:checked="checked">全选</j-checkbox>
            </template> -->
    </j-pro-table>
</template>

<script lang="ts" setup>
import { queryRoleList } from '@/api/system/noticeRule';
import { PropType } from 'vue';

const props = defineProps({
    modelValue: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
});

const emit = defineEmits(['update:modelValue']);

const params = ref<any>();
const _selectedRowKeys = ref<string[]>([]);

watchEffect(() => {
    _selectedRowKeys.value = props?.modelValue || [];
});

const columns = [
    {
        title: '标识',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '说明',
        key: 'description',
        ellipsis: true,
        dataIndex: 'description',
    },
];

const onSearch = (e: any) => {
    params.value = e;
};

// 取消全选
const cancelSelect = () => {
    _selectedRowKeys.value = [];
    emit('update:modelValue', []);
};

const onSelect = (record: any, selected: boolean) => {
    const _set = new Set(_selectedRowKeys.value);
    if (selected) {
        _set.add(record.id);
    } else {
        _set.delete(record.id);
    }
    emit('update:modelValue', [..._set.values()]);
};

const onSelectAll = (selected: boolean, _: any[], _keys: any[]) => {
    const _set = new Set(_selectedRowKeys.value);
    const arr = _keys.map((item: any) => item?.id);
    if (selected) {
        arr.map((i: any) => {
            _set.add(i);
        });
    } else {
        arr.map((i: any) => {
            _set.delete(i);
        });
    }
    emit('update:modelValue', [..._set.values()]);
};
</script>