<template>
    <div>
        <pro-search
            :columns="columns"
            target="category-user"
            @search="handleParams"
            style='margin-bottom: 0;'
        />
        <FullPage>
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="table.requestFun"
                :params="queryParams"
                :rowSelection="{
                    selectedRowKeys: table._selectedRowKeys,
                    onChange: table.onSelectChange,
                }"
                @cancelSelect="table.cancelSelect"
                model="TABLE"
                :defaultParams="{
                    pageSize: 10,
                }"
                :pagination="{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        :hasPermission="`${permission}:bind-user`"
                        @click="dialogVisible = true"
                        style="margin-right: 15px"
                        :disabled='!parentId'
                    >
                        <AIcon type="PlusOutlined" />绑定用户
                    </PermissionButton>
                    <div
                        style="display: inline-block; width: 12px; height: 1px"
                    ></div>
                    <PermissionButton
                        :hasPermission="`${permission}:bind`"
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
                    <j-space :size="16">
                        <PermissionButton
                            type="link"
                            :hasPermission="`${permission}:bind`"
                            :popConfirm="{
                                title: `是否解除绑定`,
                                onConfirm: () => table.unBind(slotProps),
                            }"
                        >
                            <AIcon type="DisconnectOutlined" />
                        </PermissionButton>
                    </j-space>
                </template>
            </j-pro-table>
        </FullPage>

        <div class="dialogs">
            <AddBindUserDialog
                v-if="dialogVisible"
                v-model:visible="dialogVisible"
                :parent-id="props.parentId"
                @confirm="table.refresh"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="user">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddBindUserDialog from './components/AddBindUserDialog.vue';
import { getBindUserList_api, unBindUser_api } from '@/api/system/department';
import { message } from 'jetlinks-ui-components';

const permission = 'system/Department';

const props = defineProps<{
    parentId: string;
}>();

const columns = [
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
        dataIndex: 'status',
        key: 'status',
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
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: 80,
    },
];
// 搜索参数
const queryParams = ref({});

const handleParams = (params: any) => {
    queryParams.value = params;
};

// 表格
const tableRef = ref<Record<string, any>>({}); // 表格实例

const table = reactive({
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
                        type: 'and',
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

const dialogVisible = ref(false);

watch(
    () => props.parentId,
    () => {
        table.refresh();
    },
);
</script>
