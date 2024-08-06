<template>
    <div class="role">
        <template v-if="type !== 'add'">
            <j-input-search
                allowClear
                @search="onSearch"
                :placeholder="$t('Role.index.8664410-0')"
            />
            <div class="role-alert">
                <j-alert type="info">
                    <template #message>
                        <div class="header">
                            <j-checkbox
                                :indeterminate="indeterminate"
                                :checked="checked"
                                @change="onSelectAll"
                                >{{ $t('Role.index.8664410-1') }}</j-checkbox
                            >
                            <j-space v-if="_selectedRowKeys.length">
                                <span
                                    >{{ $t('Role.index.8664410-2') }}{{ _selectedRowKeys.length }}{{ $t('Role.index.8664410-3') }}</span
                                >
                                <j-button
                                    style="padding: 0; height: 22px"
                                    type="link"
                                    @click="cancelSelect"
                                    >{{ $t('Role.index.8664410-4') }}</j-button
                                >
                            </j-space>
                        </div>
                    </template>
                </j-alert>
            </div>
        </template>
        <!-- //添加 -->
        <template v-else>
            <div class="role-alert" style="margin-bottom: 10px;">
                <j-alert type="info">
                    <template #message>
                        <div style="justify-content: space-between; display: flex; align-items: center;">
                            <j-input-search
                                allowClear
                                @search="onSearch"
                                :placeholder="$t('Role.index.8664410-0')"
                                style="width: 300px"
                            />
                            <j-space>
                                <template v-if="_selectedRowKeys.length">
                                    <span
                                        >{{ $t('Role.index.8664410-2') }}{{
                                            _selectedRowKeys.length
                                        }}{{ $t('Role.index.8664410-3') }}</span
                                    >
                                    <j-button
                                        style="padding: 0; height: 22px"
                                        type="link"
                                        @click="cancelSelect"
                                        >{{ $t('Role.index.8664410-4') }}</j-button
                                    >
                                </template>

                                <j-checkbox
                                    :indeterminate="indeterminate"
                                    :checked="checked"
                                    @change="onSelectAll"
                                    >{{ $t('Role.index.8664410-1') }}</j-checkbox
                                >
                            </j-space>
                        </div>
                    </template>
                </j-alert>
            </div>
        </template>
        <j-scrollbar :height="gridColumn <= 2 ? '320px' : '250px'">
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="queryRoleList"
                model="CARD"
                :params="params"
                :bodyStyle="{ padding: 0 }"
                :gridColumn="gridColumn"
                :alertRender="false"
                :defaultParams="defaultParams"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                }"
            >
                <template #card="slotProps">
                    <div class="card">
                        <j-checkbox
                            :checked="_selectedRowKeys.includes(slotProps?.id)"
                            @change="(e) => onSelect(e, slotProps)"
                        >
                            <j-ellipsis>{{ slotProps.name }}</j-ellipsis>
                        </j-checkbox>
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
    return tableRef.value?._dataSource || [];
});
const defaultParams = ref({
  sorts: [{ name: 'id', order: 'asc', value: 'id' }],
});
onMounted(() => {
  // 将modelValue数组中的值依次插入到defaultParams.value.sorts数组中每个对象的value属性中
  props.modelValue.forEach((value: string) => {
    defaultParams.value.sorts.push({
      name: 'id',
      order: 'asc',
      value: value,
    });
  });
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
        title: $t('Role.index.8664410-5'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
    },
    {
        title: $t('Role.index.8664410-6'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Role.index.8664410-7'),
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
                value: `%${val}%`,
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
    console.log('')
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