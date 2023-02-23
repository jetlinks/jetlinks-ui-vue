<template>
    <div class="choose-api-container">
        <JTable
            :columns="columns"
            :dataSource="props.tableData"
            :rowSelection="rowSelection"
            noPagination
            model="TABLE"
        >
            <template #url="slotProps">
                <span
                    style="color: #1d39c4; cursor: pointer"
                    @click="jump(slotProps)"
                    >{{ slotProps.url }}</span
                >
            </template>
        </JTable>

        <a-button type="primary" @click="save">保存</a-button>
    </div>
</template>

<script setup lang="ts">
import { addOperations_api, delOperations_api } from '@/api/system/apiPage';
import { message } from 'ant-design-vue';
import { modeType } from '../typing';
const emits = defineEmits(['update:clickApi', 'update:selectedRowKeys']);
const props = defineProps<{
    tableData: any[];
    clickApi: any;
    selectedRowKeys: string[];
    sourceKeys: string[];
    mode: modeType;
}>();

const columns = [
    {
        title: 'API',
        dataIndex: 'url',
        key: 'url',
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'summary',
        key: 'summary',
    },
];
const rowSelection = {
    onSelect: (record: any) => {
        let newKeys = [...props.selectedRowKeys];

        if (props.selectedRowKeys.includes(record.id)) {
            newKeys = newKeys.filter((id) => id !== record.id);
        } else newKeys.push(record.id);

        emits('update:selectedRowKeys', newKeys);
    },
    selectedRowKeys: ref<string[]>([]),
};
const save = () => {
    const keys = props.selectedRowKeys;

    const removeKeys = props.sourceKeys.filter((key) => !keys.includes(key));
    const addKeys = keys.filter((key) => !props.sourceKeys.includes(key));

    if (props.mode === 'api') {
        // 此时是api配置
        removeKeys.length &&
            delOperations_api(removeKeys)
                .finally(() => addOperations_api(addKeys))
                .then(() => message.success('操作成功'));
    }
};
const jump = (row: any) => {
    emits('update:clickApi', row);
};

watch(
    () => props.selectedRowKeys,
    (n) => {
        rowSelection.selectedRowKeys.value = n;
    },
);
</script>

<style lang="less" scoped>
.choose-api-container {
    height: 100%;

    :deep(.jtable-body-header) {
        display: none !important;
    }
    :deep(.ant-alert-info) {
        display: none !important;
    }
}
</style>
