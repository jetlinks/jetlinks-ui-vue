<!-- webhook请求头可编辑表格 -->
<template>
    <a-table
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
    >
        <template #bodyCell="{ column, text, record }">
            <template v-if="['KEY', 'VALUE'].includes(column.dataIndex)">
                <a-input v-model="record[column.dataIndex]" />
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
                <a-button type="text">
                    <template #icon>
                        <delete-outlined @click="handleDelete(record.idx)" />
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
</template>

<script setup lang="ts">
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
// import { cloneDeep } from 'lodash-es';
// import { defineComponent, reactive, ref } from 'vue';
// import type { UnwrapRef } from 'vue';

interface DataItem {
    idx: number;
    KEY: string;
    VALUE: string;
}

const data: DataItem[] = [];
for (let i = 0; i < 2; i++) {
    data.push({
        idx: i,
        KEY: `key ${i}`,
        VALUE: `value${i}`,
    });
}

const columns = [
    {
        title: 'KEY',
        dataIndex: 'KEY',
    },
    {
        title: 'VALUE',
        dataIndex: 'VALUE',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        fixed: 'right',
    },
];

const dataSource = ref(data);
console.log('dataSource: ', dataSource.value);

const handleDelete = (idx: number) => {
    dataSource.value.splice(idx, 1);
};
const handleAdd = () => {
    dataSource.value.push({
        idx: dataSource.value.length + 1,
        KEY: `key ${dataSource.value.length + 1}`,
        VALUE: `value ${dataSource.value.length + 1}`,
    });
};
</script>

<style lang="less" scoped></style>
