<template>
    <j-page-container>
        <!-- 主容器卡片 -->
        <a-card>
            <ApiGroupBasicForm
                ref="basicFormRef"
                :data="formData.baseInfo"
                @update="handleBasicInfoChange"
            />
        </a-card>

        <!-- API 能力配置区块 -->
        <ApiOperationSelector
            ref="operationSelectorRef"
            :value="formData.operations"
            :show-summary="false"
            :enable-tree-nav="true"
            @update="handleOperationsChange"
        />
        <a-card>
            <!-- 操作按钮 -->
            <a-space>
                <a-button @click="handleCancel">返回</a-button>
                <a-button
                    type="primary"
                    :loading="saving"
                    @click="handleSave"
                >
                    <template #icon>
                        <AIcon type="SaveOutlined"/>
                    </template>
                    保存
                </a-button>
            </a-space>
        </a-card>

        <!-- 回到顶部按钮 -->
        <a-back-top/>
    </j-page-container>
</template>

<script setup lang="ts">
import type {ApiGroupBaseInfo, ApiOperationInfo} from '../types'
import apiGroupApi from '../../../../api/apiGroup'
import ApiGroupBasicForm from '../components/ApiGroupBasicForm.vue'
import ApiOperationSelector from '../components/ApiOperationSelector.vue'
import {useRoute, useRouter} from 'vue-router'
import {onlyMessage} from '@jetlinks-web/utils'
import {useI18n} from "vue-i18n"

const {t: $t} = useI18n()
const route = useRoute()
const router = useRouter()

const saving = ref(false)
const isEdit = ref(false)
const editId = ref<string>('')

const basicFormRef = ref()
const operationSelectorRef = ref()

const formData = reactive<{
    baseInfo: ApiGroupBaseInfo
    operations: ApiOperationInfo[]
}>({
    baseInfo: {
        name: '',
        description: '',
    },
    operations: [],
})

// 已选 API 统计（已移除）

const handleBasicInfoChange = (data: ApiGroupBaseInfo) => {
    formData.baseInfo = data
}

const handleOperationsChange = (data: ApiOperationInfo[]) => {
    formData.operations = data
}

const handleSave = async () => {
    if (saving.value) {
        return
    }

    // 验证基本信息
    const basicValid = await basicFormRef.value?.validate()
    if (!basicValid) {
        onlyMessage($t('ApiGroup.Detail.123648-12'), 'error')
        return
    }

    // 验证是否选择了 API
    if (!formData.operations || formData.operations.length === 0) {
        onlyMessage('请至少选择一个 API 操作', 'warning')
        return
    }

    saving.value = true
    try {
        const basicFormData = basicFormRef.value?.formData || formData.baseInfo

        if (isEdit.value && editId.value) {
            // 更新模式 - 合并所有数据到一次 API 调用
            const operations = formData.operations
                .filter((op) => op.id)
                .map((op) => ({
                    id: op.id || `${op.path}_${op.method}`,
                    name: op.description || `${op.method} ${op.path}`,
                    description: op.description || '',
                    apiSpecIds: [op.id!],
                }))

            const payload: any = {
                id: editId.value,
                name: basicFormData.name || formData.baseInfo.name,
                description: basicFormData.description || formData.baseInfo.description,
                operations,
            }

            // 一次性更新所有数据
            await apiGroupApi.update(payload)
        } else {
            // 创建模式
            const createPayload: any = {
                name: basicFormData.name || formData.baseInfo.name,
                description: basicFormData.description || formData.baseInfo.description,
                operations: formData.operations
                    .filter((op) => op.id)
                    .map((op) => ({
                        id: op.id || `${op.path}_${op.method}`,
                        name: op.description || `${op.method} ${op.path}`,
                        description: op.description || '',
                        apiSpecIds: [op.id!],
                    })),
            }

            const resp = await apiGroupApi.save(createPayload)
            if (resp.success && resp.result) {
                editId.value = resp.result?.id || resp.result
                isEdit.value = true
            }
        }

        onlyMessage($t('ApiGroup.Detail.123648-15'))
        router.back()
    } catch (error) {
        console.error('保存失败:', error)
        onlyMessage($t('ApiGroup.Detail.123648-16'), 'error')
    } finally {
        saving.value = false
    }
}

const handleCancel = () => {
    router.back()
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

const loadDetail = async (id: string) => {
    try {
        // 使用标准的根据 id 查询接口
        const detailResp = await apiGroupApi.getById(id)

        if (detailResp.success) {
            const data = detailResp.result
            if (data) {
                Object.assign(formData.baseInfo, {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                })

                const operations: ApiOperationInfo[] = []
                if (data.operations && Array.isArray(data.operations)) {
                    data.operations.forEach((op: any) => {
                        if (op.apiDetail && Array.isArray(op.apiDetail)) {
                            op.apiDetail.forEach((api: any) => {
                                operations.push({
                                    id: api.id,
                                    path: api.path,
                                    method: api.method,
                                    description: api.summary || api.description,
                                    tags: Array.isArray(api.tags) ? api.tags : [],
                                    key: api.id || `${api.path}_${api.method}`,
                                    group: api.group || '未分组',
                                })
                            })
                        } else if (op.apiSpecIds && Array.isArray(op.apiSpecIds)) {
                            op.apiSpecIds.forEach((apiId: string) => {
                                operations.push({
                                    id: apiId,
                                    path: '',
                                    method: '',
                                    description: op.description || op.name,
                                    tags: [],
                                    key: apiId,
                                })
                            })
                        }
                    })
                }
                formData.operations = operations

                // 处理数据权限配置 - 后端返回的 accessSupport 可能是对象格式 {text: "不支持", value: "unsupported"}
                const accessSupportValue = typeof data.accessSupport === 'object' && data.accessSupport?.value
                    ? data.accessSupport.value
                    : (data.accessSupport || 'unsupported')

                const accessConfig: ApiDataPermissionConfig = {
                    accessSupport: accessSupportValue as 'support' | 'unsupported' | 'indirect',
                    assetType: data.assetType,
                    indirectMenus: data.indirectMenus || data.options?.indirectMenus || [],
                }

                formData.accessConfig = accessConfig
                console.log('加载的数据权限配置:', accessConfig, '原始数据:', data.accessSupport)
            }
        }
    } catch (error) {
        console.error('加载详情失败:', error)
    }
}

onMounted(() => {
    const id = route.params.id as string
    if (id && id !== ':id') {
        isEdit.value = true
        editId.value = id
        loadDetail(id)
    }
})
</script>

<style lang="less" scoped>
.api-group-detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;

    .tabs-content {
        flex: 1;
        padding: 24px 24px;
        background-color: #f0f2f5;
        overflow-y: auto;
    }

    .content-card {
        margin-bottom: 24px;
        padding: 24px;
        background-color: #fff;
        border-radius: 2px;

        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        &.button-card {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 24px;
            margin-bottom: 0;
        }
    }

    .api-selector-wrapper {
        margin: -24px -24px -24px -24px;
        border-radius: 2px;
        overflow: hidden;
        display: flex;
    }

    .section-divider {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f0f0;

        .section-label {
            font-size: 14px;
            font-weight: 500;
            color: #262626;
            margin: 0;
            display: block;
        }
    }

    .empty-state {
        text-align: center;
        padding: 40px 0;
    }
}

</style>
