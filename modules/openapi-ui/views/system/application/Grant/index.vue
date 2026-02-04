<template>
    <j-page-container>
        <FullPage>
            <div class="department-container">
                <div class="left">
                    <div class="left-tree-contain">
                        <a-input
                            v-model:value="searchValue"
                            :placeholder="'搜索分组名称'"
                            allow-clear
                        >
                            <template #suffix>
                                <AIcon type="SearchOutlined" />
                            </template>
                        </a-input>
                        <div class="tree" ref="treeContainerRef">
                            <a-spin :spinning="loadingGroups">
                                <a-tree
                                    v-if="treeData.length > 0"
                                    :tree-data="treeData"
                                    :selected-keys="selectedKeys"
                                    :checked-keys="treeCheckedKeys"
                                    :field-names="{ key: 'id', title: 'name' }"
                                    :show-line="{ showLeafIcon: false }"
                                    :height="treeHeight"
                                    :virtual="true"
                                    block-node
                                    checkable
                                    :check-strictly="true"
                                    @select="onTreeSelect"
                                    @check="onTreeCheck"
                                >
                                    <template #title="{ name }">
                                        <j-ellipsis>{{ name }}</j-ellipsis>
                                    </template>
                                </a-tree>
                                <j-empty v-else description="暂无分组" />
                            </a-spin>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="right-scroll">
                        <a-spin :spinning="loadingApis">
                        <div v-if="!currentGroup" class="empty-wrap">
                            <a-empty description="请从左侧选择分组" />
                        </div>
                        <template v-else-if="groupedApiData.length === 0">
                            <a-empty description="该分组下暂无接口" />
                        </template>
                        <template v-else>
                            <a-tabs
                                v-model:activeKey="activeTabKey"
                                destroy-inactive-tab-pane
                            >
                                <a-tab-pane
                                    v-for="group in groupedApiData"
                                    :key="group.name"
                                    :tab="group.name"
                                >
                                <a-table
                                    :columns="tableColumns"
                                    :data-source="group.apis"
                                    :pagination="false"
                                    :row-key="(record) => record.id"
                                    :row-selection="{
                                        selectedRowKeys: group.apis.filter(api => selectedApiIds.has(api.id)).map(api => api.id),
                                        onChange: (selectedRowKeys) => handleApiSelection(group, selectedRowKeys)
                                    }"
                                    size="small"
                                >
                                    <template #bodyCell="{ column, record }">
                                        <template v-if="column.key === 'path'">
                                            <a-space>
                                                <a-tag :color="getMethodColor(record.method)">
                                                    {{ record.method }}
                                                </a-tag>
                                                <code>{{ record.path }}</code>
                                            </a-space>
                                            <div v-if="record.summary" style="font-size: 12px; color: rgba(0,0,0,0.45); margin-top: 4px;">
                                                {{ record.summary }}
                                            </div>
                                        </template>
                                    </template>
                                </a-table>
                                </a-tab-pane>
                            </a-tabs>
                        </template>
                        </a-spin>
                    </div>
                    <div class="right-footer">
                        <a-space>
                            <a-button @click="handleReset">重置</a-button>
                            <a-button @click="handleCancel">取消</a-button>
                            <a-button
                                type="primary"
                                :loading="saving"
                                @click="handleSave"
                            >
                                保存
                            </a-button>
                        </a-space>
                    </div>
                </div>
            </div>
        </FullPage>
    </j-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import { FullPage } from '@jetlinks-web-core/layout'
import apiGroupApi from '../../../../api/apiGroup'
import { onlyMessage } from '@jetlinks-web/utils'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 加载状态
const loadingGroups = ref(false)
const loadingApis = ref(false)
const saving = ref(false)

// 数据
const apiGroups = ref<any[]>([])
const currentGroup = ref<any>(null)
const allApiData = ref<any[]>([])

// 选中状态：树勾选 = 授权分组，树选中 = 当前查看
const selectedGroupIds = ref<string[]>([])
const selectedApiIds = ref<Set<string>>(new Set())
const selectedKeys = ref<string[]>([])

// 搜索
const searchValue = ref('')

// 右侧 Tab 当前 key
const activeTabKey = ref<string>('')

// 树容器高度（与 Department LeftTree 一致）
const treeContainerRef = ref<HTMLElement>()
const treeHeight = ref(400)

// 初始授权数据（用于重置）
const initialGrantData = ref<any>(null)

// 表格列定义
const tableColumns = [
    {
        title: '路径',
        key: 'path',
        dataIndex: 'path',
        width: '100%',
    },
]

