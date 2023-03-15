<template>
    <j-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
    >
        <template #bodyCell="{ column, text, record }">
            <div>
                <template
                    v-if="['valueType', 'name'].includes(column.dataIndex)"
                >
                    <span>{{ text }}</span>
                </template>
                <template v-else>
                    <ParamsDropdown
                        placeholder="请选择"
                        :options="[]"
                        :tabsOptions="tabOptions"
                        :metricOption="upperOptions(record.valueType)"
                        v-model:value="record.value"
                    >
                        <template v-slot="{label}">
                            <j-input :value="label" />
                        </template>
                    </ParamsDropdown>
                </template>
            </div>
        </template>
    </j-table>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import ParamsDropdown from '../../../components/ParamsDropdown';

type Emits = {
    (e: 'update:modelValue', data: Record<string, any>[]): void;
};
const _emit = defineEmits<Emits>();

const _props = defineProps({
    modelValue: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => undefined,
    },
    builtInList: {
        type: Array,
        default: () => [],
    },
});

const tabOptions = [
    {
        label: '手动输入',
        component: 'string',
        key: 'fixed',
    },
    {
        label: '内置参数',
        component: 'tree',
        key: 'upper',
    },
];

const columns = [
    {
        title: '参数名称',
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: '类型',
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: '值',
        dataIndex: 'value',
        with: '34%',
    },
];

const dataSource = computed({
    get: () => {
        return _props.modelValue || [];
    },
    set: (val: any) => {
        _emit('update:modelValue', val);
    },
});

const filterParamsData = (type?: string, data?: any[]): any[] => {
    if (type && data) {
        return data.filter((item) => {
            if (item.children) {
                const _children = filterParamsData(type, item.children);
                item.children = _children;
                return _children.length ? true : false;
            } else if (item.type === type) {
                //   optionMap.current.set(item.id, item);
                return true;
            }
            return false;
        });
    }
    return data || [];
};

const upperOptions = (_type: string) => {
    return filterParamsData(_type, _props?.builtInList) || [];
};
</script>