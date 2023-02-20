<template>
    <div class="permission-container">
        <Search :columns="query.columns" @search="query.search" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getPermission_api"
            model="TABLE"
            :params="query.params"
            :defaultParams="{ sorts: [{ name: 'id', order: 'asc' }] }"
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    :uhasPermission="`${permission}:add`"
                    @click="table.openDialog(undefined)"
                >
                    <AIcon type="PlusOutlined" />新增
                </PermissionButton>
                <a-dropdown trigger="hover">
                    <a-button>批量操作</a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a-upload
                                    name="file"
                                    action="#"
                                    accept=".json"
                                    :showUploadList="false"
                                    :before-upload="table.clickImport"
                                    :disabled="
                                        !hasPermission(`${permission}:import`)
                                    "
                                >
                                    <PermissionButton
                                        :hasPermission="`${permission}:import`"
                                    >
                                        导入
                                    </PermissionButton>
                                </a-upload>
                            </a-menu-item>
                            <a-menu-item>
                                <PermissionButton
                                    :uhasPermission="`${permission}:export`"
                                    :popConfirm="{
                                        title: `确认导出？`,
                                        onConfirm: () => table.clickExport(),
                                    }"
                                >
                                    导出
                                </PermissionButton>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </template>
            <template #status="slotProps">
                <StatusLabel :status-value="slotProps.status" />
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
                        :uhasPermission="`${permission}:action`"
                        type="link"
                        :popConfirm="{
                            title: `确定要${
                                slotProps.status ? '禁用' : '启用'
                            }吗？`,
                            onConfirm: () => table.changeStatus(slotProps),
                        }"
                        :tooltip="{ title: slotProps.status ? '禁用' : '启用' }"
                    >
                        <AIcon
                            :type="
                                slotProps.status
                                    ? 'StopOutlined'
                                    : 'PlayCircleOutlined '
                            "
                        />
                    </PermissionButton>

                    <PermissionButton
                        :uhasPermission="`${permission}:delete`"
                        type="link"
                        :tooltip="{
                            title: slotProps.status
                                ? '请先禁用，再删除'
                                : '删除',
                        }"
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

        <div class="dialogs">
            <EditDialog ref="editDialogRef" @refresh="table.refresh" />
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditDialog from './components/EditDialog.vue';
import StatusLabel from './components/StatusLabel.vue';
import { message } from 'ant-design-vue';
import {
    getPermission_api,
    editPermission_api,
    delPermission_api,
    exportPermission_api,
} from '@/api/system/permission';
import { downloadObject } from '@/utils/utils';
import { usePermissionStore } from '@/store/permission';

const permission = 'system/Permission';
const hasPermission = usePermissionStore().hasPermission;

const editDialogRef = ref(); // 新增弹窗实例
const tableRef = ref<Record<string, any>>({}); // 表格实例
// 筛选
const query = reactive({
    columns: [
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            search: {
                rename: 'status',
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
    ],
    params: {},
    search: (params: object) => {
        query.params = params;
    },
});

// 表格
const table = reactive({
    columns: [
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
        },
    ],
    tableData: [],
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        editDialogRef.value.openDialog(true, row);
    },
    // 导入数据
    clickImport: (file: File) => {
        if (file.type === 'application/json') {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result: any) => {
                try {
                    const data = JSON.parse(result.target.result);
                    editPermission_api(data).then((resp) => {
                        if (resp.status === 200) {
                            message.success('导入成功');
                            table.refresh();
                        }
                    });
                } catch (error) {
                    message.error('导入失败，请重试！');
                }
            };
        } else message.error('请上传json格式');
        return false;
    },
    // 导出数据
    clickExport: () => {
        const params = {
            paging: false,
            ...query.params,
        };
        exportPermission_api(params).then((resp) => {
            if (resp.status === 200) {
                downloadObject(resp.result as any, '权限数据');
                message.success('导出成功');
            } else {
                message.error('导出错误');
            }
        });
    },
    // 修改状态
    changeStatus: (row: any) => {
        const params = {
            ...row,
            status: row.status ? 0 : 1,
        };
        editPermission_api(params).then(() => {
            message.success('操作成功');
            tableRef.value.reload();
        });
    },
    // 删除
    clickDel: (row: any) => {
        delPermission_api(row.id).then((resp: any) => {
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
});
</script>

<style lang="less" scoped>
.permission-container {
    padding: 24px;

    .ant-dropdown-trigger {
        margin-left: 12px;
    }

    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
