<template>
    <div class="request-table-container">
        <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            size="small"
            bordered
        >
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'key'">
                    <a-input v-model:value="record.label" />
                </template>
                <template v-else-if="column.dataIndex === 'value'">
                    <a-input v-model:value="record.value" />
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <a-button
                        type="link"
                        @click="removeRow((current - 1) * 10 + index)"
                    >
                        <AIcon type="DeleteOutlined" />
                    </a-button>
                </template>
            </template>
        </a-table>
        <a-pagination
            v-show="props.value.length > 10"
            v-model:current="current"
            :page-size="10"
            :total="props.value.length"
            show-less-items
        />
        <a-button type="dashed" @click="addRow" class="add-btn">
            <AIcon type="PlusOutlined" />新增
        </a-button>
    </div>
</template>

<script setup lang="ts">
import type { optionsType } from '../typing';

const emits = defineEmits(['update:value']);
const props = defineProps<{
    value: optionsType;
}>();
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
        title: ' ',
        dataIndex: 'action',
    },
];

const current = ref<number>(1);

const tableData = computed(() => {
    return props.value.slice((current.value - 1) * 10, current.value * 10);
});

watch(
    () => props.value,
    (n, o) => {
        if (!o || n.length === o.length) return;
        // 如果是新增行操作
        else if (n.length > o.length) {
            // 若新增后会出现新一页，则跳转到最新的一页
            if (o.length % 10 === 0 && n.length > 10)
                current.value = current.value + 1;
        } else {
            // 如果是删除行操作
            // 若删除的行是本页的最后一行，且本页不是第一页，则跳转到上一页
            if (o.length % 10 === 1 && o.length > 10)
                current.value = current.value - 1;
        }
    },
    {
        immediate: true,
    },
);

function removeRow(index: number) {
    const left = props.value.slice(0, index++);
    const right = props.value.slice(index, props.value.length);
    emits('update:value', [...left, ...right]);
}
function addRow() {
    const newRow = {
        label: '',
        value: '',
    };
    console.log(111);

    emits('update:value', [...props.value, newRow]);
}
</script>

<style lang="less" scoped>
.request-table-container {
    width: 100%;
    :deep(.ant-btn-link) {
        color: #000000d9;

        &:hover {
            color: #1d39c4;
        }
    }
    .add-btn {
        width: 100%;
        display: block;
        margin-top: 10px;
    }
}
</style>
