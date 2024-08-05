<template>
    <page-container>
        <div class="permission-container">
            <pro-search
                :columns="columns"
                target="system-permission"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getPermission_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        sorts: [{ name: 'id', order: 'asc' }],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            :hasPermission="`${permission}:add`"
                            @click="table.openDialog(undefined)"
                        >
                            <AIcon type="PlusOutlined" />{{ $t('Permission.index.616688-0') }}
                        </PermissionButton>
                        <j-dropdown trigger="hover">
                            <j-button>{{ $t('Permission.index.616688-1') }}</j-button>
                            <template #overlay>
                                <j-menu>
                                    <j-menu-item>
                                        <j-upload
                                            name="file"
                                            action="#"
                                            accept=".json"
                                            :showUploadList="false"
                                            :before-upload="table.clickImport"
                                            :disabled="
                                                !hasPermission(
                                                    `${permission}:import`,
                                                )
                                            "
                                        >
                                            <PermissionButton
                                                :hasPermission="`${permission}:import`"
                                            >
                                                {{ $t('Permission.index.616688-2') }}
                                            </PermissionButton>
                                        </j-upload>
                                    </j-menu-item>
                                    <j-menu-item>
                                        <PermissionButton
                                            :hasPermission="`${permission}:export`"
                                            :popConfirm="{
                                                title: $t('Permission.index.616688-3'),
                                                onConfirm: () =>
                                                    table.clickExport(),
                                            }"
                                        >
                                            {{ $t('Permission.index.616688-4') }}
                                        </PermissionButton>
                                    </j-menu-item>
                                </j-menu>
                            </template>
                        </j-dropdown>
                    </template>
                    <template #status="slotProps">
                        <BadgeStatus
                            :status="slotProps.status"
                            :text="slotProps.status ? $t('Permission.index.616688-24') : $t('Permission.index.616688-25')"
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
                                    title: $t('Permission.index.616688-7'),
                                }"
                                @click="table.openDialog(slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>

                            <PermissionButton
                                :hasPermission="`${permission}:action`"
                                type="link"
                                :popConfirm="{
                                    title: `${
                                        slotProps.status ? $t('Permission.index.616688-8') : $t('Permission.index.616688-9')
                                    }？`,
                                    onConfirm: () =>
                                        table.changeStatus(slotProps),
                                }"
                                :tooltip="{
                                    title: slotProps.status ? $t('Permission.index.616688-6') : $t('Permission.index.616688-5'),
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
                                :hasPermission="`${permission}:delete`"
                                type="link"
                                :tooltip="{
                                    title: slotProps.status
                                        ? $t('Permission.index.616688-10')
                                        : $t('Permission.index.616688-11'),
                                }"
                                :popConfirm="{
                                    title: $t('Permission.index.616688-12'),
                                    onConfirm: () => table.clickDel(slotProps),
                                }"
                                :disabled="slotProps.status"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditDialog
                v-if="dialog.visible"
                v-model:visible="dialog.visible"
                :data="dialog.selectItem"
                @refresh="table.refresh"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditDialog from './components/EditDialog.vue';
import {
    getPermission_api,
    editPermission_api,
    delPermission_api,
    exportPermission_api,
} from '@/api/system/permission';
import { downloadObject } from '@/utils/utils';
import { usePermissionStore } from '@/store/permission';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const permission = 'system/Permission';
const hasPermission = usePermissionStore().hasPermission;

const columns = [
    {
        title: $t('Permission.index.616688-13'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Permission.index.616688-14'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Permission.index.616688-15'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Permission.index.616688-24'), value: 1 },
                { label: $t('Permission.index.616688-25'), value: 0 },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: $t('Permission.index.616688-16'),
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        scopedSlots: true,
    },
];
const queryParams = ref({});
const handleSearch = (e: any) => {
    queryParams.value = e;
};
// 表格
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        dialog.selectItem = { ...row };
        dialog.visible = true;
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
                            onlyMessage($t('Permission.index.616688-17'));
                            table.refresh();
                        }
                    });
                } catch (error) {
                    onlyMessage($t('Permission.index.616688-18'), 'error');
                }
            };
        } else onlyMessage($t('Permission.index.616688-19'), 'error');
        return false;
    },
    // 导出数据
    clickExport: () => {
        const params = {
            paging: false,
            ...queryParams.value,
        };
        const response = exportPermission_api(params)
        response.then((resp) => {
            if (resp.status === 200) {
                downloadObject(resp.result as any, $t('Permission.index.616688-20'));
                onlyMessage($t('Permission.index.616688-21'));
            } else {
                onlyMessage($t('Permission.index.616688-22'), 'error');
            }
        });
        return response
    },
    // 修改状态
    changeStatus: (row: any) => {
        const params = {
            ...row,
            status: row.status ? 0 : 1,
        };
        const response = editPermission_api(params)
        response.then(() => {
            onlyMessage($t('Permission.index.616688-23'));
            tableRef.value.reload();
        });
        return response
    },
    // 删除
    clickDel: (row: any) => {
        const response = delPermission_api(row.id)
        response.then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                onlyMessage($t('Permission.index.616688-23'));
            }
        });
        return response
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};

const dialog = reactive({
    selectItem: {},
    visible: false,
});
</script>

<style lang="less" scoped>
.permission-container {
    .ant-dropdown-trigger {
        margin-left: 12px;
    }

    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
