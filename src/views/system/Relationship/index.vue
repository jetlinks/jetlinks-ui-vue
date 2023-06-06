<template>
    <page-container>
        <div class="relationship-container">
            <pro-search
                :columns="columns"
                target="category"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getRelationshipList_api"
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
                            @click="table.openDialog(undefined)"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
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
                                :danger="true"
                                :hasPermission="`${permission}:delete`"
                                type="link"
                                :tooltip="{ title: '删除' }"
                                :popConfirm="{
                                    title: `确认删除`,
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
                :data="dialog.selectRow"
                @refresh="table.refresh"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Relationship">
import PermissionButton from '@/components/PermissionButton/index.vue';
import {
    getRelationshipList_api,
    delRelation_api,
} from '@/api/system/relationship';
import { message } from 'jetlinks-ui-components';
import EditDialog from './components/EditDialog.vue';

const permission = 'system/Relationship';

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '关联方',
        dataIndex: 'objectTypeName',
        key: 'objectTypeName',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'select',
            options: [
                {
                    label: '用户',
                    value: '用户',
                },
                {
                    label: '设备',
                    value: '设备',
                },
            ],
        },
    },
    {
        title: '被关联方',
        dataIndex: 'targetTypeName',
        key: 'targetTypeName',
        ellipsis: true,
        fixed: 'left',
        search: {
            rename: 'targetType',
            type: 'select',
            options: [
                {
                    label: '用户',
                    value: 'user',
                },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: 100,
    },
];
const queryParams = ref({});

const tableRef = ref<Record<string, any>>({}); // 表格实例
const table = {
    // 打开编辑弹窗
    openDialog: (row: object | undefined = {}) => {
        dialog.selectRow = { ...row };
        dialog.visible = true;
    },
    // 删除
    clickDel: (row: any) => {
        delRelation_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                message.success('操作成功!');
            } else {
                message.error(resp.message);
            }
        });
    },
    // 刷新列表
    refresh: () => {
        tableRef.value.reload();
    },
};

const dialog = reactive({
    selectRow: {} as any,
    visible: false,
});
</script>

<style lang="less" scoped>
.relationship-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
