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
                            <AIcon type="PlusOutlined" />{{ $t('Relationship.index.635690-0') }}
                        </PermissionButton>
                    </template>
                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: $t('Relationship.index.635690-1'),
                                }"
                                @click="table.openDialog(slotProps)"
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>

                            <PermissionButton
                                :danger="true"
                                :hasPermission="`${permission}:delete`"
                                type="link"
                                :tooltip="{ title: $t('Relationship.index.635690-2') }"
                                :popConfirm="{
                                    title: $t('Relationship.index.635690-3'),
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const permission = 'system/Relationship';

const columns = [
    {
        title: $t('Relationship.index.635690-4'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Relationship.index.635690-5'),
        dataIndex: 'reverseName',
        key: 'reverseName',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Relationship.index.635690-6'),
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
        title: $t('Relationship.index.635690-7'),
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
        title: $t('Relationship.index.635690-8'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Relationship.index.635690-9'),
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
       const response =  delRelation_api(row.id)
       response.then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                onlyMessage($t('Relationship.index.635690-10'));
            } else {
                onlyMessage(resp.message, 'error');
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
