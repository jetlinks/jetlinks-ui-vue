<template>
    <page-container>
        <div class="permission-container">
            <pro-search
                :columns="columns"
                target="system-permission"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getPermission_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        pageSize: 10,
                        sorts: [{ name: 'id', order: 'asc' }],
                    }"
                    :pagination="{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            :hasPermission="`${permission}:add`"
                            @click="table.openDialog(undefined)"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
                        <j-dropdown trigger="hover">
                            <j-button>批量操作</j-button>
                            <template #overlay>
                                <j-menu>
                                    <j-menu-item>
                                        <j-upload
                                            name="file"
                                            action="#"
                                            accept=".json"
                                            :showUploadList="false"
                                            :before-upload="table.clickImport"
                                            :disabled="
                                                !hasPermission(
                                                    `${permission}:import`,
                                                )
                                            "
                                        >
                                            <PermissionButton
                                                :hasPermission="`${permission}:import`"
                                            >
                                                导入
                                            </PermissionButton>
                                        </j-upload>
                                    </j-menu-item>
                                    <j-menu-item>
                                        <PermissionButton
                                            :hasPermission="`${permission}:export`"
                                            :popConfirm="{
                                                title: `确认导出？`,
                                                onConfirm: () =>
                                                    table.clickExport(),
                                            }"
                                        >
                                            导出
                                        </PermissionButton>
                                    </j-menu-item>
                                </j-menu>
                            </template>
                        </j-dropdown>
                    </template>
                    <template #status="slotProps">
                        <BadgeStatus
                            :status="slotProps.status"
                            :text="slotProps.status ? '启用' : '禁用'"
                            :statusNames="{
                                1: 'success',
                                0: 'error',
                            }"
                        ></BadgeStatus>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: '编辑',
                                }"
                                @click="table.openDialog(slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>

                            <PermissionButton
                                :hasPermission="`${permission}:action`"
                                type="link"
                                :popConfirm="{
                                    title: `确定要${
                                        slotProps.status ? '禁用' : '启用'
                                    }吗？`,
                                    onConfirm: () =>
                                        table.changeStatus(slotProps),
                                }"
                                :tooltip="{
                                    title: slotProps.status ? '禁用' : '启用',
                                }"
                            >
                                <AIcon
                                    :type="
                                        slotProps.status
                                            ? 'StopOutlined'
                                            : 'PlayCircleOutlined'
                                    "
                                />
                            </PermissionButton>

                            <PermissionButton
                                :hasPermission="`${permission}:delete`"
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
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditDialog
                v-if="dialog.visible"
                v-model:visible="dialog.visible"
                :data="dialog.selectItem"
                @refresh="table.refresh"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditDialog from './components/EditDialog.vue';
import { message } from 'jetlinks-ui-components';
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

const columns = [
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
            first: true,
        },
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        scopedSlots: true,
    },
];
const queryParams = ref({});
const handleSearch = (e: any) => {
    queryParams.value = e;
};
// 表格
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        dialog.selectItem = { ...row };
        dialog.visible = true;
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
            ...queryParams.value,
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
};

const dialog = reactive({
    selectItem: {},
    visible: false,
});
</script>

<style lang="less" scoped>
.permission-container {
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
