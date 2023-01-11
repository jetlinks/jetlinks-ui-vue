<template>
    <div class="box">
        <JTable 
            :columns="[
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: true
                },
                {
                    title: '分类',
                    dataIndex: 'classifiedName',
                    key: 'classifiedName',
                },
            ]"
            :actions="actions"
            :request="request"
            :rowSelection="rowSelection"
        >
            <template #headerTitle>
                <a-button type="primary">新增</a-button>
            </template>
            <template #cardContent="slotProps">
                <h3>{{slotProps.item.name}}</h3>
                <a-row>
                    <a-col :span="12">
                        <div class="card-item-content-text">
                            设备类型
                        </div>
                        <div>直连设备</div>
                    </a-col>
                    <a-col :span="12">
                        <div class="card-item-content-text">
                            产品名称
                        </div>
                        <div>测试固定地址</div>
                    </a-col>
                </a-row>
            </template>
            <template #id="slotProps">
                <a>{{slotProps.row.id}}</a>
            </template>
        </JTable>
    </div>
</template>

<script setup lang="ts">
import server from "@/utils/request";
import type { ActionsType } from '@/components/Table/index.vue'
import { getImage } from '@/utils/comm';
import type { TableProps, TableColumnType } from 'ant-design-vue';

const request = (data: any) => server.post(`/device-product/_query`, data)
const actions: ActionsType[] = [
    {
        key: 'edit',
        // disabled: true,
        text: "编辑",
        tooltip: {
            title: '编辑'
        },
        // component: <UnorderedListOutlined />
    },
    {
        key: 'delete',
        disabled: true,
        text: "删除",
        tooltip: {
            title: '删除'
        },
        popConfirm: {
            title: '确认删除?'
        }
    }
]

const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
    }),
};

</script>


<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
</style>

