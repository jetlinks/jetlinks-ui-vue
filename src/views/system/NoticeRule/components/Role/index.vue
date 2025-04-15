<template>
    <div class="role">
        <template v-if="type !== 'add'">
            <a-input-search
                allowClear
                @search="onSearch"
                :placeholder="$t('Role.index.617700-0')"
            />
            <div class="role-alert">
                <a-alert type="info">
                    <template #message>
                        <div class="header">
                            <a-checkbox
                                :indeterminate="indeterminate"
                                :checked="checked"
                                @change="onSelectAll"
                                >{{ $t('Role.index.617700-1') }}</a-checkbox
                            >
                            <a-space v-if="_selectedRowKeys.length">
                                <span
                                    >{{ $t('Role.index.617700-2') }}{{ _selectedRowKeys.length }}{{ $t('Role.index.617700-3') }}</span
                                >
                                <a-button
                                    style="padding: 0; height: 22px"
                                    type="link"
                                    @click="cancelSelect"
                                    >{{ $t('Role.index.617700-4') }}</a-button
                                >
                            </a-space>
                        </div>
                    </template>
                </a-alert>
            </div>
        </template>
        <template v-else>
            <div class="role-alert" style="margin-bottom: 10px;">
                <a-alert type="info">
                    <template #message>
                        <div style="justify-content: space-between; display: flex; align-items: center;">
                            <a-input-search
                                allowClear
                                @search="onSearch"
                                :placeholder="$t('Role.index.617700-0')"
                                style="width: 300px"
                            />
                            <a-space>
                                <template v-if="_selectedRowKeys.length">
                                    <span
                                        >{{ $t('Role.index.617700-2') }}{{
                                            _selectedRowKeys.length
                                        }}{{ $t('Role.index.617700-3') }}</span
                                    >
                                    <a-button
                                        style="padding: 0; height: 22px"
                                        type="link"
                                        @click="cancelSelect"
                                        >{{ $t('Role.index.617700-4') }}</a-button
                                    >
                                </template>

                                <a-checkbox
                                    :indeterminate="indeterminate"
                                    :checked="checked"
                                    @change="onSelectAll"
                                    >{{ $t('Role.index.617700-1') }}</a-checkbox
                                >
                            </a-space>
                        </div>
                    </template>
                </a-alert>
            </div>
        </template>
        <j-scrollbar :height="gridColumn <= 2 ? '320px' : '250px'">
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="queryRoleList"
                mode="CARD"
                :params="params"
                :bodyStyle="{ padding: 0 }"
                :gridColumn="gridColumn"
                :alertShow="false"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                }"
            >
                <template #card="slotProps">
                    <div class="card">
                        <a-checkbox
                            :checked="_selectedRowKeys.includes(slotProps?.id)"
                            @change="(e) => onSelect(e, slotProps)"
                        >
                            <j-ellipsis>{{ slotProps.name }}</j-ellipsis>
                        </a-checkbox>
                    </div>
                </template>
            </j-pro-table>
        </j-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { queryRoleList } from '@/api/system/noticeRule';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    modelValue: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
    gridColumn: {
        type: Number,
        default: 3,
    },
    type: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

const params = ref<any>();
const _selectedRowKeys = ref<string[]>([]);
const tableRef = ref();

const dataSource = computed(() => {
    return tableRef.value?.dataSource || [];
});

const indeterminate = computed(() => {
    return (
        dataSource.value.some((item: any) => {
            return _selectedRowKeys.value.includes(item.id);
        }) && !checked.value
    );
});

const checked = computed(() => {
    return dataSource.value.every((item: any) => {
        return _selectedRowKeys.value.includes(item.id);
    });
});

watchEffect(() => {
    _selectedRowKeys.value = props?.modelValue || [];
});

const columns = [
    {
        title: $t('Role.index.617700-5'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
    },
    {
        title: $t('Role.index.617700-6'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Role.index.617700-7'),
        key: 'description',
        ellipsis: true,
        dataIndex: 'description',
    },
];

const onSearch = (val: any) => {
    params.value = {
        terms: [
            {
                column: 'name',
                termType: 'like',
                value: `%${val || ''}%`,
            },
        ],
    };
};

// 取消全选
const cancelSelect = () => {
    _selectedRowKeys.value = [];
    emit('update:modelValue', []);
};

const onSelect = (e: any, record: any) => {
    const _set = new Set(_selectedRowKeys.value);
    const selected = e.target.checked;
    if (selected) {
        _set.add(record.id);
    } else {
        _set.delete(record.id);
    }
    emit('update:modelValue', [..._set.values()]);
};

const onSelectAll = (e: any) => {
    const selected = e.target.checked;
    const _set = new Set(_selectedRowKeys.value);
    const arr = dataSource.value.map((item: any) => item?.id);
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

<style lang="less" scoped>
.role {
    :deep(.jtable-content) {
        padding: 2px 0 16px 0;
    }
    :deep(.jtable-card-items) {
        grid-gap: 2px !important;
    }

    .role-alert {
        margin-top: 16px;
    }

    .header {
        display: flex;
    }
}
.card {
    width: 100%;
    background-color: #f8f9fc;
    padding: 10px 16px;
}
</style>
