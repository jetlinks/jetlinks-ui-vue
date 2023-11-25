<template>
    <page-container>
        <div class="relationship-container">
            <pro-search
                :columns="columns"
                target="system-relationship"
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
                        sorts: [{ name: 'createTime', order: 'desc' }],
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
    getObjectList_api
} from '@/api/system/relationship';
import EditDialog from './components/EditDialog.vue';
import { onlyMessage } from '@/utils/comm';

const permission = 'system/Relationship';

const columns = [
    {
        title: '正向关系名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '反向关系名称',
        dataIndex: 'reverseName',
        key: 'reverseName',
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
            rename:'objectType',
            type: 'select',
            options: async () =>{
               const res:any = await getObjectList_api()
               return res.result?.map((i:any)=>{
                return {
                    label:i.name,
                    value:i.id
                }
               })
            }
        }
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
            options: async () =>{
               const res:any = await getObjectList_api()
               return res.result?.map((i:any)=>{
                return {
                    label:i.name,
                    value:i.id
                }
               })
            } 
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
                onlyMessage('操作成功!');
            } else {
                onlyMessage(resp.message, 'error');
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
