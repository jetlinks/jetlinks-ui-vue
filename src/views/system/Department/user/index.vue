<template>
    <div>
        <Search :columns="query.columns" @search="query.search" />

        <j-pro-table
            ref="tableRef"
            :columns="table.columns"
            :request="table.requestFun"
            :params="query.params"
            :rowSelection="{
                selectedRowKeys: table._selectedRowKeys,
                onChange: table.onSelectChange,
            }"
            @cancelSelect="table.cancelSelect"
            model="TABLE"
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    :uhasPermission="`${permission}:bind-user`"
                    @click="table.openDialog"
                    style="margin-right: 15px;"
                >
                    <AIcon type="PlusOutlined" />绑定用户
                </PermissionButton>
                <div style="display: inline-block;width: 12px;height: 1px;"></div>
                <PermissionButton
                    :uhasPermission="`${permission}:bind`"
                    :popConfirm="{
                        title: `是否解除绑定`,
                        onConfirm: () => table.unBind(),
                    }"
                >
                    <AIcon type="DisconnectOutlined" />批量解绑
                </PermissionButton>
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
                <a-space :size="16">
                    <PermissionButton
                        type="link"
                        :uhasPermission="`${permission}:bind`"
                        :popConfirm="{
                            title: `是否解除绑定`,
                            onConfirm: () => table.unBind(slotProps),
                        }"
                    >
                        <AIcon type="DisconnectOutlined" />
                    </PermissionButton>
                </a-space>
            </template>
        </j-pro-table>

        <div class="dialogs">
            <AddBindUserDialog
                ref="addDialogRef"
                :parent-id="props.parentId"
                @confirm="table.refresh"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="user">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddBindUserDialog from './components/addBindUserDialog.vue';
import { getBindUserList_api, unBindUser_api } from '@/api/system/department';
import { message } from 'ant-design-vue';

const permission = 'system/Department';

const addDialogRef = ref();

const props = defineProps<{
    parentId: string;
}>();

const query = {
    columns: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            fixed: 'left',
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
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            ellipsis: true,
            fixed: 'left',
            search: {
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
        },
    ],
    params: ref({}),
    search: (params: any) => {
        query.params.value = params;
    },
};

// 表格
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = reactive({
    columns: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
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
    _selectedRowKeys: [] as string[],

    requestFun: async (oParams: any) => {
        table.cancelSelect();
        if (props.parentId) {
            const params = {
                ...oParams,
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    ...oParams.terms,
                    {
                        terms: [
                            {
                                column: 'id$in-dimension$org',
                                value: props.parentId,
                            },
                        ],
                    },
                ],
            };
            const resp: any = await getBindUserList_api(params);
            return {
                code: resp.status,
                result: resp.result,
                status: resp.status,
            };
        } else {
            return {
                code: 200,
                result: {
                    data: [],
                    pageIndex: 0,
                    pageSize: 0,
                    total: 0,
                },
                status: 200,
            };
        }
    },
    unBind: (row?: any) => {
        const ids = row ? [row.id] : table._selectedRowKeys;
        if (ids.length < 1) return message.warning('请勾选需要解绑的数据');

        unBindUser_api(props.parentId, ids).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    // 打开编辑弹窗
    openDialog: () => {
        addDialogRef.value && addDialogRef.value.openDialog();
    },
    onSelectChange: (keys: string[]) => {
        table._selectedRowKeys = keys;
    },
    cancelSelect: () => {
        table._selectedRowKeys = [];
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
});
</script>

<style scoped></style>
