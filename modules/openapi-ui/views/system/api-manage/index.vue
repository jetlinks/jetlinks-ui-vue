<template>
    <j-page-container>
        <a-card>
            <div class="api-manage-container">
                <!-- 主内容区：左导航 + 中列表 -->
                <div class="content-wrapper">
                    <!-- 左侧：过滤导航 -->
                    <div class="left-panel">
                        <ApiFilterNav
                            :all-data="allApiData"
                            :current-filters="currentFilters"
                            @filter-change="handleFilterChange"
                        />
                    </div>

                    <!-- 中间：API 列表 -->
                    <div class="middle-panel">
                        <a-spin :spinning="loading" style="width: 100%">
                            <div v-if="filteredApiData.length === 0" class="empty-state">
                                <a-empty description="暂无数据"/>
                            </div>

                            <!-- 手风琴列表 -->
                            <div v-else class="api-collapse-wrapper">
                                <a-collapse v-for="group in groupedApiData" :key="group.name">
                                    <a-collapse-panel :header="`${group.name} (${group.apis.length})`">
                                        <!-- 表头 -->
                                        <div class="list-header">
                                            <div class="header-cell checkbox-cell">
                                                <a-checkbox
                                                    :indeterminate="group.selectedCount > 0 && group.selectedCount < group.apis.length"
                                                    :checked="group.selectedCount === group.apis.length && group.apis.length > 0"
                                                    @change="(e) => handleGroupSelectAll(group, e)"
                                                />
                                            </div>
                                            <div class="header-cell path-cell">路径</div>
                                            <div class="header-cell visibility-cell">可见性</div>
                                            <div class="header-cell risk-cell">风险</div>
                                            <div class="header-cell type-cell">操作</div>
                                            <div class="header-cell action-cell">操作</div>
                                        </div>

                                        <!-- 列表行 -->
                                        <div
                                            v-for="api in group.apis"
                                            :key="api.id"
                                            class="list-row"
                                            :class="{ 'selected': selectedApiIds.has(api.id) }"
                                        >
                                            <div class="cell checkbox-cell">
                                                <a-checkbox
                                                    :checked="selectedApiIds.has(api.id)"
                                                    @change="() => handleToggleSelect(api.id)"
                                                />
                                            </div>

                                            <div class="cell path-cell">
                                                <div class="path-info">
                                                    <a-tag :color="getMethodColor(api.method)" style="margin: 0">
                                                        {{ api.method }}
                                                    </a-tag>
                                                    <code class="path-text">{{ api.path }}</code>
                                                </div>
                                                <div v-if="api.description" class="desc-text">
                                                    {{ api.description }}
                                                </div>
                                            </div>

                                            <div class="cell visibility-cell">
                      <span :style="{ color: getVisibilityColor(api.visibility) }">
                        {{ getVisibilityLabel(api.visibility) }}
                      </span>
                                            </div>

                                            <div class="cell risk-cell">
                                                <a-tag
                                                    :color="getRiskColor(api.riskLevel)"
                                                    style="margin: 0"
                                                >
                                                    <template v-if="api.riskLevel === 'high'">
                                                        <AIcon type="ExclamationCircleOutlined"/>
                                                    </template>
                                                    {{ getRiskLabel(api.riskLevel) }}
                                                </a-tag>
                                            </div>

                                            <div class="cell type-cell">
                                                <a-tag :color="getOperationTypeColor(api.operationType)"
                                                       style="margin: 0">
                                                    {{ getOperationTypeLabel(api.operationType) }}
                                                </a-tag>
                                            </div>

                                            <div class="cell action-cell">
                                                <a-button
                                                    type="link"
                                                    size="small"
                                                    @click="handleEditApi(api)"
                                                >
                                                    编辑
                                                </a-button>
                                            </div>
                                        </div>
                                    </a-collapse-panel>
                                </a-collapse>
                            </div>
                        </a-spin>
                    </div>
                </div>

                <!-- 编辑抽屉 -->
                <ApiEditDrawer
                    ref="editDrawerRef"
                    :api="currentEditApi"
                    :batch-mode="batchEditMode"
                    :selected-count="selectedApiIds.size"
                    @save="handleSaveEdit"
                    @close="handleCloseEdit"
                />
            </div>
        </a-card>
    </j-page-container>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, watch, nextTick} from 'vue'
