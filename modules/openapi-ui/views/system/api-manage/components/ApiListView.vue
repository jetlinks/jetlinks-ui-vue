<template>
    <div :class="containerClass">
        <!-- 主内容区：左导航 + 中列表 -->
        <div class="content-wrapper">
            <!-- 左侧：过滤导航 -->
            <div class="left-panel">
                <ApiFilterNav
                    :all-data="allApiData"
                    :filtered-data="filteredApiData"
                    :current-filters="currentFilters"
                    @filter-change="handleFilterChange"
                />
            </div>

            <!-- 中间：API 列表 -->
            <div :class="containerClass === 'granted-api-list-container' ? 'right-panel' : 'middle-panel'">
                <a-card :spinning="loading" style="width: 100%">
                <!-- 开关按钮：隐藏未勾选的接口 -->
                <div v-if="showCheckbox && groupedApiData.length > 0" class="filter-toggle-bar">
                    <a-switch
                        v-model:checked="hideUncheckedApis"
                    />
                    <span class="toggle-label">隐藏未勾选的接口</span>
                </div>
                
                <div v-if="groupedApiData.length === 0" class="empty-state">
                    <a-empty :description="emptyText"/>
                </div>

                <!-- 手风琴列表 -->
                <a-collapse v-for="group in groupedApiData" :key="group.name">
                    <a-collapse-panel>
                        <template #header>
                            <span>{{ group.name }}</span>
                            <a-tag
                                :color="showSelectedCount && group.selectedCount > 0 ? 'success' : 'default'"
                                style="margin-left: 8px;"
                            >
                                <template v-if="showSelectedCount">
                                    {{ group.selectedCount }}/{{ group.apis.length }}
                                </template>
                                <template v-else>
                                    {{ group.apis.length }}
                                </template>
                            </a-tag>
                        </template>
                        <a-table
                            :columns="finalColumns"
                            :data-source="group.apis"
                            :pagination="false"
                            :row-key="(record) => record.id"
                            :row-selection="showCheckbox ? {
                                selectedRowKeys: group.apis.filter(api => selectedApiIds.has(api.id)).map(api => api.id),
                                onChange: (selectedRowKeys) => handleGroupSelection(group, selectedRowKeys as string[])
                            } : undefined"
                            size="small"
                        >
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'path'">
                                    <div class="path-info">
                                        <a-tag :color="getMethodColor(record.method)" style="margin: 0">
                                            {{ record.method }}
                                        </a-tag>
                                        <code class="path-text">{{ record.path }}</code>
                                    </div>
                                    <div v-if="record.summary" class="desc-text">
                                        {{ record.summary }}
                                    </div>
                                </template>
                                <template v-else-if="column.key === 'visibility'">
                                    <a-tag :color="getVisibilityColor(record.visibility?.value || record.visibility)"
                                           style="margin: 0">
                                        {{ record.visibility?.text || '未知' }}
                                    </a-tag>
                                </template>
                                <template v-else-if="column.key === 'riskLevel'">
                                    <a-tag :color="getRiskColor(record.riskLevel?.value || record.riskLevel)"
                                           style="margin: 0">
                                        <template v-if="(record.riskLevel?.value || record.riskLevel) === 'high'">
                                            <AIcon type="ExclamationCircleOutlined"/>
                                        </template>
                                        {{ record.riskLevel?.text || getRiskLabel(record.riskLevel) }}
                                    </a-tag>
                                </template>
                                <template v-else-if="column.key === 'stable'">
                                    <a-tag
                                        v-if="record.stable"
                                        :color="getStabilityColor(record.stable?.value || record.stable)"
                                    >
                                        {{ record.stable?.text || '未知' }}
                                    </a-tag>
                                    <span v-else>-</span>
                                </template>
                                <template v-else-if="column.key === 'operationType'">
                                    <a-tag :color="getOperationTypeColor(record.operationType?.value || record.operationType)" style="margin: 0">
                                        {{ record.operationType?.text || getOperationTypeLabel(record.operationType?.value || record.operationType) }}
                                    </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                    <slot name="action" :record="record">
                                        <a-button
                                            v-if="readonly"
                                            type="link"
                                            size="small"
                                            @click="$emit('view', record)"
                                        >
                                            查看详情
                                        </a-button>
                                        <a-button
                                            v-else
                                            type="link"
                                            size="small"
                                            @click="$emit('edit', record)"
                                        >
                                            编辑
                                        </a-button>
                                    </slot>
                                </template>
                            </template>
                        </a-table>
                    </a-collapse-panel>
                </a-collapse>
            </a-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from 'vue'
