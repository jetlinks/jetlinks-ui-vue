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
                    @click="jump(slotProps.row)"
                    >{{ slotProps.row.url }}</span
                >
            </template>
        </JTable>

        <a-button type="primary">保存</a-button>
    </div>
</template>

<script setup lang="ts">
import { TableProps } from 'ant-design-vue';

const emits = defineEmits(['update:clickApi'])
const props = defineProps({
    tableData: Array,
    clickApi: Object
});

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
const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
};

const jump = (row:object) => {
    emits('update:clickApi',row)
};
</script>

<style lang="less" scoped>
.choose-api-container {
    height: 100%;
    
    :deep(.jtable-body-header) {
        display: none !important;
    }
}

</style>
