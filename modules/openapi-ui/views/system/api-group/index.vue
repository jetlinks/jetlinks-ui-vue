<template>
    <j-page-container>
        <pro-search
            :columns="columns"
            target="api-group"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="columns"
                :request="queryApiGroups"
                :defaultParams="{
          sorts: [{ name: 'updateTime', order: 'desc' }],
        }"
                :params="params"
                :gridColumns="[2, 2, 3]"
            >
                <template #headerLeftRender>
                    <a-space>
                        <a-button type="primary" @click="handleAdd">
                            <template #icon>
                                <AIcon type="PlusOutlined"/>
                            </template>
                            {{ $t('ApiGroup.index.784523-0') }}
                        </a-button>
                    </a-space>
                </template>

                <template #card="slotProps">
                    <CardBox
                        :showStatus="true"
                        :value="slotProps"
                        :statusNames="statusNames"
                        :actions="getActions(slotProps)"
                    >
                        <template #content>
                            <h3 class="card-title">{{ slotProps.name }}</h3>
                            <a-row :gutter="16">
                                <a-col :span="12">
                                    <div class="card-label">{{ $t('ApiGroup.index.784523-1') }}</div>
                                    <div class="card-value">{{ slotProps.appName || '-' }}</div>
                                </a-col>
                                <a-col :span="12">
                                    <div class="card-label">{{ $t('ApiGroup.index.784523-2') }}</div>
                                    <div class="card-value">
                                        {{ (slotProps.operations && slotProps.operations.length) || 0 }}
                                    </div>
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <a-tooltip
                                v-for="action in item"
                                :key="action.key"
                                :title="action.tooltip?.title"
                            >
                                <j-permission-button
                                    v-if="action.key === 'delete'"
                                    :hasPermission="`${permission}:${action.key}`"
                                    :popConfirm="action.popConfirm"
                                    :danger="action.danger"
                                    type="link"
                                >
                                    <template #icon>
                                        <AIcon :type="action.icon"/>
                                    </template>
                                </j-permission-button>
                                <j-permission-button
                                    v-else
                                    :hasPermission="`${permission}:${action.key}`"
                                    @click="action.onClick"
                                    type="link"
                                >
                                    <template #icon>
                                        <AIcon :type="action.icon"/>
                                    </template>
                                </j-permission-button>
                            </a-tooltip>
                        </template>
                    </CardBox>
                </template>

                <template #enabled="slotProps">
                    <a-tag :color="slotProps.status.value === 'enabled' ? 'success' : 'default'">
                        {{
                            slotProps.status.value === 'enabled' ? $t('ApiGroup.index.784523-19') : $t('ApiGroup.index.784523-18')
                        }}
                    </a-tag>
                </template>

                <template #apiCount="slotProps">
                    {{ (slotProps.operations && slotProps.operations.length) || 0 }}
                </template>

                <template #action="slotProps">
                    <a-space>
                        <template v-for="i in getActions(slotProps)" :key="i.key">
                            <j-permission-button
                                :danger="i.key === 'delete'"
                                :popConfirm="i.popConfirm"
                                :tooltip="i.tooltip"
                                @click="i.onClick"
                                type="link"
                                :hasPermission="`${permission}:${i.key}`"
                            >
                                <template #icon>
                                    <AIcon :type="i.icon"/>
                                </template>
                            </j-permission-button>
                        </template>
                    </a-space>
                </template>
            </JProTable>
        </FullPage>
    </j-page-container>
</template>

<script setup lang="ts">
import apiGroupApi from '../../../api/apiGroup'
import type {ApiGroupItem} from './types'
import {useMenuStore, useAuthStore} from '@jetlinks-web-core/store'
import {onlyMessage} from '@jetlinks-web/utils'
import {useI18n} from 'vue-i18n'

const {t: $t} = useI18n()
const menuStory = useMenuStore()
const authStore = useAuthStore()

// 权限代码，对应菜单code（从文件路径生成：views/system/api-group/index.vue -> system/api-group）
const permission = 'system/api-group'