import { useMenuStore } from '@jetlinks-web-core/store'
import apiManageApi from '../../../api/apiManage'
import ApiFilterNav from './components/ApiFilterNav.vue'
import ApiEditDrawer from './components/ApiEditDrawer.vue'
import type {ApiGovernanceAttrs, ListFilter} from './types'
import {onlyMessage} from '@jetlinks-web/utils'

const menuStore = useMenuStore()

// 虚拟滚动配置
const ITEM_HEIGHT = 80
const VISIBLE_COUNT = 10

const loading = ref(false)
const allApiData = ref<ApiGovernanceAttrs[]>([])
const selectedApiIds = ref<Set<string>>(new Set())
const currentFilters = reactive<ListFilter>({})
const batchEditMode = ref(false)
const currentEditApi = ref<ApiGovernanceAttrs>()

const editDrawerRef = ref()
const listBodyRef = ref()
const scrollTop = ref(0)

// 过滤后的数据
const filteredApiData = computed(() => {
    let result = allApiData.value

    // 关键字搜索
    if (currentFilters.keyword) {
        const keyword = currentFilters.keyword.toLowerCase()
        result = result.filter(api =>
            api.path?.toLowerCase().includes(keyword) ||
            api.description?.toLowerCase().includes(keyword)
        )
    }

    // 推荐状态过滤
    if (currentFilters.recommended !== undefined) {
        result = result.filter(api => api.recommended === currentFilters.recommended)
    }

    // 风险等级过滤
    if (currentFilters.riskLevel && currentFilters.riskLevel.length > 0) {
        result = result.filter(api => currentFilters.riskLevel!.includes(api.riskLevel))
    }

    // 操作类型过滤
    if (currentFilters.operationType && currentFilters.operationType.length > 0) {
        result = result.filter(api =>
            currentFilters.operationType!.includes(api.operationType)
        )
    }

    // 可见性过滤
    if (currentFilters.visibility && currentFilters.visibility.length > 0) {
        result = result.filter(api =>
            currentFilters.visibility!.includes(api.visibility as any || 'INTERNAL')
        )
    }

    // 能力分组过滤
    if (currentFilters.group) {
        result = result.filter(api => api.group === currentFilters.group)
    }

    return result
})

// 手风琴数据（按分组）
const groupedApiData = computed(() => {
    const groupMap = new Map<string, ApiGovernanceAttrs[]>()

    // 按分组分类 API
    filteredApiData.value.forEach(api => {
        const group = api.group || '未分组'
        if (!groupMap.has(group)) {
            groupMap.set(group, [])
        }
        groupMap.get(group)!.push(api)
    })

    // 构建分组数据
    return Array.from(groupMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, apis]) => ({
            name,
            apis,
            selectedCount: apis.filter(api => selectedApiIds.value.has(api.id)).length,
        }))
})

// 颜色和标签辅助函数
const getMethodColor = (method: string) => {
    const colorMap: Record<string, string> = {
        GET: 'green',
        POST: 'blue',
        PUT: 'orange',
        DELETE: 'red',
        PATCH: 'purple',
    }
    return colorMap[method] || 'default'
}

const getRiskColor = (level?: string) => {
    const colorMap: Record<string, string> = {
        low: 'green',
        medium: 'orange',
        high: 'red',
    }
    return colorMap[level || 'low'] || 'default'
}

const getRiskLabel = (level?: string) => {
    const labelMap: Record<string, string> = {
        low: '低风险',
        medium: '中风险',
        high: '高风险',
    }
    return labelMap[level || 'low'] || '低风险'
}

const getOperationTypeColor = (type?: string) => {
    const colorMap: Record<string, string> = {
        read: 'blue',
        write: 'orange',
        control: 'red',
    }
    return colorMap[type || 'read'] || 'default'
}