import apiManageApi from '../../../../api/apiManage'
import ApiFilterNav from './ApiFilterNav.vue'

interface Props {
    readonly?: boolean
    showCheckbox?: boolean
    defaultTerms?: any[] // 默认查询条件
    columns?: any[] // 自定义列配置
    dataLoader?: () => Promise<any> // 自定义数据加载函数
    emptyText?: string // 空状态文本
    containerClass?: string // 容器类名
    showSelectedCount?: boolean // 是否在手风琴header显示选中数量
}

const props = withDefaults(defineProps<Props>(), {
    readonly: false,
    showCheckbox: true,
    defaultTerms: () => [],
    columns: undefined,
    dataLoader: undefined,
    emptyText: '暂无数据',
    containerClass: 'api-manage-container',
    showSelectedCount: true,
})

defineEmits(['edit', 'view'])

// 默认表格列定义
const defaultColumns = [
    {
        title: '路径',
        key: 'path',
        dataIndex: 'path',
        width: '62%',
    },
    {
        title: '风险',
        key: 'riskLevel',
        dataIndex: 'riskLevel',
        width: '10%',
    },
    {
        title: '可见性',
        key: 'visibility',
        dataIndex: 'visibility',
        width: '10%',
    },
    {
        title: '稳定性',
        key: 'stable',
        dataIndex: 'stable',
        width: '10%',
    },
    {
        title: '操作',
        key: 'action',
        width: '8%',
    },
]

// 最终使用的列配置
const finalColumns = computed(() => props.columns || defaultColumns)

const loading = ref(false)
const allApiData = ref<any[]>([])
const selectedApiIds = ref<Set<string>>(new Set())
const currentFilters = reactive<any>({})
const hideUncheckedApis = ref(false) // 默认关闭（false=不隐藏，显示所有接口；true=隐藏未勾选的接口）

// 辅助函数：提取字段值（支持对象和字符串格式）
const getFieldValue = (item: any, field: string): string | undefined => {
    if (!item) return undefined
    const fieldValue = item[field]
    if (fieldValue === null || fieldValue === undefined) return undefined
    
    // 如果是对象格式 {value: 'xxx', text: 'xxx'}，返回 value
    if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
        // 优先使用 value 属性（枚举对象通常有这个属性）
        if (fieldValue.value !== undefined && fieldValue.value !== null) {
            return String(fieldValue.value)
        }
        // 如果对象有 getValue 方法，调用它（I18nEnumDict接口）
        if (typeof fieldValue.getValue === 'function') {
            try {
                const val = fieldValue.getValue()
                if (val !== undefined && val !== null) {
                    return String(val)
                }
            } catch (e) {
                // 忽略错误
            }
        }
        // 如果没有 value，尝试使用 name 属性（枚举的 name 属性，不是方法）
        if (fieldValue.name !== undefined && fieldValue.name !== null && typeof fieldValue.name !== 'function') {
            return String(fieldValue.name)
        }
        // 如果对象有 name() 方法，调用它（枚举的 name() 方法）
        if (typeof fieldValue.name === 'function') {
            try {
                const val = fieldValue.name()
                if (val !== undefined && val !== null) {
                    return String(val)
                }
            } catch (e) {
                // 忽略错误
            }
        }
        return undefined
    }
    // 如果是字符串，直接返回
    if (typeof fieldValue === 'string') {
        return fieldValue
    }
    // 如果是数字，转换为字符串
    if (typeof fieldValue === 'number') {
        return String(fieldValue)
    }
    return undefined
}

