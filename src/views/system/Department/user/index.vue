<template>
    <div>
        <pro-search
            :columns="columns"
            target="category-user"
            @search="handleParams"
            style="margin-bottom: 0"
        />
        <FullPage :extraHeight="24">
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="table.requestFun"
                :params="queryParams"
                :scroll="{
                    x: true,
                    y: 610,
                }"
                :rowSelection="{
                    selectedRowKeys: table._selectedRowKeys,
                    onSelect: table.onSelectChange,
                    onSelectAll: selectAll,
                    onSelectNone: () => (table._selectedRowKeys = []),
                }"
                model="TABLE"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        :hasPermission="`${permission}:bind-user`"
                        @click="dialogVisible = true"
                        style="margin-right: 15px"
                        :disabled="!parentId"
                    >
                        <AIcon type="PlusOutlined" />{{ $t('user.index.338020-0') }}
                    </PermissionButton>
                    <div
                        style="display: inline-block; width: 12px; height: 1px"
                    ></div>
                    <PermissionButton
                        :hasPermission="`${permission}:bind`"
                        :popConfirm="{
                            title: $t('user.index.338020-1'),
                            onConfirm: () => table.unBind(),
                        }"
                    >
                        <AIcon type="DisconnectOutlined" />{{ $t('user.index.338020-2') }}
                    </PermissionButton>
                </template>
                <template #status="slotProps">
                    <BadgeStatus
                        :status="slotProps.status"
                        :text="slotProps.status ? $t('user.index.338020-3') : $t('user.index.338020-4')"
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
                                title: $t('user.index.338020-1'),
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
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const permission = 'system/Department';

const props = defineProps<{
    parentId: string;
}>();

const columns = [
    {
        title: $t('user.index.338020-5'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('user.index.338020-6'),
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },

    {
        title: $t('user.index.338020-7'),
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'select',
            options: [
                {
                    label: $t('user.index.338020-3'),
                    value: 1,
                },
                {
                    label: $t('user.index.338020-4'),
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: $t('user.index.338020-8'),
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
        if (ids.length < 1)
            return onlyMessage($t('user.index.338020-9'), 'warning');

        const response = unBindUser_api(props.parentId, ids);
        response.then(() => {
            onlyMessage($t('user.index.338020-10'));
            table._selectedRowKeys = [];
            table.refresh();
        });
        return response;
    },
    onSelectChange: (row: any, selected: Boolean) => {
        const arr = new Set(table._selectedRowKeys);
        console.log(row);
        if (selected) {
            arr.add(row.id);
        } else {
            arr.delete(row.id);
        }
        table._selectedRowKeys = [...arr.values()];
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
});

const dialogVisible = ref(false);

const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!table._selectedRowKeys.includes(i.id)) {
                table._selectedRowKeys.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        table._selectedRowKeys.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        table._selectedRowKeys = _ids;
    }
};
watch(
    () => props.parentId,
    () => {
        table.refresh();
        table._selectedRowKeys = [];
    },
);
</script>