// 调试：查看权限数据
onMounted(() => {
    console.log('=== 权限调试信息 ===')
    console.log('permission code:', permission)
    console.log('所有权限数据:', authStore.permissions)
    console.log('当前菜单权限:', authStore.getPermission(permission))
    console.log('检查 view 权限:', authStore.hasPermission(`${permission}:view`))
    console.log('检查 update 权限:', authStore.hasPermission(`${permission}:update`))
    console.log('检查 delete 权限:', authStore.hasPermission(`${permission}:delete`))
})

const tableRef = ref()
const params = ref<Record<string, any>>({})

const statusNames = {
    1: 'success',
    0: 'error',
}

const columns = [
    {
        title: $t('ApiGroup.index.784523-9'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ApiGroup.index.784523-1'),
        dataIndex: 'appName',
        key: 'appName',
        ellipsis: true,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: $t('ApiGroup.index.784523-2'),
        dataIndex: 'apiCount',
        key: 'apiCount',
        width: 100,
        scopedSlots: true,
    },
    {
        title: $t('ApiGroup.index.784523-7'),
        dataIndex: 'status',
        key: 'enabled',
        width: 100,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {label: '正常', value: 'enabled'},
                {label: '禁用', value: 'disabled'},
            ],
        },
    },
    {
        title: $t('ApiGroup.index.784523-11'),
        key: 'action',
        fixed: 'right',
        width: 180,
        scopedSlots: true,
    },
]

const queryApiGroups = (params: any) => {
    return apiGroupApi.query(params)
}

const handleSearch = (e: any) => {
    params.value = e
}

const handleAdd = () => {
    menuStory.jumpPage('system/api-group/Detail', {
        params: {
            id: ':id',
        },
    })
}

const handleEdit = (record: ApiGroupItem) => {
    menuStory.jumpPage('system/api-group/Detail', {
        params: {
            id: record.id,
        },
    })
}

const handleDelete = async (record: ApiGroupItem) => {
    try {
        const resp = await apiGroupApi.delete(record.id)
        if (resp.success) {
            onlyMessage($t('ApiGroup.index.784523-12'))
            tableRef.value?.reload()
        }
    } catch (error) {
        console.error('删除失败:', error)
        onlyMessage($t('ApiGroup.index.784523-13'), 'error')
    }
}

const handleToggleEnabled = async (record: ApiGroupItem) => {
    try {
        const newStatus = record.status?.value === 'enabled' ? 'disabled' : 'enabled'
        const resp = await apiGroupApi.update(record.id, {
            id: record.id,
            status: newStatus,
        })
        if (resp.success) {
            onlyMessage(newStatus === 'enabled' ? $t('ApiGroup.index.784523-18') : $t('ApiGroup.index.784523-19'))
            tableRef.value?.reload()
        }
    } catch (error) {
        console.error('更新启用状态失败:', error)
        onlyMessage($t('ApiGroup.index.784523-22'), 'error')
    }
}

const getActions = (record: ApiGroupItem) => {
    return [
        {
            key: 'update',
            tooltip: {
                title: $t('ApiGroup.index.784523-15'),
            },
            icon: 'EditOutlined',
            onClick: () => handleEdit(record),
        },
        {
            key: 'update',
            tooltip: {
                title: record.status?.value === 'enabled' ? $t('ApiGroup.index.784523-19') :
                    $t('ApiGroup.index.784523-18'),
            },
            icon: record.status?.value === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            onClick: () => handleToggleEnabled(record),
        },
        {
            key: 'delete',
            tooltip: {
                title: $t('ApiGroup.index.784523-16'),
            },
            icon: 'DeleteOutlined',
            popConfirm: {
                title: $t('ApiGroup.index.784523-17'),
                onConfirm: () => handleDelete(record),
            },
            danger: true,
        },
    ]
}
</script>

<style lang="less" scoped>
.card-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
}

.card-label {
    margin-bottom: 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
}

.card-value {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
