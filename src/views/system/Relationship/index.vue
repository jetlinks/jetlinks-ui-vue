<template>
    <div class="relationship-container">
        <Search :columns="query.columns" @search="query.search" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getRelationshipList_api"
            model="TABLE"
            :params="query.params"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
        >
            <template #headerTitle>
                <a-button
                    type="primary"
                    @click="table.openDialog(undefined)"
                    style="margin-right: 10px"
                    ><plus-outlined />新增</a-button
                >
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip>
                        <template #title>编辑</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="table.openDialog(slotProps)"
                        >
                            <edit-outlined />
                        </a-button>
                    </a-tooltip>
                    <a-popconfirm
                        title="确认删除"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.clickDel(slotProps)"
                    >
                        <a-tooltip>
                            <template #title>删除</template>
                            <a-button style="padding: 0" type="link">
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

        <EditDialog ref="editDialogRef" @refresh="table.refresh" />
    </div>
</template>

<script setup lang="ts" name="Relationship">
import { getRelationshipList_api, delRelation_api } from '@/api/system/relationship';
import { message } from 'ant-design-vue';
import EditDialog from './components/EditDialog.vue';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
const query = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '关联方',
            dataIndex: 'objectTypeName',
            key: 'objectTypeName',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'select',
                options: [
                    {
                        label: '启用',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0,
                    },
                ],
            },
        },
        {
            title: '被关联方',
            dataIndex: 'targetType',
            key: 'targetType',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'select',
                options: [
                    {
                        label: '用户',
                        value: 'user',
                    },
                ],
            },
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
    ],
    params: {},
    search: (params: object) => {
        query.params = params;
    },
};

const editDialogRef = ref(); // 新增弹窗实例
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '关联方',
            dataIndex: 'objectTypeName',
            key: 'objectTypeName',
        },
        {
            title: '被关联方',
            dataIndex: 'targetTypeName',
            key: 'targetTypeName',
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
        },
    ],
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        editDialogRef.value.openDialog(true, row)
    },
    // 删除
    clickDel: (row: any) => {
        delRelation_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                message.success('操作成功!');
            }
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};
</script>

<style lang="less" scoped>
.relationship-container {
    padding:24px ;
}
</style>
