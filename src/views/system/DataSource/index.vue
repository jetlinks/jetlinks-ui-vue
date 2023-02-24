<template>
    <page-container>
        <div class="data-source-container">
            <Search :columns="query.columns" @search="query.search" />

            <JTable
                ref="tableRef"
                :columns="table.columns"
                :request="getDataSourceList_api"
                model="TABLE"
                :params="query.params.value"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        :uhasPermission="`${permission}:add`"
                        @click="table.openDialog({})"
                    >
                        <AIcon type="PlusOutlined" />新增
                    </PermissionButton>
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    >
                    </BadgeStatus>
                </template>
                <template #typeId="slotProps">
                    {{
                        (table.typeOptions.value.length &&
                            table.getTypeLabel(slotProps.typeId)) ||
                        ''
                    }}
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <PermissionButton
                            :uhasPermission="`${permission}:update`"
                            type="link"
                            :tooltip="{
                                title: '编辑',
                            }"
                            @click="table.openDialog(slotProps)"
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            :uhasPermission="`${permission}:manage`"
                            type="link"
                            :tooltip="{
                                title:
                                    slotProps?.typeId === 'rabbitmq'
                                        ? '暂不支持管理功能'
                                        : table.getRowStatus(slotProps)
                                        ? '管理'
                                        : '请先启用数据源',
                            }"
                            @click="
                                () =>
                                    router.push(
                                        `/system/DataSource/Management?id=${slotProps.id}`,
                                    )
                            "
                            :disabled="
                                slotProps?.typeId === 'rabbitmq' ||
                                !table.getRowStatus(slotProps)
                            "
                        >
                            <AIcon type="icon-ziyuankuguanli" />
                        </PermissionButton>
                        <PermissionButton
                            :uhasPermission="`${permission}:action`"
                            type="link"
                            :popConfirm="{
                                title: `确定要${
                                    table.getRowStatus(slotProps)
                                        ? '禁用'
                                        : '启用'
                                }吗？`,
                                onConfirm: () =>
                                    table.clickChangeStatus(slotProps),
                            }"
                            :tooltip="{
                                title: table.getRowStatus(slotProps)
                                    ? '禁用'
                                    : '启用',
                            }"
                        >
                            <AIcon
                                :type="
                                    table.getRowStatus(slotProps)
                                        ? 'StopOutlined'
                                        : 'PlayCircleOutlined'
                                "
                            />
                            <!-- <AIcon type="PlayCircleOutlined" /> -->
                        </PermissionButton>

                        <PermissionButton
                            :uhasPermission="`${permission}:delete`"
                            type="link"
                            :tooltip="{
                                title: table.getRowStatus(slotProps)
                                    ? '请先禁用，再删除'
                                    : '删除',
                            }"
                            :popConfirm="{
                                title: `确认删除`,
                                onConfirm: () => table.clickDel(slotProps),
                            }"
                            :disabled="table.getRowStatus(slotProps)"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </a-space>
                </template>
            </JTable>

            <div class="dialogs">
                <EditDialog ref="editDialogRef" @confirm="table.refresh" />
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="DataSource">
import PermissionButton from '@/components/PermissionButton/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import EditDialog from './components/EditDialog.vue';

import type { dictItemType, optionItemType, sourceItemType } from './typing';

import {
    getDataSourceList_api,
    getDataTypeDict_api,
    changeStatus_api,
    delDataSource_api,
} from '@/api/system/dataSource';
import { message } from 'ant-design-vue';

const permission = 'system/DataSource';

const router = useRouter();

const query = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: '类型',
            dataIndex: 'typeId',
            key: 'typeId',
            search: {
                type: 'select',
                options: () =>
                    new Promise((resolve) => {
                        if (table.typeOptions.value.length > 0)
                            return resolve(table.typeOptions.value);
                        getDataTypeDict_api().then((resp: any) => {
                            const result = resp.result as dictItemType[];
                            resolve(
                                result.map((item) => ({
                                    label: item.name,
                                    value: item.id,
                                })),
                            );
                        });
                    }),
            },
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
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
                        value: 'enabled',
                    },
                    {
                        label: '已禁用',
                        value: 'disabled',
                    },
                ],
            },
        },
    ],
    params: ref({}),
    search: (params: object) => {
        query.params.value = params;
    },
};

const editDialogRef = ref(); // 新增弹窗实例
const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '250px',
        },
        {
            title: '类型',
            dataIndex: 'typeId',
            key: 'typeId',
            scopedSlots: true,
        },

        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            scopedSlots: true,
            width: '120px',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
            width: '200px',
            fixed: 'right',
        },
    ],

    typeOptions: ref<optionItemType[]>([]),

    getTypeOption: () => {
        getDataTypeDict_api().then((resp: any) => {
            const result = resp.result as dictItemType[];
            table.typeOptions.value = result.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        });
    },
    getTypeLabel: (val: string): string => {
        const options = table.typeOptions.value;
        if (options.length < 1 || val === '') return '';
        return options.find((item) => item.value === val)?.label || '';
    },

    getRowStatus: (row: sourceItemType) => {
        return row.state?.value === 'enabled';
    },
    // 打开编辑弹窗
    openDialog: (row: sourceItemType | {}) => {
        editDialogRef.value.openDialog({ shareConfig: {}, ...row });
    },
    // 删除
    clickDel: (row: sourceItemType) => {
        delDataSource_api(row.id as string).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                message.success('操作成功!');
            }
        });
    },
    clickChangeStatus: (row: sourceItemType) => {
        const status = row.state.value === 'enabled' ? '_disable' : '_enable';

        changeStatus_api(row.id as string, status).then(() => {
            message.success('操作成功');
            table.refresh();
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};
table.getTypeOption();
</script>

<style lang="less" scoped>
.data-source-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