const getOperationTypeLabel = (type?: string) => {
    const labelMap: Record<string, string> = {
        read: '只读',
        write: '写',
        control: '控制',
    }
    return labelMap[type || 'read'] || '只读'
}

const getScopeColor = (scope?: string) => {
    const colorMap: Record<string, string> = {
        INTERNAL: '#8c8c8c',
        PARTNER: '#faad14',
        PUBLIC: '#1890ff',
    }
    return colorMap[scope || 'INTERNAL'] || '#8c8c8c'
}

const getScopeLabel = (scope?: string) => {
    const labelMap: Record<string, string> = {
        INTERNAL: '仅内部可见',
        PARTNER: '用户可见',
        PUBLIC: '公开',
    }
    return labelMap[scope || 'INTERNAL'] || '仅内部可见'
}

const getVisibilityColor = (visibility?: string) => {
    return getScopeColor(visibility)
}

const getVisibilityLabel = (visibility?: string) => {
    return getScopeLabel(visibility)
}

// 加载数据
const loadData = async () => {
    loading.value = true
    try {
        const resp = await apiManageApi.query({})
        if (resp.success) {
            const data = (resp.result?.data || resp.result || []).map((item: any) => {
                // 提取 riskLevel 的值（处理对象和字符串两种格式）
                const riskLevel = typeof item.riskLevel === 'object'
                    ? (item.riskLevel?.value || 'low')
                    : (item.riskLevel || 'low')

                // 提取 operationType 的值（处理对象和字符串两种格式）
                const operationType = typeof item.operationType === 'object'
                    ? (item.operationType?.value || 'read')
                    : (item.operationType || 'read')

                // 提取 visibility 的值（处理对象和字符串两种格式）
                const visibility = typeof item.visibility === 'object'
                    ? (item.visibility?.value || 'INTERNAL')
                    : (item.visibility || 'INTERNAL')

                return {
                    id: item.id,
                    path: item.path,
                    method: item.method,
                    description: item.summary || item.description,
                    group: item.group || '未分组',
                    recommended: item.recommended || false,
                    riskLevel: riskLevel as 'low' | 'medium' | 'high',
                    operationType: operationType as 'read' | 'write' | 'control',
                    permissionCount: item.permissionCount || 0,
                    visibility: visibility as 'INTERNAL' | 'PARTNER' | 'PUBLIC',
                    impactScope: item.impactScope || [],
                }
            })
            allApiData.value = data
        }
    } catch (error) {
        console.error('加载 API 列表失败:', error)
        onlyMessage('加载数据失败', 'error')
    } finally {
        loading.value = false
    }
}

// 事件处理
const handleFilterChange = (filters: ListFilter) => {
    Object.assign(currentFilters, filters)
    scrollTop.value = 0
}

const handleListScroll = (e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
}

const handleSelectAll = (e: any) => {
    if (e.target.checked) {
        filteredApiData.value.forEach(api => {
            selectedApiIds.value.add(api.id)
        })
    } else {
        selectedApiIds.value.clear()
    }
}

const handleGroupSelectAll = (group: any, e: any) => {
    if (e.target.checked) {
        group.apis.forEach((api: ApiGovernanceAttrs) => {
            selectedApiIds.value.add(api.id)
        })
    } else {
        group.apis.forEach((api: ApiGovernanceAttrs) => {
            selectedApiIds.value.delete(api.id)
        })
    }
}

const handleToggleSelect = (apiId: string) => {
    if (selectedApiIds.value.has(apiId)) {
        selectedApiIds.value.delete(apiId)
    } else {
        selectedApiIds.value.add(apiId)
    }
}

const handleClearSelection = () => {
    selectedApiIds.value.clear()
}

const handleEditApi = (api: ApiGovernanceAttrs) => {
    // 导航到API详情编辑页
    menuStore.jumpPage('system/api-manage/Detail', {
        params: {
            id: api.id
        }
    })
}

const handleBatchEdit = () => {
    batchEditMode.value = true
    editDrawerRef.value?.open(undefined, true)
}

