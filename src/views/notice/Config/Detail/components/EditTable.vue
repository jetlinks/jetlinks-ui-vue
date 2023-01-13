<!-- webhook请求头可编辑表格 -->
<template>
    <div class="table-wrapper">
        <a-table
            :columns="columns"
            :data-source="dataSource"
            bordered
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="['key', 'value'].includes(column.dataIndex)">
                    <a-input v-model:value="record[column.dataIndex]" />
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <a-button type="text">
                        <template #icon>
                            <delete-outlined @click="handleDelete(record.id)" />
                        </template>
                    </a-button>
                </template>
            </template>
        </a-table>
        <a-button
            type="dashed"
            @click="handleAdd"
            style="width: 100%; margin-top: 5px"
        >
            <template #icon>
                <plus-outlined />
            </template>
            添加
        </a-button>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { PropType } from 'vue';
import { IHeaders } from '../../types';

type Emits = {
    (e: 'update:headers', data: IHeaders[]): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    headers: {
        type: Array as PropType<IHeaders[]>,
        default: () => [],
    },
});

const columns = [
    {
        title: 'KEY',
        dataIndex: 'key',
    },
    {
        title: 'VALUE',
        dataIndex: 'value',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        fixed: 'right',
    },
];

const dataSource = computed({
    get: () => props.headers,
    set: (val) => emit('update:headers', val),
});

const handleDelete = (id: number) => {
    const idx = dataSource.value.findIndex((f) => f.id === id);
    dataSource.value.splice(idx, 1);
};
const handleAdd = () => {
    dataSource.value.push({
        id: dataSource.value.length,
        key: `key ${dataSource.value.length + 1}`,
        value: `value ${dataSource.value.length + 1}`,
    });
};
</script>

<style lang="less" scoped></style>
