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
                <a-button
                    type="primary"
                    @click="table.openDialog(undefined)"
                    style="margin-right: 10px"
                    ><plus-outlined />新增</a-button
                >
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
                                >
                                    <a-button>导入</a-button>
                                </a-upload>
                            </a-menu-item>
                            <a-menu-item>
                                <a-popconfirm
                                    title="确认导出？"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="table.clickExport"
                                >
                                    <a-button>导出</a-button>
                                </a-popconfirm>
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
                        :title="`确定要${
                            slotProps.status ? '禁用' : '启用'
                        }吗？`"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.changeStatus(slotProps)"
                    >
                        <a-tooltip>
                            <template #title>{{
                                slotProps.status ? '禁用' : '启用'
                            }}</template>
                            <a-button style="padding: 0" type="link">
                                <stop-outlined v-if="slotProps.status" />
                                <play-circle-outlined v-else />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>

                    <a-popconfirm
                        title="确认删除"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.clickDel(slotProps)"
                        :disabled="slotProps.status"
                    >
                        <a-tooltip>
                            <template #title>{{
                                systemPermission('delete')
                                    ? slotProps.status
                                        ? '请先禁用，再删除'
                                        : '删除'
                                    : '暂无权限，请联系管理员'
                            }}</template>
                            <a-button
                                style="padding: 0"
                                type="link"
                                :disabled="
                                    !systemPermission('delete') ||
                                    slotProps.status
                                "
                            >
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

        <div class="dialogs">
            <EditDialog ref="editDialogRef" @refresh="table.refresh" />
        </div>
    </div>
</template>

<script setup lang="ts">
import EditDialog from './components/EditDialog.vue';
import StatusLabel from './components/StatusLabel.vue';
import { message } from 'ant-design-vue';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    StopOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons-vue';
import {
    getPermission_api,
    editPermission_api,
    delPermission_api,
    exportPermission_api,
} from '@/api/system/permission';
import { downloadObject } from '@/utils/utils';
import { usePermissionStore } from '@/store/permission';

const editDialogRef = ref(); // 新增弹窗实例
const tableRef = ref<Record<string, any>>({}); // 表格实例

// 按钮权限控制
const hasPermission = usePermissionStore().hasPermission;
const systemPermission = (code: string) =>
    hasPermission('system/Permission:${code}');
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
        let permissionCode = '';
        if (Object.keys(row).length < 1) permissionCode = 'add';
        else permissionCode = 'update';
        if (systemPermission(permissionCode))
            editDialogRef.value.openDialog(true, row);
        else message.warn('暂无权限，请联系管理员');
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
        if (!systemPermission('action'))
            return message.warn('暂无权限，请联系管理员');
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

<style lang="less" scoped></style>
