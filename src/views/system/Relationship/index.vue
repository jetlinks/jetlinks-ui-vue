<template>
    <div class="relationship-container">
        <Search :columns="query.columns" @search="query.search" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getRelationshipList_api"
            model="TABLE"
            :params="query.params.value"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    :uhasPermission="`${permission}:add`"
                    @click="table.openDialog(undefined)"
                >
                    <AIcon type="PlusOutlined" />新增
                </PermissionButton>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <PermissionButton
                        :uhasPermission="`${permission}:update`"
                        type="link"
                        :tooltip="{
                            title: '编辑',
                        }"
                        @click="table.openDialog(slotProps)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>

                    <PermissionButton
                        :uhasPermission="`${permission}:delete`"
                        type="link"
                        :tooltip="{ title: '删除' }"
                        :popConfirm="{
                            title: `确认删除`,
                            onConfirm: () => table.clickDel(slotProps),
                        }"
                        :disabled="slotProps.status"
                    >
                        <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                </a-space>
            </template>
        </JTable>

        <EditDialog ref="editDialogRef" @refresh="table.refresh" />
    </div>
</template>

<script setup lang="ts" name="Relationship">
import PermissionButton from '@/components/PermissionButton/index.vue';
import {
    getRelationshipList_api,
    delRelation_api,
} from '@/api/system/relationship';
import { message } from 'ant-design-vue';
import EditDialog from './components/EditDialog.vue';

const permission = 'system/Relationship';

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
    params: ref({}),
    search: (params: object) => {
        query.params.value = params;
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
        editDialogRef.value.openDialog(true, row);
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
    padding: 24px;
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
