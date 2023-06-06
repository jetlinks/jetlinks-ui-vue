<template>
    <page-container>
        <div class="data-source-container">
            <pro-search
                :columns="columns"
                target="category"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getDataSourceList_api"
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
                            type="primary"
                            :hasPermission="`${permission}:add`"
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
                                enabled: 'processing',
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
                        <j-space :size="16">
                            <PermissionButton
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: '编辑',
                                }"
                                @click="table.openDialog(slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                :hasPermission="`${permission}:manage`"
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
                                :hasPermission="`${permission}:action`"
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
                                :hasPermission="`${permission}:delete`"
                                type="link"
                                :tooltip="{
                                    title: table.getRowStatus(slotProps)
                                        ? '请先禁用，再删除'
                                        : '删除',
                                }"
                                :danger="true"
                                :popConfirm="{
                                    title: `确认删除`,
                                    onConfirm: () => table.clickDel(slotProps),
                                }"
                                :disabled="table.getRowStatus(slotProps)"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <EditDialog
                v-if="dialog.visible"
                @cancel="table.cancel"
                :data="dialog.selectItem"
                @confirm="table.refresh"
            />
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
import { message } from 'jetlinks-ui-components';

const permission = 'system/DataSource';

const router = useRouter();

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        width: '250px',
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
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '正常',
                    value: 'enabled',
                },
                {
                    label: '禁用',
                    value: 'disabled',
                },
            ],
        },
        scopedSlots: true,
        width: '120px',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: '160px',
        fixed: 'right',
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
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
        dialog.selectItem = { shareConfig: {}, ...row };
        dialog.visible = true;
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
        dialog.visible = false;
        dialog.selectItem = {};
    },
    cancel: () => {
        dialog.visible = false;
        dialog.selectItem = {};
    },
};
table.getTypeOption();

const dialog = reactive({
    visible: false,
    selectItem: {} as any,
});
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
