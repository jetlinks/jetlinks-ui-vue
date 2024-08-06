<template>
    
        <div class="role-container">
            <pro-search :columns="columns" target="system-role" @search="handelSearch" />
            <FullPage>
                <j-pro-table ref="tableRef" :columns="columns" :request="getRoleList_api" model="TABLE"
                    :params="queryParams" :defaultParams="{
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'id', order: 'desc' },
                        ]
                    }">
                    <template #headerTitle>
                        <PermissionButton type="primary" :hasPermission="`${permission}:add`" @click="addRole">
                            <AIcon type="PlusOutlined" />{{ $t('RoleRight.index.529973-0') }}
                        </PermissionButton>
                    </template>

                    <template #action="slotProps">
                        <j-space :size="16">
                            <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                                <PermissionButton :disabled="i.disabled" :popConfirm="i.popConfirm" :tooltip="{
                                    ...i.tooltip,
                                }" @click="i.onClick" type="link" style="padding: 0 5px" :danger="i.key === 'delete'"
                                    :hasPermission="'system/Role:' + i.key
                                        ">
                                    <template #icon>
                                        <AIcon :type="i.icon" />
                                    </template>
                                </PermissionButton>
                            </template>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <AddDialog  v-if="dialogVisible" v-model:visible="dialogVisible" :groupId="groupId" :modalType="modalType"
                :current="current" 
                @refresh="tableRef?.reload()"
                />
        </div>
    
</template>

<script setup lang="ts" name="Role">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddDialog from './components/AddDialog.vue';
import { getRoleList_api, delRole_api } from '@/api/system/role';
import type { ActionsType } from '@/components/Table';
import { useMenuStore } from '@/store/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    groupId: {
        type: String,
        default: ''
    }
})
const permission = 'system/Role';
const { jumpPage } = useMenuStore();
const modalType = ref('add')
const current = ref()
const isSave = !!useRoute().query.save;
const queryParams = ref<any>({terms:[]});
// 表格
const tableRef = ref<Record<string, any>>();
const dialogVisible = ref(isSave);
const columns = [
    {
        title: $t('RoleRight.index.529973-1'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('RoleRight.index.529973-2'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('RoleRight.index.529973-3'),
        key: 'description',
        ellipsis: true,
        dataIndex: 'description',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('RoleRight.index.529973-4'),
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        scopedSlots: true,
    },
];
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('RoleRight.index.529973-5'),
            tooltip: {
                title: $t('RoleRight.index.529973-5'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                dialogVisible.value = true;
                modalType.value = 'edit';
                current.value = data
            },
        },
        {
            key: 'update',
            text: $t('RoleRight.index.529973-6'),
            tooltip: {
                title: $t('RoleRight.index.529973-6')
            },
            onClick: () => {
                jumpPage(`system/Role/Detail`, {
                    id: data.id,
                })
            },
            icon: 'FormOutlined'
        },
        {
            key: 'delete',
            text: $t('RoleRight.index.529973-7'),
            tooltip: {
                title: $t('RoleRight.index.529973-7'),
            },
            popConfirm: {
                title: $t('RoleRight.index.529973-8'),
                placement:'topRight',
                onConfirm: async () => {
                    const res = await delRole_api(data.id)
                    if (res.status === 200) {
                        onlyMessage($t('RoleRight.index.529973-9'))
                        tableRef.value?.reload()
                    } else {
                        onlyMessage($t('RoleRight.index.529973-10'), 'error')
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

const addRole = () => {
    dialogVisible.value = true
    modalType.value = 'add'
}
const handelSearch = (search: any) => {
    queryParams.value.terms =props.groupId ? [{
        value: props.groupId,
        termType: 'eq',
        column: 'groupId'
    }, ...search.terms] : [...search.terms]
}
watch(() => props.groupId, (value) => {
    queryParams.value = value ? {
        terms: [{
            value: props.groupId,
            termType: 'eq',
            column: 'groupId'
        }]
    } : {
        terms: []
    }
})
</script>

<style lang="less" scoped>
.role-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
