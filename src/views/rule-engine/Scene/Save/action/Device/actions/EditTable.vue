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
                    @change="onChange"
                    v-model:source="record.source"
                    :data="record"
                    v-model:value="record.value"
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
});

const emit = defineEmits(['update:value']);

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

watchEffect(() => {
    const list = (_props.functions || []).map((item: any) => {
        const _item = _props.value?.find((i) => i.name === item?.id) || {};
        return {
            ...item,
            ..._item,
            name: item.name,
        };
    });
    dataSource.value = list;
});

const onChange = () => {
    const arr = [...dataSource.value].map((item) => {
        return {
            name: item.id,
            source: item.source,
            upperKey: item.upperKey || item.value,
            value: item.value,
        };
    });
    emit('update:value', arr);
};
</script>