<template>
    <div class="role-user-container">
        <pro-search
            :columns="columns"
            target="system-role-user"
            @search="(params:any)=>queryParams = {...params}"
        />

        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :request="table.getList"
            model="TABLE"
            :params="queryParams"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: onSelectChange,
                onSelectAll: selectAll,
                onSelectNone: () => (selectedRowKeys = []),
            }"
            size="small"
        >
            <template #headerTitle>
                <j-space>
                    <j-button type="primary" @click="dialogVisible = true">
                        <AIcon type="PlusOutlined" />{{ $t('User.index.529977-0') }}
                    </j-button>
                    <PermissionButton
                        :popConfirm="{
                            title: $t('User.index.529977-1'),
                            placement: 'topRight',
                            onConfirm: () => table.unbind(),
                        }"
                    >
                        <AIcon type="DisconnectOutlined" />{{ $t('User.index.529977-2') }}
                    </PermissionButton>
                </j-space>
            </template>

            <template #status="slotProps">
                <BadgeStatus
                    :status="slotProps.status"
                    :text="slotProps.status ? $t('User.index.529977-3') : $t('User.index.529977-4')"
                    :statusNames="{
                        1: 'success',
                        0: 'error',
                    }"
                ></BadgeStatus>
            </template>
            <template #createTime="slotProps">
                {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>

            <template #action="slotProps">
                <j-space :size="16">
                    <PermissionButton
                        type="link"
                        :tooltip="{ title: $t('User.index.529977-5') }"
                        :pop-confirm="{
                            title: $t('User.index.529977-6'),
                            onConfirm: () => table.unbind([slotProps.id]),
                        }"
                    >
                        <AIcon type="DisconnectOutlined" />
                    </PermissionButton>
                </j-space>
            </template>
        </j-pro-table>

        <AddUserDialog
            v-if="dialogVisible"
            v-model:visible="dialogVisible"
            :role-id="roleId"
            @refresh="table.refresh"
        />
    </div>
</template>

<script setup lang="ts" name="RoleUser">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddUserDialog from '../components/AddUserDialog.vue';
import { getUserByRole_api, unbindUser_api } from '@/api/system/role';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const roleId = useRoute().params.id as string;

const columns = [
    {
        title: $t('User.index.529977-7'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('User.index.529977-8'),
        dataIndex: 'username',
        key: 'username',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('User.index.529977-9'),
        dataIndex: 'createTime',
        key: 'createTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: $t('User.index.529977-10'),
        dataIndex: 'status',
        key: 'status',
        search: {
            type: 'select',
            options: [
                {
                    label: $t('User.index.529977-3'),
                    value: 1,
                },
                {
                    label: $t('User.index.529977-4'),
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: $t('User.index.529977-11'),
        dataIndex: 'action',
        key: 'action',
        width: '200px',
        scopedSlots: true,
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({});
const selectedRowKeys = ref<string[]>([]);
const table = {
    getList: (oParams: any) => {
        const params = {
            ...oParams,
            terms: [
                {
                    terms: [
                        {
                            column: 'id$in-dimension$role',
                            value: roleId,
                        },
                    ],
                },
            ],
        };
        if (oParams.terms[0])
            params.terms.unshift({
                terms: oParams.terms[0].terms,
            });
        return getUserByRole_api(params);
    },
    // 批量解绑
    unbind: (ids?: string[]) => {
        const data = ids ? ids : selectedRowKeys.value;
        if (!data.length) {
            onlyMessage($t('User.index.529977-12'), 'warning');
            return;
        }
        const response = unbindUser_api(roleId, data)
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('User.index.529977-13'));
                table.refresh();
            }
        });
        return response
    },
    // 刷新表格
    refresh: () => {
        tableRef.value.reload();
        selectedRowKeys.value = [];
    },
};

const onSelectChange = (item: any, state: boolean) => {
    const arr = new Set(selectedRowKeys.value);
    if (state) {
        arr.add(item.id);
    } else {
        arr.delete(item.id);
    }
    selectedRowKeys.value = [...arr.values()];
};

const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!selectedRowKeys.value.includes(i.id)) {
                selectedRowKeys.value.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        selectedRowKeys.value.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        selectedRowKeys.value = _ids;
    }
};

// 弹窗相关
const dialogVisible = ref(false);
</script>

<style lang="less" scoped>
.role-user-container {
    background-color: #fff;

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
