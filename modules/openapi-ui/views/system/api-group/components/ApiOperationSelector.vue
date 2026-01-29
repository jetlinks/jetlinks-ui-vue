<template>
    <a-card>
        <div class="search-panel">
            <a-row :gutter="12">
                <a-col :flex="1" style="min-width: 0">
                    <a-input-search
                        v-model:value="filters.keyword"
                        placeholder="搜索路径或描述"
                        allow-clear
                        @search="handleFilterChange"
                        enter-button
                    />
                </a-col>
                <a-col :span="6">
                    <a-select
                        v-model:value="filters.operationType"
                        placeholder="操作类型"
                        allow-clear
                        style="width: 100%"
                        @change="handleFilterChange"
                    >
                        <a-select-option value="read">只读</a-select-option>
                        <a-select-option value="write">写</a-select-option>
                        <a-select-option value="control">控制</a-select-option>
                    </a-select>
                </a-col>
                <a-col :span="6">
                    <a-select
                        v-model:value="filters.riskLevel"
                        placeholder="风险等级"
                        allow-clear
                        style="width: 100%"
                        @change="handleFilterChange"
                    >
                        <a-select-option value="low">低风险</a-select-option>
                        <a-select-option value="medium">中风险</a-select-option>
                        <a-select-option value="high">高风险</a-select-option>
                    </a-select>
                </a-col>
            </a-row>
        </div>
        <!-- 手风琴区域 -->
        <a-spin :spinning="loading">
            <div v-if="groupedApiData.length === 0" class="empty-state">
                <a-empty description="暂无数据"/>
            </div>
            <a-collapse
                v-else
                v-model:activeKey="expandedGroups"
                class="api-collapse"
            >
                <a-collapse-panel
                    v-for="groupData in groupedApiData"
                    :key="groupData.group"
                >
                    <template #header>
                        <div class="panel-header-content">
                            <span class="group-name">{{ groupData.group }}</span>
                            <a-badge
                                :count="`${getGroupSelectedCount(groupData.group)}/${groupData.apis.length}`"
                                :number-style="{ backgroundColor: getGroupSelectedCount(groupData.group) > 0 ? '#52c41a' : '#d9d9d9', fontSize: '12px' }"
                                style="margin-left: 8px"
                            />
                        </div>
                    </template>
                    <template #extra>
                        <a-button
                            type="link"
                            size="small"
                            @click.stop="handleGroupSelectAll(groupData.group, groupData.apis)"
                        >
                            全选
                        </a-button>
                    </template>

                    <div class="api-cards-grid">
                        <div
                            v-for="api in groupData.apis"
                            :key="api.key || api.id || `${api.path}_${api.method}`"
                            :class="['api-card', { 'selected': isSelected(api.key || api.id || `${api.path}_${api.method}`) }]"
                            @click="toggleSelect(api)"
                        >
                            <div class="api-card-header">
                                <a-checkbox
                                    :checked="isSelected(api.key || api.id || `${api.path}_${api.method}`)"
                                    @click.stop="toggleSelect(api)"
                                />
                                <a-tag :color="getMethodColor(api.method || 'GET')" class="method-tag">
                                    {{ api.method }}
                                </a-tag>
                                <span class="api-path">{{ api.path }}</span>
                            </div>
                            <div class="api-card-body">
                                <div class="api-description">
                                    {{ api.description || '暂无描述' }}
                                </div>
                                <div class="api-meta">
                                    <a-tag :color="getOperationTypeColor(api.operationType || 'read')"
                                           size="small">
                                        {{ getOperationTypeLabel(api.operationType || 'read') }}
                                    </a-tag>
                                    <a-tag :color="getRiskLevelColor(api.riskLevel || 'low')" size="small">
                                        <template v-if="api.riskLevel === 'high'">
                                            <AIcon type="ExclamationCircleOutlined"/>
                                        </template>
                                        {{ getRiskLevelLabel(api.riskLevel || 'low') }}
                                    </a-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </a-spin>
    </a-card>
