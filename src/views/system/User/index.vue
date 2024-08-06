<template>
    <page-container>
        <div class="user-container">
            <pro-search
                :columns="columns"
                target="system-user"
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
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'username', order: 'asc', value: 'admin' },
                        ],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            :hasPermission="`${permission}:add`"
                            type="primary"
                            @click="table.openDialog('add')"
                        >
                            <AIcon type="PlusOutlined" />{{ $t('User.index.363800-0') }}
                        </PermissionButton>
                    </template>
                    <template #username="slotProps">
                        <div class="username">
                            <Ellipsis>{{ slotProps.username }}</Ellipsis>
                        </div>
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
                        <BadgeStatus
                            :status="slotProps.status"
                            :text="slotProps.status ? $t('User.index.363800-1') : $t('User.index.363800-2')"
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
                                    title: $t('User.index.363800-3'),
                                }"
                                @click="table.openDialog('edit', slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                :hasPermission="`${permission}:action`"
                                type="link"
                                :tooltip="{
                                    title: `${ slotProps.status ? $t('User.index.363800-2') : $t('User.index.363800-4')
                                    }`,
                                }"
                                :popConfirm="{
                                    title: `${slotProps.status ? $t('User.index.363800-5') : $t('User.index.363800-6')}？`,
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
                                    title: $t('User.index.363800-7'),
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
                                        ? $t('User.index.363800-8')
                                        : $t('User.index.363800-9'),
                                }"
                                :popConfirm="{
                                    title: $t('User.index.363800-10'),
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
    queryRole_api,
} from '@/api/system/user';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';
const { t: $t } = useI18n();

const permission = 'system/User';

const columns = [
    {
        title: $t('User.index.363800-11'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('User.index.363800-12'),
        dataIndex: 'username',
        key: 'username',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('User.index.363800-13'),
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
        title: $t('User.index.363800-14'),
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
        title: $t('User.index.363800-15'),
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        search: {
            rename: 'status',
            type: 'select',
            options: [
                {
                    label: $t('User.index.363800-1'),
                    value: 1,
                },
                {
                    label: $t('User.index.363800-2'),
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: $t('User.index.363800-16'),
        dataIndex: 'telephone',
        key: 'telephone',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('User.index.363800-17'),
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('User.index.363800-18'),
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 200,
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
        const response = changeUserStatus_api(params);
        response.then(() => {
            onlyMessage($t('User.index.363800-19'));
            table.refresh();
        });
        return response;
    },
    // 删除
    clickDel: (id: string) => {
        const response = deleteUser_api(id);
        response.then(() => {
            onlyMessage($t('User.index.363800-19'));
            table.refresh();
        });
        return response;
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
.username {
    display: inline-block;
    border: 1px solid #91caff;
    padding: 0 8px;
    border-radius: 4px;
    color: #1677ff;
    background: #e6f4ff;
}
</style>