// 按分组名称过滤后的树数据（平铺转单层树）
const treeData = computed(() => {
    const list = apiGroups.value
    const key = searchValue.value?.trim()
    const filtered = key
        ? list.filter((g) => (g.name || '').toLowerCase().includes(key.toLowerCase()))
        : list
    return filtered.map((g) => ({ id: g.id, name: g.name || '未命名' }))
})

// 获取分组下的所有接口ID
function getGroupApiIds(groupId: string): string[] {
    const group = apiGroups.value.find((g) => g.id === groupId)
    if (!group || !group.operations) {
        return []
    }
    const apiIds = new Set<string>()
    group.operations.forEach((op: any) => {
        // 优先从 apiDetail 获取接口ID
        if (op.apiDetail && Array.isArray(op.apiDetail)) {
            op.apiDetail.forEach((api: any) => {
                if (api.id) {
                    apiIds.add(api.id)
                }
            })
        }
        // 如果 apiDetail 不存在，从 apiSpecIds 获取
        if ((!op.apiDetail || op.apiDetail.length === 0) && op.apiSpecIds && Array.isArray(op.apiSpecIds)) {
            op.apiSpecIds.forEach((apiSpecId: string) => {
                if (apiSpecId) {
                    apiIds.add(apiSpecId)
                }
            })
        }
    })
    return Array.from(apiIds)
}

// 计算树的选中状态（支持半选中）
const treeCheckedKeys = computed(() => {
    // 如果分组数据还未加载，返回空对象
    if (!apiGroups.value || apiGroups.value.length === 0) {
        return { checked: [], halfChecked: [] }
    }
    
    const checked: string[] = []
    const halfChecked: string[] = []
    
    apiGroups.value.forEach((group) => {
        const groupApiIds = getGroupApiIds(group.id)
        
        if (groupApiIds.length === 0) {
            return
        }
        
        const selectedCount = groupApiIds.filter((apiId) => selectedApiIds.value.has(apiId)).length
        
        if (selectedCount === groupApiIds.length && groupApiIds.length > 0) {
            // 全部选中：只有当所有接口都被勾选时，才显示为全选中
            checked.push(group.id)
        } else if (selectedCount > 0) {
            // 部分选中：只要有接口被勾选（但不是全部），就显示为半选中
            halfChecked.push(group.id)
        }
    })
    
    // 确保返回正确的格式，Ant Design Vue Tree 组件需要 { checked: [], halfChecked: [] } 格式
    return {
        checked,
        halfChecked,
    }
})

// 按接口 group 聚合 API 数据
const groupedApiData = computed(() => {
    const groupMap = new Map<string, any[]>()
    allApiData.value.forEach((api) => {
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
            selectedCount: apis.filter((api) => selectedApiIds.value.has(api.id)).length,
        }))
})

// 当 groupedApiData 变化时，默认选中第一个 tab
watch(
    () => groupedApiData.value,
    (groups) => {
        if (groups.length > 0 && !groups.some((g) => g.name === activeTabKey.value)) {
            activeTabKey.value = groups[0].name
        }
    },
    { immediate: true }
)

function getMethodColor(method: string) {
    const colorMap: Record<string, string> = {
        GET: 'green',
        POST: 'blue',
        PUT: 'orange',
        DELETE: 'red',
        PATCH: 'purple',
    }
    return colorMap[method] || 'default'
}

// 计算树高度
function calculateTreeHeight() {
    if (treeContainerRef.value) {
        const h = treeContainerRef.value.clientHeight
        treeHeight.value = Math.max(200, h - 10)
    }
}

const resizeObserver = new ResizeObserver(() => {
    calculateTreeHeight()
})

// 加载 API 分组列表（包含完整的接口详情，无需再次调用detail接口）
async function loadApiGroups() {
    try {
        loadingGroups.value = true
        // 传递 specification=true 获取完整的接口详情（包括 apiDetail）
        const resp = await apiGroupApi.queryMyPermission({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
        }, true)
        if (resp.success && resp.result) {
            apiGroups.value = resp.result.data || resp.result
            // 分组加载完成后，再加载已授权数据（需要用到apiGroups数据）
            await loadGrantedData()
        }
    } catch (error) {
        console.error('加载分组列表失败:', error)
        onlyMessage('加载分组列表失败', 'error')
    } finally {
        loadingGroups.value = false
    }
}