</template>

<script setup lang="ts">
import type {ApiOperationInfo} from '../types'
import apiGroupApi from '../../../../api/apiGroup'
import {useI18n} from 'vue-i18n'

interface Props {
    value?: ApiOperationInfo[]
    showSummary?: boolean
    enableTreeNav?: boolean
}

interface Emits {
    (e: 'update', data: ApiOperationInfo[]): void
}

const props = withDefaults(defineProps<Props>(), {
    value: () => [],
    showSummary: true,
    enableTreeNav: false,
})

const emit = defineEmits<Emits>()

const {t: $t} = useI18n()
const loading = ref(false)
const allData = ref<ApiOperationInfo[]>([])
const selectedKeys = ref<Set<string>>(new Set())
const expandedGroups = ref<string[]>([])
const selectedGroup = ref<string>('')
const groupedData = ref<Map<string, ApiOperationInfo[]>>(new Map())

const filters = reactive({
    groups: [] as string[],
    operationType: undefined as 'read' | 'write' | 'control' | undefined,
    riskLevel: undefined as 'low' | 'medium' | 'high' | undefined,
    selectedStatus: undefined as 'selected' | 'unselected' | undefined,
    keyword: '',
})

// 获取所有分组选项
computed(() => {
    return Array.from(groupedData.value.keys()).map(group => ({label: group, value: group}))
});


// 手风琴项数据 - 直接使用后端返回的分组数据
const groupedApiData = computed(() => {
    // 根据过滤条件对数据进行过滤
    const filteredMap = new Map<string, ApiOperationInfo[]>()

    groupedData.value.forEach((apis, group) => {
        let filteredApis = apis

        // 操作类型筛选
        if (filters.operationType) {
            filteredApis = filteredApis.filter(item => item.operationType === filters.operationType)
        }

        // 风险等级筛选
        if (filters.riskLevel) {
            filteredApis = filteredApis.filter(item => item.riskLevel === filters.riskLevel)
        }

        // 关键字搜索
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase()
            filteredApis = filteredApis.filter(item =>
                item.path?.toLowerCase().includes(keyword) ||
                item.description?.toLowerCase().includes(keyword)
            )
        }

        // 只保留有数据的分组
        if (filteredApis.length > 0) {
            filteredMap.set(group, filteredApis)
        }
    })

    // 返回排序后的分组数据
    return Array.from(filteredMap.entries())
        .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
        .map(([group, apis]) => ({
            group,
            apis: apis as ApiOperationInfo[],
        }))
})

// 判断是否选中
const isSelected = (key: string) => {
    return selectedKeys.value.has(key)
}

// 获取分组中已选中的数量
const getGroupSelectedCount = (group: string) => {
    const groupApis = groupedData.value.get(group) || []
    return groupApis.filter(api => {
        const key = api.key || api.id || `${api.path}_${api.method}`
        return selectedKeys.value.has(key)
    }).length
}

// 切换选择状态
const toggleSelect = (api: ApiOperationInfo) => {
    const key = api.key || api.id || `${api.path}_${api.method}`
    if (selectedKeys.value.has(key)) {
        selectedKeys.value.delete(key)
    } else {
        selectedKeys.value.add(key)
    }
    updateOperations()
}

// 分组全选
const handleGroupSelectAll = (group?: string, apis?: ApiOperationInfo[]) => {
    const targetApis = apis || []
    const keys = targetApis.map(api => api.key || api.id || `${api.path}_${api.method}`).filter(Boolean) as string[]

    keys.forEach(key => {
        selectedKeys.value.add(key)
    })
    updateOperations()
}

