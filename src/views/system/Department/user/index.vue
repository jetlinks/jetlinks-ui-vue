<template>
    <div>
        <Search :columns="query.columns" @search="query.search" />

        <JTable
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
                <a-button
                    type="primary"
                    @click="table.openDialog"
                    style="margin-right: 10px"
                >
                    <AIcon type="PlusOutlined" />绑定用户
                </a-button>
                <a-popconfirm
                    title="是否解除绑定"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="table.unBind()"
                >
                    <a-button
                        ><AIcon type="DisconnectOutlined" />批量解绑</a-button
                    >
                </a-popconfirm>
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
                    <a-popconfirm
                        title="是否解除绑定"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.unBind(slotProps)"
                    >
                        <a-button style="padding: 0" type="link">
                            <AIcon type="DisconnectOutlined" />
                        </a-button>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

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
import AddBindUserDialog from './components/addBindUserDialog.vue';
import { getBindUserList_api, unBindUser_api } from '@/api/system/department';
import { message } from 'ant-design-vue';

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
