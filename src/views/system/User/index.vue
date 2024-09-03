<template>
    <j-page-container>
        <div class="user-container">
            <pro-search
                :columns="columns"
                target="system-user"
                @search="handleParams"
            />
            <FullPage >
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getUserList_api"
                    mode="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'username', order: 'asc', value: 'admin' },
                        ],
                    }"
                    :scroll="{ y: 'calc(100% - 60px)' }"
                >
                    <template #headerLeftRender>
                        <j-permission-button
                            :hasPermission="`${permission}:add`"
                            type="primary"
                            @click="table.openDialog('add')"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </j-permission-button>
                    </template>
                    <template #type="slotProps">
                        {{ slotProps.type?.name }}
                    </template>
                    <template #roleList="slotProps">
                        <j-ellipsis>
                            {{
                                slotProps?.roleList
                                    ?.map((item) => {
                                        return item.name;
                                    })
                                    .join(',')
                            }}
                        </j-ellipsis>
                    </template>
                    <template #status="slotProps">
                        <j-badge-status
                            :status="slotProps.status"
                            :text="slotProps.status ? '正常' : '禁用'"
                            :statusNames="{
                                1: 'success',
                                0: 'error',
                            }"
                        ></j-badge-status>
                    </template>
                    <template #action="slotProps">
                        <a-space :size="16">
                            <j-permission-button
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: '编辑',
                                }"
                                @click="table.openDialog('edit', slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </j-permission-button>
                            <j-permission-button
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
                            </j-permission-button>
                            <j-permission-button
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: '重置密码',
                                }"
                                @click="table.openDialog('reset', slotProps)"
                            >
                                <AIcon type="icon-zhongzhimima" />
                            </j-permission-button>
                            <j-permission-button
                                type="link"
                                :hasPermission="`${permission}:delete`"
                                :tooltip="{
                                    title: slotProps.status
                                        ? '请先禁用，再删除'
                                        : '删除',
                                }"
                                :popConfirm="{
                                    title: '确认删除?',
                                    onConfirm: () =>
                                        table.clickDel(slotProps.id),
                                }"
                                :disabled="!!slotProps.status"
                            >
                                <AIcon type="DeleteOutlined" />
                            </j-permission-button>
                        </a-space>
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
    </j-page-container>
</template>

<script setup lang="ts" name="UserMange">
import EditUserDialog from './components/EditUserDialog.vue';
import {
    getUserType_api,
    getUserList_api,
    changeUserStatus_api,
    deleteUser_api,
    queryRole_api,
} from '@/api/system/user';
import { onlyMessage } from '@jetlinks-web/utils';

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
        title: '角色',
        dataIndex: 'roleList',
        key: 'roleList',
        search: {
            type: 'select',
            // rename:'id$in-dimension$role',
            options: () =>
                new Promise((resolve) => {
                    queryRole_api({
                        paging: false,
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'id', order: 'desc' },
                        ],
                    }).then((resp: any) => {
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
                    label: '正常',
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
        width: 180,
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
            onlyMessage('操作成功');
            table.refresh();
        });
    },
    // 删除
    clickDel: (id: string) => {
        deleteUser_api(id).then(() => {
            onlyMessage('操作成功');
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
    const newParams = (params?.terms as any[])?.map((termsGroupA) => {
        let arr: any[] = [];
        termsGroupA.terms = termsGroupA.terms.map((termsItem: any) => {
            if (termsItem.column === 'id$in-dimension$role') {
                let _termType =
                    termsItem.termType === 'nin'
                        ? 'not$in'
                        : termsItem.termType;
                termsItem.column = `${termsItem.column}$${_termType}`;
                delete termsItem.termType;
            }
            if (['telephone', 'email'].includes(termsItem.column)) {
                return {
                    column: 'id$user-detail',
                    value: [termsItem],
                };
            }
            if (
                ['type'].includes(termsItem.column) &&
                termsItem.value === 'other'
            ) {
                arr = [
                    {
                        ...termsItem,
                        type: 'or',
                        termType: 'isnull',
                        value: 1,
                    },
                    {
                        ...termsItem,
                        type: 'or',
                        termType: 'empty',
                        value: 1,
                    },
                ];
            }
            if (termsItem.column === 'roleList') {
                if (
                    termsItem.termType === 'eq' ||
                    termsItem.termType === 'in'
                ) {
                    return {
                        column: 'id$in-dimension$role',
                        type: termsItem.type,
                        value: termsItem.value,
                    };
                } else {
                    return {
                        column: 'id$in-dimension$role$not',
                        type: termsItem.type,
                        value: termsItem.value,
                    };
                }
            }
            if(termsItem.column === 'roleList'){
                if(termsItem.termType === 'eq' || termsItem.termType === 'in'){
                    return {
                        column: 'id$in-dimension$role',
                        type: termsItem.type,
                        value: termsItem.value
                    }
                }else{
                    return {
                        column: 'id$in-dimension$role$not',
                        type: termsItem.type,
                        value: termsItem.value
                    }
                }
            }
            return termsItem;
        });

        if (arr.length) {
            termsGroupA.terms = [...termsGroupA.terms, ...arr];
        }

        return termsGroupA;
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