// 过滤后的数据
const filteredApiData = computed(() => {
    let result = [...allApiData.value] // 创建副本，确保响应式

    // 关键字搜索
    if (currentFilters.keyword) {
        const keyword = currentFilters.keyword.toLowerCase()
        result = result.filter(api =>
            api.path?.toLowerCase().includes(keyword) ||
            api.description?.toLowerCase().includes(keyword) ||
            api.summary?.toLowerCase().includes(keyword)
        )
    }

    // 推荐状态
    if (currentFilters.recommended !== undefined) {
        result = result.filter(api => api.recommended === currentFilters.recommended)
    }

    // 风险等级过滤
    if (currentFilters.riskLevel && currentFilters.riskLevel.length > 0) {
        result = result.filter(api => {
            const apiRiskLevel = getFieldValue(api, 'riskLevel')
            if (!apiRiskLevel) return false
            return currentFilters.riskLevel.some((rl: any) => 
                String(apiRiskLevel).toLowerCase() === String(rl).toLowerCase()
            )
        })
    }

    // 操作类型过滤
    if (currentFilters.operationType && currentFilters.operationType.length > 0) {
        result = result.filter(api => {
            const apiOperationType = getFieldValue(api, 'operationType')
            if (!apiOperationType) return false
            return currentFilters.operationType.some((ot: any) => 
                String(apiOperationType).toLowerCase() === String(ot).toLowerCase()
            )
        })
    }

    // 可见性过滤
    if (currentFilters.visibility && currentFilters.visibility.length > 0) {
        result = result.filter(api => {
            const apiVisibility = getFieldValue(api, 'visibility') || 'internal'
            const defaultVisibility = apiVisibility.toLowerCase()
            return currentFilters.visibility.some((v: any) => 
                String(v).toLowerCase() === defaultVisibility
            )
        })
    }

    // 能力分组过滤
    if (currentFilters.group) {
        result = result.filter(api => api.group === currentFilters.group)
    }

    // 稳定性过滤（注意：稳定性是独立字段，与可见性不同）
    if (currentFilters.stable && currentFilters.stable.length > 0) {
        result = result.filter(api => {
            const apiStable = getFieldValue(api, 'stable')
            if (!apiStable) return false
            return currentFilters.stable.some((s: any) => 
                String(apiStable).toLowerCase() === String(s).toLowerCase()
            )
        })
    }

    // 业务能力过滤
    if (currentFilters.businessGroup && currentFilters.businessGroup.length > 0) {
        result = result.filter(api => {
            const businessGroups = api.businessGroup
            if (!businessGroups || !Array.isArray(businessGroups)) {
                return false
            }
            return currentFilters.businessGroup.some((bg: string) => 
                businessGroups.some((apiBg: string) => String(apiBg).toLowerCase() === String(bg).toLowerCase())
            )
        })
    }

    // 影响范围过滤
    if (currentFilters.impactScope && currentFilters.impactScope.length > 0) {
        result = result.filter(api => {
            const impactScopes = api.impactScope
            if (!impactScopes || !Array.isArray(impactScopes)) {
                return false
            }
            return currentFilters.impactScope.some((scope: string) => 
                impactScopes.some((apiScope: string) => String(apiScope).toLowerCase() === String(scope).toLowerCase())
            )
        })
    }

    return result
})

// 手风琴数据（按分组）
const groupedApiData = computed(() => {
    const groupMap = new Map<string, any[]>()

    // 根据开关状态过滤数据
    let dataToGroup = filteredApiData.value
    if (props.showCheckbox && hideUncheckedApis.value) {
        // 隐藏未勾选的接口，只显示已勾选的接口
        dataToGroup = filteredApiData.value.filter(api => selectedApiIds.value.has(api.id))
    }

    dataToGroup.forEach(api => {
        const group = api.group || '未分组'
        if (!groupMap.has(group)) {
            groupMap.set(group, [])
        }
        groupMap.get(group)!.push(api)
    })

    return Array.from(groupMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, apis]) => ({
            name,
            apis,
            selectedCount: apis.filter(api => selectedApiIds.value.has(api.id)).length,
        }))
})

const handleFilterChange = (filters: any) => {
    Object.assign(currentFilters, filters)
}

const handleGroupSelection = (group: any, selectedRowKeys: string[]) => {
    // 清除该组的所有选中状态
    group.apis.forEach((api: any) => {
        selectedApiIds.value.delete(api.id)
    })
    // 添加新选中的项
    selectedRowKeys.forEach((id: string) => {
        selectedApiIds.value.add(id)
    })
}

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