const handleCloseEdit = () => {
    currentEditApi.value = undefined
    batchEditMode.value = false
}

const handleSaveEdit = async (payload: any) => {
    loading.value = true
    try {
        if (payload.batchMode) {
            // 批量编辑
            const apiIds = Array.from(selectedApiIds.value)
            const updates: Record<string, any> = {}
            payload.selectedFields?.forEach((field: string) => {
                updates[field] = payload.data[field]
            })
            await apiManageApi.batchUpdate({
                ids: apiIds,
                fields: updates,
            })
            selectedApiIds.value.clear()
        } else {
            // 单个编辑
            await apiManageApi.update(payload.apiId, payload.data)
        }
        onlyMessage('保存成功')
        await loadData()
    } catch (error) {
        console.error('保存失败:', error)
        onlyMessage('保存失败', 'error')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadData()
})
</script>

<style lang="less" scoped>
.api-manage-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f5;

    .content-wrapper {
        flex: 1;
        display: flex;
        overflow: hidden;
        min-height: 0;

        .left-panel {
            width: 240px;
            border-right: 1px solid #e8e8e8;
            overflow-y: auto;
            flex-shrink: 0;
            background: #fff;
        }

        .middle-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 16px;
            background: #fff;

            .empty-state {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                padding: 20px;
            }

            .api-collapse-wrapper {
                display: flex;
                flex-direction: column;
                gap: 8px;

                :deep(.ant-collapse) {
                    background: #fff;
                    border: 1px solid #e8e8e8;
                    border-radius: 4px;
                    margin-bottom: 0 !important;

                    &:last-child {
                        margin-bottom: 0 !important;
                    }

                    .ant-collapse-header {
                        padding: 14px 16px !important;
                        font-weight: 500 !important;
                        font-size: 14px !important;
                        background: #fafafa !important;
                    }

                    .ant-collapse-content {
                        background: #fff;
                        border-top: 1px solid #e8e8e8 !important;
                    }

                    .ant-collapse-content-box {
                        padding: 0 !important;
                    }
                }

                .list-header {
                    display: grid;
                    grid-template-columns: 40px 1fr 90px 70px 70px 80px;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e8e8e8;
                    background: #fafafa;
                    font-weight: 600;
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.65);
                    gap: 0;
                    align-items: center;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;

                    .header-cell {
                        display: flex;
                        align-items: center;
                        overflow: hidden;

                        &.checkbox-cell {
                            justify-content: center;
                        }

                        &.path-cell {
                            min-width: 0;
                        }

                        &.visibility-cell,
                        &.risk-cell,
                        &.type-cell {
                            justify-content: center;
                        }
                    }
                }

                .list-row {
                    display: grid;
                    grid-template-columns: 40px 1fr 90px 70px 70px 80px;
                    padding: 14px 16px;
                    border-bottom: 1px solid #f0f0f0;
                    gap: 0;
                    align-items: flex-start;
                    transition: background-color 0.2s;

                    &:hover {
                        background: #fafafa;
                    }

                    &.selected {
                        background: #e6f7ff;
                    }

                    &:last-child {
                        border-bottom: none;
                    }

                    .cell {
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                        min-width: 0;

                        &.checkbox-cell {
                            justify-content: center;
                        }

                        &.path-cell {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 6px;

                            .path-info {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                width: 100%;
                                min-width: 0;

                                :deep(.ant-tag) {
                                    margin: 0 !important;
                                    flex-shrink: 0;
                                }

                                .path-text {
                                    font-size: 13px;
                                    color: #262626;
                                    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    min-width: 0;
                                }
                            }

                            .desc-text {
                                font-size: 12px;
                                color: #8c8c8c;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                width: 100%;
                            }
                        }

                        &.visibility-cell,
                        &.risk-cell,
                        &.type-cell {
                            justify-content: center;

                            :deep(.ant-tag) {
                                margin: 0 !important;
                            }
                        }

                        &.action-cell {
                            justify-content: center;

                            :deep(.ant-button) {
                                color: #1890ff !important;
                                padding: 0 4px !important;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