// 加载分组下的 API 列表（直接从已加载的数据中获取，无需再次调用接口）
function loadGroupApis(groupId: string) {
    // 从已加载的分组数据中查找对应的分组
    const groupDetail = apiGroups.value.find((g) => g.id === groupId)
    if (!groupDetail) {
        allApiData.value = []
        return
    }
    
    const apis: any[] = []
    if (groupDetail.operations && Array.isArray(groupDetail.operations)) {
        groupDetail.operations.forEach((op: any) => {
            if (op.apiDetail && Array.isArray(op.apiDetail)) {
                op.apiDetail.forEach((api: any) => {
                    apis.push({
                        id: api.id, // 这是接口规格ID，应该与 op.apiSpecIds 中的值一致
                        path: api.path,
                        method: api.method,
                        summary: api.summary || api.description,
                        group: api.group || '未分组',
                    })
                })
            }
        })
    }
    allApiData.value = apis
}

// 树勾选事件处理（使用 @check 事件，支持半选中状态）
function onTreeCheck(checkedKeys: any, e: any) {
    // @check 事件返回的 checkedKeys 是对象格式 { checked: [], halfChecked: [] }
    const checkedGroupIds = checkedKeys?.checked ?? []
    
    // 获取当前基于 selectedApiIds 计算的实际选中状态
    const currentCheckedFromApiIds = new Set<string>()
    apiGroups.value.forEach((group) => {
        const groupApiIds = getGroupApiIds(group.id)
        if (groupApiIds.length > 0) {
            const selectedCount = groupApiIds.filter((apiId) => selectedApiIds.value.has(apiId)).length
            if (selectedCount === groupApiIds.length) {
                currentCheckedFromApiIds.add(group.id)
            }
        }
    })
    
    const previousChecked = new Set(currentCheckedFromApiIds)
    const currentChecked = new Set(checkedGroupIds)
    
    // 找出新增和移除的分组（只处理全选中的分组）
    const addedGroups = checkedGroupIds.filter((id) => !previousChecked.has(id))
    const removedGroups = Array.from(previousChecked).filter((id) => !currentChecked.has(id))
    
    // 直接响应用户操作：勾选分组时，立即勾选该分组下的所有接口
    addedGroups.forEach((groupId) => {
        const groupApiIds = getGroupApiIds(groupId)
        if (groupApiIds.length > 0) {
            groupApiIds.forEach((apiId) => {
                selectedApiIds.value.add(apiId)
            })
        }
    })
    
    // 直接响应用户操作：取消勾选分组时，立即取消勾选该分组下的所有接口
    removedGroups.forEach((groupId) => {
        const groupApiIds = getGroupApiIds(groupId)
        if (groupApiIds.length > 0) {
            groupApiIds.forEach((apiId) => {
                selectedApiIds.value.delete(apiId)
            })
        }
    })
    
    // 注意：不需要更新 selectedGroupIds，因为 treeCheckedKeys 计算属性会根据 selectedApiIds 自动计算
    // selectedGroupIds 会在保存时根据 treeCheckedKeys 的结果来更新
}

// 树节点选中（当前查看分组）
function onTreeSelect(keys: string[]) {
    if (keys.length) {
        selectedKeys.value = keys
        const group = apiGroups.value.find((g) => g.id === keys[0])
        currentGroup.value = group || null
        if (keys[0]) {
            loadGroupApis(keys[0])
        }
    }
}

// 处理 API 选择
function handleApiSelection(group: any, selectedRowKeys: string[]) {
    // 先清除该分组下所有接口的选择状态
    group.apis.forEach((api: any) => {
        selectedApiIds.value.delete(api.id)
    })
    // 添加新选中的接口ID
    selectedRowKeys.forEach((id: string) => {
        selectedApiIds.value.add(id)
    })
}

// 加载已授权数据
async function loadGrantedData() {
    try {
        const appId = (route.query.code as string) || (route.params.id as string)
        const targetType = 'api-client'
        const resp = await apiGroupApi.queryGrant(targetType, appId)
        if (resp.success && resp.result) {
            initialGrantData.value = JSON.parse(JSON.stringify(resp.result))
            selectedGroupIds.value = resp.result.map((item: any) => item.groupId)
            // 根据已授权的操作ID，找到对应的接口规格ID并添加到selectedApiIds
            resp.result.forEach((item: any) => {
                if (item.operationIds && Array.isArray(item.operationIds)) {
                    const group = apiGroups.value.find((g) => g.id === item.groupId)
                    if (group?.operations) {
                        item.operationIds.forEach((operationId: string) => {
                            const operation = group.operations.find((op: any) => op.id === operationId)
                            if (operation?.apiSpecIds && Array.isArray(operation.apiSpecIds)) {
                                // 将操作关联的所有接口规格ID添加到selectedApiIds
                                operation.apiSpecIds.forEach((apiSpecId: string) => {
                                    selectedApiIds.value.add(apiSpecId)
                                })
                            }
                        })
                    }
                }
            })
        }
    } catch (error) {
        console.error('加载授权数据失败:', error)
    }
}

