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
                modeValue="CARD"
                :gridColumns="[2, 2, 3]"
                :rowSelection="isGrantMode ? {
                    selectedRowKeys: selectedGroupIds,
                    onChange: handleSelectionChange
                } : undefined"
            >
                <template #headerLeftRender>
                    <a-space v-if="!isGrantMode">
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
                        :status="slotProps.status?.value"
                        :statusText="slotProps.status?.text"
                        :statusNames="statusNames"
                        :actions="isGrantMode ? [] : getActions(slotProps)"
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
                                v-bind="item.tooltip"
                                :title="item.disabled && item.tooltip?.title"
                            >
                                <j-permission-button
                                    :hasPermission="item.permission || `${permission}:${item.key}`"
                                    :tooltip="item.tooltip"
                                    :pop-confirm="item.popConfirm"
                                    @click="item.onClick"
                                    :disabled="item.disabled"
                                    :danger="item.danger"
                                    type="link"
                                >
                                    <template #icon>
                                        <AIcon :type="item.icon"/>
                                    </template>
                                    <span v-if="item.key !== 'delete'">{{ item.text }}</span>
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
                                :hasPermission="i.permission || `${permission}:${i.key}`"
                                :disabled="i.disabled"
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

        <!-- 赋权模式下的操作栏 -->
        <div v-if="isGrantMode" class="grant-action-bar">
            <a-space>
                <a-button @click="handleCancelGrant">取消</a-button>
                <a-button
                    type="primary"
                    :loading="saving"
                    @click="handleSaveGrant"
                    :disabled="selectedGroupIds.length === 0"
                >
                    保存
                </a-button>
            </a-space>
        </div>
    </j-page-container>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import apiGroupApi from '../../../api/apiGroup'
import type {ApiGroupItem} from './types'
import {useMenuStore, useAuthStore} from '@jetlinks-web-core/store'
import {onlyMessage} from '@jetlinks-web/utils'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'

const {t: $t} = useI18n()
const menuStory = useMenuStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// 判断是否为赋权模式
const isGrantMode = computed(() => route.query.mode === 'grant')

// 赋权模式相关状态
const selectedGroupIds = ref<string[]>([])
const saving = ref(false)

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

    // 赋权模式下加载已授权的分组
    if (isGrantMode.value) {
        loadGrantedGroups()
    }
})

const tableRef = ref()
const params = ref<Record<string, any>>({})

const statusNames = {
    enabled: 'processing',
    disabled: 'error',
}

const columns = computed(() => {
    const baseColumns = [
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
    ]

    // 非赋权模式才显示操作列
    if (!isGrantMode.value) {
        baseColumns.push({
            title: $t('ApiGroup.index.784523-11'),
            key: 'action',
            fixed: 'right',
            width: 180,
            scopedSlots: true,
        })
    }

    return baseColumns
})

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
    // 未禁用的数据不允许删除（默认置灰）
    const isEnabled = record.status?.value === 'enabled'
    
    return [
        {
            permission: `${permission}:update`,
            key: 'update',
            text: $t('ApiGroup.index.784523-15'),
            tooltip: {
                title: $t('ApiGroup.index.784523-15'),
            },
            icon: 'EditOutlined',
            onClick: () => handleEdit(record),
        },
        {
            permission: `${permission}:update`,
            key: 'toggle',
            text: record.status?.value === 'enabled' ? $t('ApiGroup.index.784523-18') :
                $t('ApiGroup.index.784523-19'),
            tooltip: {
                title: record.status?.value === 'enabled' ? $t('ApiGroup.index.784523-18') :
                    $t('ApiGroup.index.784523-19'),
            },
            icon: record.status?.value === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${record.status?.value === 'enabled' ? $t('ApiGroup.index.784523-18') : $t('ApiGroup.index.784523-19')}?`,
                onConfirm: () => handleToggleEnabled(record),
            },
        },
        {
            permission: `${permission}:delete`,
            key: 'delete',
            text: $t('ApiGroup.index.784523-16'),
            tooltip: {
                title: isEnabled ? '未禁用的数据不允许删除' : $t('ApiGroup.index.784523-16'),
            },
            icon: 'DeleteOutlined',
            popConfirm: isEnabled ? undefined : {
                title: $t('ApiGroup.index.784523-17'),
                onConfirm: () => handleDelete(record),
            },
            danger: true,
            disabled: isEnabled,
        },
    ]
}

// 赋权模式相关方法
const handleSelectionChange = (selectedRowKeys: string[]) => {
    selectedGroupIds.value = selectedRowKeys
}

const handleCancelGrant = () => {
    router.back()
}

const handleSaveGrant = async () => {
    if (saving.value) {
        return
    }

    if (selectedGroupIds.value.length === 0) {
        onlyMessage('请至少选择一个 API 分组', 'warning')
        return
    }

    saving.value = true
    try {
        const appId = route.query.appId as string
        const targetType = 'api-client' // 应用类型固定为 api-client

        // 构建授权数据
        const grantData = selectedGroupIds.value.map(groupId => ({
            groupId,
            operationIds: [], // 暂时为空，后续可以支持选择具体的 operations
            merge: true,
            priority: 10
        }))

        await apiGroupApi.grant(targetType, appId, grantData)
        onlyMessage('授权成功')
        router.back()
    } catch (error) {
        console.error('授权失败:', error)
        onlyMessage('授权失败', 'error')
    } finally {
        saving.value = false
    }
}

// 加载已授权的分组
const loadGrantedGroups = async () => {
    if (!isGrantMode.value) {
        return
    }

    try {
        const appId = route.query.appId as string
        const targetType = 'api-client'
        const resp = await apiGroupApi.queryGrant(targetType, appId)
        if (resp.success && resp.result) {
            selectedGroupIds.value = resp.result.map((item: any) => item.groupId)
        }
    } catch (error) {
        console.error('加载已授权分组失败:', error)
    }
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

.grant-action-bar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 200px;
    padding: 16px 24px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: flex-end;
    z-index: 100;
}
</style>
