<template>
    <ApiListView
        :data-loader="loadGrantedApis"
        :columns="tableColumns"
        :empty-text="'暂无已赋权的接口'"
        :container-class="'granted-api-list-container'"
        :show-checkbox="false"
        :show-selected-count="false"
        @view="handleViewDoc"
    >
        <template #action="{ record }">
            <a-button
                type="link"
                size="small"
                @click="handleViewDoc(record)"
            >
                查看文档
            </a-button>
        </template>
    </ApiListView>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import apiGroupApi from '../../../../../api/apiGroup'
import { onlyMessage } from '@jetlinks-web/utils'
import ApiListView from '../../../api-manage/components/ApiListView.vue'

interface Props {
    appId: string
}

const props = defineProps<Props>()
const emit = defineEmits(['view'])

// 表格列定义（与 ApiListView 保持一致，path 宽度为 62%）
const tableColumns = [
    {
        title: '路径',
        key: 'path',
        dataIndex: 'path',
        width: '58%',
    },
    {
        title: '风险等级',
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
        title: '操作类型',
        key: 'operationType',
        dataIndex: 'operationType',
        width: '10%',
    },
    {
        title: '操作',
        key: 'action',
        width: '12%',
    },
]

// 数据缓存
const apiDataCache = ref<any[]>([])

// 加载已赋权的分组和接口数据（只显示已勾选的授权接口）
const loadGrantedApis = async () => {
    if (!props.appId) {
        apiDataCache.value = []
        return []
    }

    try {
        // 1. 获取已授权的分组信息（包含operationIds）
        const grantResp = await apiGroupApi.queryGrant('api-client', props.appId)
        if (!grantResp.success || !grantResp.result || grantResp.result.length === 0) {
            apiDataCache.value = []
            return []
        }

        // 2. 构建已授权操作ID的映射（groupId -> operationIds Set）
        const grantedOperationsMap = new Map<string, Set<string>>()
        grantResp.result.forEach((item: any) => {
            const groupId = item.groupId
            const operationIds = item.operationIds || []
            if (operationIds.length > 0) {
                grantedOperationsMap.set(groupId, new Set(operationIds))
            }
        })

        // 如果没有已授权的操作，返回空数组
        if (grantedOperationsMap.size === 0) {
            apiDataCache.value = []
            return []
        }

        // 3. 遍历每个已授权的分组，只获取已勾选的操作对应的接口
        const allApis: any[] = []
        const grantedGroupIds = Array.from(grantedOperationsMap.keys())
        
        for (const groupId of grantedGroupIds) {
            try {
                const grantedOperationIds = grantedOperationsMap.get(groupId)!
                const detailResp = await apiGroupApi.detail(groupId, true)
                if (detailResp.success && detailResp.result) {
                    const groupDetail = Array.isArray(detailResp.result) ? detailResp.result[0] : detailResp.result
                    if (groupDetail.operations && Array.isArray(groupDetail.operations)) {
                        // 只处理已授权的操作
                        groupDetail.operations.forEach((op: any) => {
                            // 检查该操作是否在已授权的operationIds中
                            if (grantedOperationIds.has(op.id)) {
                                if (op.apiDetail && Array.isArray(op.apiDetail)) {
                                    op.apiDetail.forEach((api: any) => {
                                        allApis.push({
                                            id: api.id,
                                            path: api.path,
                                            method: api.method,
                                            summary: api.summary || api.description,
                                            description: api.description,
                                            group: api.group || groupDetail.name || '未分组',
                                            riskLevel: api.riskLevel,
                                            operationType: api.operationType,
                                            visibility: api.visibility,
                                            stable: api.stable,
                                            businessGroup: api.businessGroup,
                                            impactScope: api.impactScope,
                                            apiDoc: api.apiDoc,
                                        })
                                    })
                                }
                            }
                        })
                    }
                }
            } catch (error) {
                console.error(`加载分组 ${groupId} 详情失败:`, error)
            }
        }

        apiDataCache.value = allApis
        return allApis
    } catch (error) {
        console.error('加载已赋权接口失败:', error)
        onlyMessage('加载已赋权接口失败', 'error')
        apiDataCache.value = []
        return []
    }
}

// 查看文档
const handleViewDoc = (record: any) => {
    emit('view', record)
}

// 暴露方法供外部调用
defineExpose({
    loadGrantedApis,
    getGrantedApiCount: () => apiDataCache.value.length,
    getAllApiData: () => apiDataCache.value,
})

// 使用 watch 监听 appId 变化，添加防抖避免重复调用
let loadingTimer: ReturnType<typeof setTimeout> | null = null
watch(() => props.appId, (newId, oldId) => {
    // 如果 appId 没有变化，不重复加载
    if (newId === oldId && apiDataCache.value.length > 0) {
        return
    }
    
    // 清除之前的定时器
    if (loadingTimer) {
        clearTimeout(loadingTimer)
    }
    
    // 延迟加载，避免重复调用
    loadingTimer = setTimeout(() => {
        if (newId) {
            loadGrantedApis()
        } else {
            apiDataCache.value = []
        }
    }, 100)
}, { immediate: true })
</script>