function handleReset() {
    if (initialGrantData.value) {
        selectedGroupIds.value = initialGrantData.value.map((item: any) => item.groupId)
        selectedApiIds.value.clear()
        // 根据已授权的操作ID，找到对应的接口规格ID并添加到selectedApiIds
        initialGrantData.value.forEach((item: any) => {
            if (item.operationIds && Array.isArray(item.operationIds)) {
                const group = apiGroups.value.find((g) => g.id === item.groupId)
                if (group?.operations) {
                    item.operationIds.forEach((operationId: string) => {
                        const operation = group.operations.find((op: any) => op.id === operationId)
                        if (operation?.apiSpecIds && Array.isArray(operation.apiSpecIds)) {
                            // 将操作关联的所有接口规格ID添加到selectedApiIds
                            operation.apiSpecIds.forEach((apiSpecId: string) => {
                                selectedApiIds.value.add(apiSpecId)
                            })
                        }
                    })
                }
            }
        })
        onlyMessage('已重置')
    }
}

function handleCancel() {
    router.back()
}

async function handleSave() {
    if (saving.value) return
    saving.value = true
    try {
        const appId = (route.query.code as string) || (route.params.id as string)
        const targetType = 'api-client'
        
        // 根据接口选择状态重新计算选中的分组（只要分组下有接口被选中就加入）
        const finalSelectedGroupIds: string[] = []
        apiGroups.value.forEach((group) => {
            const groupApiIds = getGroupApiIds(group.id)
            if (groupApiIds.length > 0) {
                const selectedCount = groupApiIds.filter((apiId) => selectedApiIds.value.has(apiId)).length
                if (selectedCount > 0) {
                    // 只要有接口被选中就加入该分组
                    finalSelectedGroupIds.push(group.id)
                }
            }
        })
        
        const grantData = finalSelectedGroupIds.map((groupId) => {
            const group = apiGroups.value.find((g) => g.id === groupId)
            const operationIds: string[] = []
            
            if (!group) {
                return { groupId, operationIds: [], merge: true, priority: 10 }
            }
            
            if (!group.operations || !Array.isArray(group.operations)) {
                return { groupId, operationIds: [], merge: true, priority: 10 }
            }
            
            group.operations.forEach((op: any) => {
                if (op.apiSpecIds && Array.isArray(op.apiSpecIds) && op.apiSpecIds.length > 0) {
                    // 检查该操作关联的接口规格ID中是否有被选中的接口
                    const matchedSpecIds = op.apiSpecIds.filter((apiSpecId: string) => 
                        selectedApiIds.value.has(apiSpecId)
                    )
                    
                    if (matchedSpecIds.length > 0) {
                        operationIds.push(op.id)
                    }
                }
            })
            
            return { groupId, operationIds, merge: true, priority: 10 }
        })
        
        // 确保即使空数组也发送请求体
        await apiGroupApi.grant(targetType, appId, grantData || [])
        onlyMessage('授权成功')
        router.back()
    } catch (error: any) {
        onlyMessage(error?.response?.data?.message || '授权失败', 'error')
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    loadApiGroups() // loadApiGroups 内部会调用 loadGrantedData
    nextTick(() => {
        calculateTreeHeight()
        if (treeContainerRef.value) resizeObserver.observe(treeContainerRef.value)
    })
})

onUnmounted(() => {
    if (treeContainerRef.value) resizeObserver.unobserve(treeContainerRef.value)
})
</script>

<style lang="less" scoped>
.department-container {
    display: flex;
    background-color: #fff;
    padding: 24px;
    height: 100%;
    position: relative;

    .left {
        position: absolute;
        width: 300px;
        top: 24px;
        bottom: 24px;
    }

    .right {
        position: absolute;
        top: 24px;
        bottom: 24px;
        width: calc(100% - 316px);
        margin-left: 316px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .right-scroll {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
        }
        .right-footer {
            padding: 16px 0;
            border-top: 1px solid #f0f0f0;
            display: flex;
            justify-content: flex-start;
            flex-shrink: 0;
        }
        .right-header {
            margin-bottom: 12px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
        }
        :deep(.ant-tabs-nav-wrap) {
            padding-left: 24px;
        }
    }
}

.left-tree-contain {
    height: 100%;
    display: flex;
    flex-direction: column;

    .tree {
        flex: 1;
        min-height: 0;
    }
}

.empty-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}
</style>