// 筛选变化处理
const handleFilterChange = () => {
    // 自动展开匹配的分组
    if (filters.keyword || filters.operationType || filters.riskLevel) {
        const matchedGroups = new Set<string>()
        groupedApiData.value.forEach((group) => {
            if (group.apis.length > 0) {
                matchedGroups.add(group.group)
            }
        })
        expandedGroups.value = Array.from(matchedGroups)
    }
}

// 获取方法颜色
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

// 获取操作类型颜色
const getOperationTypeColor = (type?: string) => {
    const colorMap: Record<string, string> = {
        read: 'blue',
        write: 'orange',
        control: 'red',
    }
    return colorMap[type || 'read'] || 'default'
}

// 获取操作类型标签
const getOperationTypeLabel = (type?: string) => {
    const labelMap: Record<string, string> = {
        read: '只读',
        write: '写',
        control: '控制',
    }
    return labelMap[type || 'read'] || '只读'
}

// 获取风险等级颜色
const getRiskLevelColor = (level?: string) => {
    const colorMap: Record<string, string> = {
        low: 'green',
        medium: 'orange',
        high: 'red',
    }
    return colorMap[level || 'low'] || 'default'
}

// 获取风险等级标签
const getRiskLevelLabel = (level?: string) => {
    const labelMap: Record<string, string> = {
        low: '低风险',
        medium: '中风险',
        high: '高风险',
    }
    return labelMap[level || 'low'] || '低风险'
}