const getVisibilityColor = (visibility: string) => {
    const colorMap: Record<string, string> = {
        OPEN: 'success',
        PUBLIC: 'success',
        PARTNER: 'warning',
        PRIVATE: 'warning',
        INTERNAL: 'default',
    }
    return colorMap[visibility?.toUpperCase()] || 'default'
}

const getRiskColor = (riskLevel: string) => {
    const colorMap: Record<string, string> = {
        low: 'success',
        medium: 'warning',
        high: 'error',
    }
    return colorMap[riskLevel] || 'default'
}

const getRiskLabel = (riskLevel: string) => {
    const labelMap: Record<string, string> = {
        low: '低风险',
        medium: '中风险',
        high: '高风险',
    }
    return labelMap[riskLevel] || '未知'
}

const getStabilityColor = (stability: string) => {
    const colorMap: Record<string, string> = {
        stable: 'success',
        preview: 'warning',
        deprecated: 'error',
    }
    return colorMap[stability] || 'default'
}

const getOperationTypeColor = (operationType: string) => {
    const colorMap: Record<string, string> = {
        read: 'blue',
        write: 'orange',
        control: 'red',
    }
    return colorMap[operationType] || 'default'
}

const getOperationTypeLabel = (operationType: string) => {
    const labelMap: Record<string, string> = {
        read: '只读',
        write: '写入',
        control: '控制',
    }
    return labelMap[operationType] || '未知'
}

const loadApiList = async () => {
    try {
        loading.value = true
        if (props.dataLoader) {
            // 使用自定义数据加载器
            const result = await props.dataLoader()
            allApiData.value = result || []
        } else {
            // 使用默认数据加载器
            const resp = await apiManageApi.query({terms: props.defaultTerms || []})
            if (resp.success && resp.result) {
                allApiData.value = resp.result
            }
        }
    } catch (error) {
        console.error('加载 API 列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 获取选中的 API 列表
const getSelectedApis = () => {
    const selectedIds = Array.from(selectedApiIds.value)
    return allApiData.value.filter(api => selectedIds.includes(api.id))
}

// 设置选中的 API 列表（通过 ID 数组）
const setSelectedApiIds = (ids: string[]) => {
    selectedApiIds.value.clear()
    ids.forEach(id => {
        selectedApiIds.value.add(id)
    })
}

// 暴露方法供外部调用
defineExpose({
    getSelectedApis,
    setSelectedApiIds
})

onMounted(() => {
    loadApiList()
})
</script>

<style lang="less" scoped>
.api-manage-container,
.granted-api-list-container {
    display: flex;
    flex-direction: column;
    min-height: 600px;
    background: #f5f5f5;

    .content-wrapper {
        flex: 1;
        display: flex;
        overflow: hidden;
        min-height: 600px;

        .left-panel {
            width: 240px;
            overflow-y: auto;
            flex-shrink: 0;
            background: #fff;
        }

        .middle-panel,
        .right-panel {
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
        }
    }
}

.granted-api-list-container {
    margin-bottom: 0;
    
    .content-wrapper {
        .left-panel {
            border-right: 1px solid #e8e8e8;
        }
        
        .right-panel {
            border-right: none;
        }
    }
}

.path-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    min-width: 0;
    width: 100%;

    :deep(.ant-tag) {
        font-size: 10px;
    }

    .path-text {
        font-family: 'Courier New', monospace;
        font-size: 14px;
        color: #1890ff;
        padding: 2px 6px;
        border-radius: 3px;
        word-break: break-all;
        overflow-wrap: break-word;
        min-width: 0;
        flex: 1;
    }
}

.desc-text {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 4px;
}

// 只移除 ApiListView 组件内的 card 边框和 padding
.api-manage-container,
.granted-api-list-container {
    :deep(.ant-card) {
        border: none !important;
    }
    
    :deep(.ant-card-body) {
        padding: 0 !important;
    }
}

:deep(.ant-collapse .ant-collapse-content > .ant-collapse-content-box) {
    padding: 0 !important;
}

:deep(.ant-table-cell) {
    overflow: hidden;
    word-break: break-word;
    
    .ant-tag {
        font-size: 10px;
    }
}

:deep(.ant-table-tbody > tr > td) {
    max-width: 0;
}

.filter-toggle-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
    
    .toggle-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        display: flex;
        align-items: center;
    }
    
    :deep(.ant-switch) {
        flex-shrink: 0;
    }
}
</style>
