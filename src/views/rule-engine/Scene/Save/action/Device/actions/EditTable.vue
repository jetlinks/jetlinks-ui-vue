<template>
    <j-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
    >
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'name'">
                <span>{{ text }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'valueType'">
                <span>{{ record.valueType.type }}</span>
            </template>
            <template v-else>
                <FunctionItem
                    :builtInList="builtInList"
                    v-model:source="record.source"
                    v-model:value="record.value"
                    v-model:upperKey="record.upperKey"
                    :data="record"
                    @change="onChange"
                />
            </template>
        </template>
    </j-table>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import FunctionItem from './FunctionItem.vue';

const _props = defineProps({
    value: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => undefined,
    },
    builtInList: {
        type: Array,
        default: () => [],
    },
    functions: {
        type: Array,
        default: () => [],
    },
    columnMap: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:value', 'update:columnMap']);

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

const dataSource = ref<any[]>([]);
const columnMap = ref(_props.columnMap || {})

watchEffect(() => {
    const list = (_props.functions || []).map((item: any) => {
        const _item = _props.value?.find((i) => i.name === item?.id) || {};
        return {
            ...item,
            ...{
               name: _item.id,
               ..._item.value
            },
            name: item.name,
        };
    });
    dataSource.value = list;
});

const onChange = (v: any, obj: any, option: any, record: any) => {

  columnMap.value[record.id] = v.source === 'fixed' ? undefined : obj.column

    const arr = [...dataSource.value].map((item) => {
        return {
            name: item.id,
            value: {
                source: item.source,
                upperKey: item.upperKey || item.value,
                value: item.value,
            },
        };
    });
    emit('update:value', arr);
    emit('update:columnMap', columnMap.value);
};
</script>