// 加载数据
const loadData = async () => {
    loading.value = true
    try {
        const params: any = {
            paging: false,
            // 添加group参数，让后端进行分组处理
            group: true,
        }

        const resp = await apiGroupApi.queryOperations(params)
        if (resp.success) {
            const data = (resp.result?.data || resp.result || [])

            // 如果后端返回的是已分组的数据
            if (Array.isArray(data) && data.length > 0) {
                const firstItem = data[0]

                // 检测是否是分组结构 {group: string, apis: Array}
                if (firstItem.group && Array.isArray(firstItem.apis)) {
                    // 后端返回了已分组的数据
                    const flattenedData: ApiOperationInfo[] = []
                    const newGroupedData = new Map<string, ApiOperationInfo[]>()

                    data.forEach((groupItem: any) => {
                        const groupName = groupItem.group || '未分组'
                        const apis = groupItem.apis || []

                        const processedApis = apis.map((item: any) => {
                            const riskLevel: 'low' | 'medium' | 'high' =
                                (typeof item.riskLevel === 'object' ? item.riskLevel.value : item.riskLevel) as 'low' | 'medium' | 'high' || 'low'

                            const operationType: 'read' | 'write' | 'control' =
                                (typeof item.operationType === 'object' ? item.operationType.value : item.operationType) as 'read' | 'write' | 'control' || 'read'

                            return {
                                id: item.id,
                                path: item.path || '',
                                method: item.method || 'GET',
                                description: item.summary || item.description,
                                tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
                                group: groupName,
                                riskLevel,
                                operationType,
                                impactScope: Array.isArray(item.impactScope) ? item.impactScope : (item.impactScope ? [item.impactScope] : []),
                                recommended: item.recommended || false,
                                key: item.id || `${item.path}_${item.method}`,
                            } as ApiOperationInfo
                        })

                        newGroupedData.set(groupName, processedApis)
                        flattenedData.push(...processedApis)
                    })

                    allData.value = flattenedData
                    groupedData.value = newGroupedData
                    // 默认全部折叠
                    expandedGroups.value = []
                } else {
                    // 后端返回的是扁平数据，直接使用group字段分组
                    const flatData = data.map((item: any) => {
                        const riskLevel: 'low' | 'medium' | 'high' =
                            (typeof item.riskLevel === 'object' ? item.riskLevel.value : item.riskLevel) as 'low' | 'medium' | 'high' || 'low'

                        const operationType: 'read' | 'write' | 'control' =
                            (typeof item.operationType === 'object' ? item.operationType.value : item.operationType) as 'read' | 'write' | 'control' || 'read'

                        return {
                            id: item.id,
                            path: item.path || '',
                            method: item.method || 'GET',
                            description: item.summary || item.description,
                            tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
                            group: item.group || '未分组',
                            riskLevel,
                            operationType,
                            impactScope: Array.isArray(item.impactScope) ? item.impactScope : (item.impactScope ? [item.impactScope] : []),
                            recommended: item.recommended || false,
                            key: item.id || `${item.path}_${item.method}`,
                        } as ApiOperationInfo
                    })

                    allData.value = flatData

                    // 前端进行分组
                    const groupMap = new Map<string, ApiOperationInfo[]>()
                    flatData.forEach((item: ApiOperationInfo) => {
                        const groupName = item.group || '未分组'
                        if (!groupMap.has(groupName)) {
                            groupMap.set(groupName, [])
                        }
                        groupMap.get(groupName)!.push(item)
                    })
                    groupedData.value = groupMap

                    // 默认全部折叠
                    expandedGroups.value = []
                }
            }

            // 设置默认选中第一个分组
            if (Array.from(groupedData.value.keys()).length > 0) {
                selectedGroup.value = Array.from(groupedData.value.keys())[0]
            }
        }
    } catch (error) {
        console.error('加载 API 操作列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 更新操作列表
const updateOperations = () => {
    const selectedOperations = allData.value.filter(item => {
        const key = item.key || item.id || `${item.path}_${item.method}`
        return selectedKeys.value.has(key)
    })
    emit('update', selectedOperations)
}

/**
 * 设置已选中的 API 操作
 */
const setSelectedOperations = (operations: ApiOperationInfo[]) => {
    const keys = new Set<string>()
    operations.forEach(op => {
        const key = op.key || op.id || `${op.path}_${op.method}`
        if (key) {
            keys.add(key)
        }
    })
    selectedKeys.value = keys
    updateOperations()
}

/**
 * 重新加载数据
 */
const reload = () => {
    loadData()
}

defineExpose({
    setSelectedOperations,
    reload,
})

// 监听传入的 value 变化
watch(
    () => props.value,
    (val) => {
        if (val && val.length > 0) {
            const keys = new Set<string>()
            val.forEach((item: ApiOperationInfo) => {
                const key = item.key || item.id || `${item.path}_${item.method}`
                if (key) {
                    keys.add(key)
                }
            })
            selectedKeys.value = keys
        } else {
            selectedKeys.value = new Set()
        }
    },
    {immediate: true, deep: true}
)

onMounted(() => {
    loadData()
})
</script>

<style lang="less" scoped>
.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
}

.search-panel {
   // 底部保持留白
}

.api-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;

    .api-card {
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        padding: 16px;
        background: #fafafa;
        cursor: pointer;
        transition: all 0.3s;
        min-height: 140px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;

        &:hover {
            border-color: #1890ff;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
            transform: translateY(-2px);
        }

        &.selected {
            background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
            border-color: #1890ff;
        }

        .api-card-header {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 12px;
            flex-shrink: 0;

            :deep(.ant-checkbox) {
                margin-top: 2px;
                flex-shrink: 0;
            }

            .method-tag {
                font-weight: 600;
                font-size: 12px;
                min-width: 60px;
                text-align: center;
                flex-shrink: 0;
            }

            .api-path {
                flex: 1;
                font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                font-size: 13px;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                min-width: 0;
            }
        }

        .api-card-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 0;

            .api-description {
                color: rgba(0, 0, 0, 0.55);
                font-size: 13px;
                margin-bottom: 12px;
                line-height: 1.6;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                flex: 0 1 auto;
                min-height: 0;
            }

            .api-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: auto;
                flex-shrink: 0;

                :deep(.ant-tag) {
                    margin: 0;
                }
            }
        }
    }
}

// 响应式布局
@media (max-width: 1400px) {
    .api-cards-grid {
        grid-template-columns: 1fr;
    }
}
</style>
