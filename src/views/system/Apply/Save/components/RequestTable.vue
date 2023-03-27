<template>
    <div class="request-table-container">
        <j-form ref="formRef" :model="formData" layout="vertical">
            <j-table
                :columns="columns"
                :data-source="formData.tableData"
                :pagination="false"
                size="small"
                bordered
            >
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.dataIndex === 'label'">
                        <j-form-item
                            :name="[
                                'tableData',
                                index + (current - 1) * 10,
                                'label',
                            ]"
                            :rules="[
                                {
                                    required: !!record.label && !!record.value,
                                    message: '该字段为必填字段',
                                    trigger: 'change',
                                },
                            ]"
                        >
                            <j-input v-model:value="record.label" />
                        </j-form-item>
                    </template>
                    <template v-else-if="column.dataIndex === 'value'">
                        <j-form-item
                            :name="[
                                'tableData',
                                index + (current - 1) * 10,
                                'value',
                            ]"
                            :rules="[
                                {
                                    required: !!record.value && !!record.label,
                                    message: '该字段为必填字段',
                                    trigger: 'change',
                                },
                            ]"
                        >
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
                                >
                                    {{ item.label }}
                                </j-select-option>
                            </j-select>
                        </j-form-item>
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
        </j-form>
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

const emits = defineEmits(['update:value', 'update:valid']);
const props = withDefaults(
    defineProps<{
        value: optionsType;
        valueType?: 'input' | 'select';
        valueOptions?: optionsType;
        valid?: boolean;
    }>(),
    {
        valueType: 'input',
    },
);
const columns = [
    {
        title: 'KEY',
        dataIndex: 'label', // 此处表格需要验证, key为字段验证无法通过, 改为label
        key: 'label',
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

// const tableData = computed(() => {
//     return props.value.slice((current.value - 1) * 10, current.value * 10);
// });
const formData = ref({
    tableData: computed(() => {
        return props.value.slice((current.value - 1) * 10, current.value * 10);
    }),
});

const formRef = ref();
watch(
    () => formData.value,
    (val) => {
        formRef.value?.validate();
        // 每一项都填了, 或者没项都没有填, 均为验证通过, 否则均为未通过
        const valid = formData.value.tableData.every(
            (e: any) => (e.label && e.value) || (!e.label && !e.value),
        );
        emits('update:valid', valid);
    },
    { deep: true },
);

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
    :deep(.ant-form-item) {
        margin-bottom: 0;
    }
}
</style>
