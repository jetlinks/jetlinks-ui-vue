<template>
    <div class="request-table-container">
        <j-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            size="small"
            bordered
        >
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'key'">
                    <j-input v-model:value="record.key" />
                </template>
                <template v-else-if="column.dataIndex === 'value'">
                    <j-input
                        v-model:value="record.value"
                        v-if="props.valueType === 'input'"
                    />
                    <j-select
                        v-else-if="props.valueType === 'select'"
                        v-model:value="record.value"
                    >
                        <j-select-option
                            v-for="item in props.valueOptions"
                            :value="item.value"
                            >{{ item.label }}</j-select-option
                        >
                    </j-select>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                    <j-button
                        type="link"
                        @click="removeRow((current - 1) * 10 + index)"
                    >
                        <AIcon type="DeleteOutlined" />
                    </j-button>
                </template>
            </template>
        </j-table>
        <!-- <j-pagination
            v-show="props.value.length > 10"
            v-model:current="current"
            :page-size="10"
            :total="props.value.length"
            show-less-items
        /> -->
        <RowPagination
            v-if="props.value.length > 10"
            v-model:pageNum="current"
            :pageSize="10"
            :total="props.value.length"
        />

        <j-button type="dashed" @click="addRow" class="add-btn">
            <AIcon type="PlusOutlined" />新增
        </j-button>
    </div>
</template>

<script setup lang="ts">
import type { optionsType } from '../typing';

const emits = defineEmits(['update:value']);
const props = withDefaults(
    defineProps<{
        value: optionsType;
        valueType?: 'input' | 'select';
        valueOptions?: optionsType;
    }>(),
    {
        valueType: 'input',
    },
);
const columns = [
    {
        title: 'KEY',
        dataIndex: 'key',
        key: 'key',
        width: '40%',
    },
    {
        title: 'VALUE',
        dataIndex: 'value',
        key: 'value',
        width: '40%',
    },
    {
        title: ' ',
        dataIndex: 'action',
        key: 'action',
        width: '20%',
    },
];

const current = ref<number>(1);

const tableData = computed(() => {
    return props.value.slice((current.value - 1) * 10, current.value * 10);
});

if (props.value.length < 1) addRow();
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
