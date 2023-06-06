<template>
    <page-container>
        <div class="user-container">
            <pro-search
                :columns="columns"
                target="category"
                @search="handleParams"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getUserList_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        pageSize: 10,
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :pagination="{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            :hasPermission="`${permission}:add`"
                            type="primary"
                            @click="table.openDialog('add')"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
                    </template>
                    <template #type="slotProps">
                        {{ slotProps.type?.name }}
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
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: '编辑',
                                }"
                                @click="table.openDialog('edit', slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                :hasPermission="`${permission}:action`"
                                type="link"
                                :tooltip="{
                                    title: `${
                                        slotProps.status ? '禁用' : '启用'
                                    }`,
                                }"
                                :popConfirm="{
                                    title: `确定${
                                        slotProps.status ? '禁用' : '启用'
                                    }吗？`,
                                    onConfirm: () =>
                                        table.changeStatus(slotProps),
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
                                :hasPermission="`${permission}:update`"
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
                                :hasPermission="`${permission}:delete`"
                                :tooltip="{
                                    title: slotProps.status
                                        ? '请先禁用，再删除'
                                        : '删除',
                                }"
                                :popConfirm="{
                                    title: `确认删除`,
                                    onConfirm: () =>
                                        table.clickDel(slotProps.id),
                                }"
                                :disabled="slotProps.status"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditUserDialog
                v-if="dialog.visible"
                :type="dialog.type"
                v-model:visible="dialog.visible"
                :data="dialog.selectItem"
                @confirm="table.refresh"
            />
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
import { message } from 'jetlinks-ui-components';

const permission = 'system/User';

const columns = [
    {
        title: '姓名',
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
        search: {
            type: 'string',
        },
    },
    {
        title: '用户类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
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
        search: {
            type: 'string',
        },
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (type: modalType, row?: any) => {
        dialog.selectItem = { ...(row || {}) };
        dialog.type = type;
        dialog.visible = true;
    },
    changeStatus: ({ id, status }: any) => {
        const params = {
            status: status === 0 ? 1 : 0,
            id,
        };
        changeUserStatus_api(params).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    // 删除
    clickDel: (id: string) => {
        deleteUser_api(id).then(() => {
            message.success('操作成功');
            table.refresh();
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
    type: '' as modalType,
});

type dictType = {
    id: string;
    name: string;
};
type modalType = '' | 'add' | 'edit' | 'reset';

const handleParams = (params: any) => {
    const newParams = (params?.terms as any[])?.map((item1) => {
        let arr: any[] = []
        item1.terms = item1.terms.map((item2: any) => {
            if (['telephone', 'email'].includes(item2.column)) {
                return {
                    column: 'id$user-detail',
                    value: [item2],
                };
            }
            if (['type'].includes(item2.column) && item2.value === 'other') {
                arr = [
                    {
                        ...item2,
                        type: 'or',
                        termType: 'isnull',
                        value: 1,
                    },
                    {
                        ...item2,
                        type: 'or',
                        termType: 'empty',
                        value: 1,
                    }
                ]
            }
            return item2;
        });
        if(arr.length){
            item1.terms = [...item1.terms, ...arr]
        }
        return item1;
    });
    queryParams.value = { terms: newParams || [] };
};
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
