<template>
    <page-container>
        <div class="user-container">
            <Search :columns="columns" @search="query.search" />

            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="getUserList_api"
                model="TABLE"
                :params="query.params.value"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <PermissionButton
                        :uhasPermission="`${permission}:add`"
                        type="primary"
                        @click="table.openDialog('add')"
                    >
                        <AIcon type="PlusOutlined" />新增
                    </PermissionButton>
                </template>
                <template #type="slotProps">
                    {{ slotProps.type.name }}
                </template>
                <template #status="slotProps">
                    <BadgeStatus
                        :status="slotProps.status"
                        :text="slotProps.status ? '正常' : '禁用'"
                        :statusNames="{
                            1: 'success',
                            0: 'error',
                        }"
                    ></BadgeStatus>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <PermissionButton
                            :uhasPermission="`${permission}:update`"
                            type="link"
                            :tooltip="{
                                title: '编辑',
                            }"
                            @click="table.openDialog('edit',slotProps)"
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            :uhasPermission="`${permission}:action`"
                            type="link"
                            :tooltip="{
                                title: `${slotProps.status ? '禁用' : '启用'}`,
                            }"
                            :popConfirm="{
                                title: `确定${
                                    slotProps.status ? '禁用' : '启用'
                                }吗？`,
                                onConfirm: () => table.changeStatus(slotProps),
                            }"
                        >
                            <stop-outlined v-if="slotProps.status" />
                            <play-circle-outlined v-else />
                        </PermissionButton>
                        <PermissionButton
                            :uhasPermission="`${permission}:update`"
                            type="link"
                            :tooltip="{
                                title: '重置密码',
                            }"
                            @click="table.openDialog('reset', slotProps)"
                        >
                            <AIcon type="icon-zhongzhimima" />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :uhasPermission="`${permission}:delete`"
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

            <EditUserDialog ref="editDialogRef" @confirm="table.refresh" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="UserMange">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditUserDialog from './components/EditUserDialog.vue';
import {
    getUserType_api,
    getUserList_api,
    changeUserStatus_api,
    deleteUser_api,
} from '@/api/system/user';
import { StopOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const permission = 'system/User';

const columns = [
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
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '用户类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    getUserType_api().then((resp: any) => {
                        resolve(
                            resp.result.map((item: dictType) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
        scopedSlots: true,
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
        scopedSlots: true,
    },
    {
        title: '手机号',
        dataIndex: 'telephone',
        key: 'telephone',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
];
const query = {
    columns: [
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
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '用户类型',
            dataIndex: 'type',
            key: 'type',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'select',
                options: () =>
                    new Promise((resolve) => {
                        getUserType_api().then((resp: any) => {
                            resolve(
                                resp.result.map((item: dictType) => ({
                                    label: item.name,
                                    value: item.id,
                                })),
                            );
                        });
                    }),
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
        {
            title: '手机号',
            dataIndex: 'telephone',
            key: 'telephone',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
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

const editDialogRef = ref(); // 弹窗实例
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            ellipsis: true,
        },
        {
            title: '用户类型',
            dataIndex: 'type',
            key: 'type',
            scopedSlots: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: true,
        },
        {
            title: '手机号',
            dataIndex: 'telephone',
            key: 'telephone',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
        },
    ],

    // 打开编辑弹窗
    openDialog: (type: modalType, row?: any) => {
        editDialogRef.value.openDialog(type, row || {});
    },
    changeStatus: (row: any) => {
        const params = {
            id: row.id,
            status: row.status === 0 ? 1 : 0,
        };
        changeUserStatus_api(params).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    // 删除
    clickDel: (row: any) => {
        deleteUser_api(row.id).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};

type dictType = {
    id: string;
    name: string;
};
type modalType = '' | 'add' | 'edit' | 'reset';
</script>

<style lang="less" scoped>
.user-container {
    :deep(.ant-table-tbody) {
        .ant-table-cell {
            .ant-space-item {
                .ant-btn-link {
                    padding: 0;
                }
            }
        }
    }
}
</style>
