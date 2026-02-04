<template>
    <j-page-container>
        <!-- 主容器卡片 -->
        <a-card class="api-detail-card">
            <div class="api-detail-container">
                <!-- 顶部：基础信息展示 -->
                <div class="detail-header">
                    <!-- API 基本信息 -->
                    <div class="header-top">
                        <div class="api-path">
                            <a-tag :color="getMethodColor(currentApi.method)" class="method-tag">
                                {{ currentApi.method }}
                            </a-tag>
                            <code class="path-code">{{ currentApi.path }}</code>
                            <span style="margin: 0 8px; color: #8c8c8c">{{ currentApi.id }}</span>
                            <span style="margin: 0 8px; color: #8c8c8c">所属分组：{{ currentApi.group || '未分组' }}</span>
                        </div>
                        <div class="api-summary">
                            <a-textarea
                                v-model:value="formData.summary"
                                placeholder="接口说明"
                                allow-clear
                                :rows="3"
                            />
                        </div>
                    </div>

                    <!-- 治理属性配置表单 -->
                    <div class="header-form">
                        <a-form
                            ref="configFormRef"
                            :model="formData"
                            layout="vertical"
                            style="width: 100%"
                        >
                            <!-- 第一行：开放性、风险等级 -->
                            <a-row :gutter="24">
                                <a-col :xs="24" :sm="12">
                                    <!-- 开放性 -->
                                    <a-form-item
                                        label="开放性"
                                        name="visibility"
                                        :rules="[{ required: true, message: '请选择开放性' }]"
                                    >
                                        <a-select v-model:value="formData.visibility" placeholder="请选择">
                                            <a-select-option value="internal">
                                                <a-tag color="default">仅内部可见</a-tag>
                                            </a-select-option>
                                            <a-select-option value="partner">
                                                <a-tag color="warning">用户可见</a-tag>
                                            </a-select-option>
                                            <a-select-option value="open">
                                                <a-tag color="processing">公开</a-tag>
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>

                                <a-col :xs="24" :sm="12">
                                    <!-- 风险等级 -->
                                    <a-form-item
                                        label="风险等级"
                                        name="riskLevel"
                                        :rules="[{ required: true, message: '请选择风险等级' }]"
                                    >
                                        <a-select v-model:value="formData.riskLevel" placeholder="请选择">
                                            <a-select-option value="low">
                                                <a-tag color="green">低风险</a-tag>
                                            </a-select-option>
                                            <a-select-option value="medium">
                                                <a-tag color="orange">中风险</a-tag>
                                            </a-select-option>
                                            <a-select-option value="high">
                                                <a-tag color="red">高风险</a-tag>
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <!-- 第二行：操作类型、稳定性 -->
                            <a-row :gutter="24">
                                <a-col :xs="24" :sm="12">
                                    <!-- 操作类型 -->
                                    <a-form-item
                                        label="操作类型"
                                        name="operationType"
                                        :rules="[{ required: true, message: '请选择操作类型' }]"
                                    >
                                        <a-select v-model:value="formData.operationType" placeholder="请选择">
                                            <a-select-option value="read">
                                                <a-tag color="blue">只读</a-tag>
                                            </a-select-option>
                                            <a-select-option value="write">
                                                <a-tag color="orange">写</a-tag>
                                            </a-select-option>
                                            <a-select-option value="control">
                                                <a-tag color="red">控制</a-tag>
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>

                                <a-col :xs="24" :sm="12">
                                    <!-- 稳定性 -->
                                    <a-form-item
                                        label="稳定性"
                                        name="stable"
                                        :rules="[{ required: true, message: '请选择稳定性' }]"
                                    >
                                        <a-select v-model:value="formData.stable" placeholder="请选择">
                                            <a-select-option value="stable">
                                                <a-tag color="blue">稳定</a-tag>
                                            </a-select-option>
                                            <a-select-option value="testing">
                                                <a-tag color="orange">测试中</a-tag>
                                            </a-select-option>
                                            <a-select-option value="deprecated">
                                                <a-tag color="red">已废弃</a-tag>
                                            </a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <!-- 第三行：标签、影响范围 -->
                            <a-row :gutter="24">
                                <a-col :xs="24" :sm="12">
                                    <!-- 标签 -->
                                    <a-form-item label="标签" name="tags">
                                        <a-select
                                            v-model:value="formData.tags"
                                            mode="tags"
                                            placeholder="输入标签后按Enter"
                                        />
                                    </a-form-item>
                                </a-col>

                                <a-col :xs="24" :sm="12">
                                    <!-- 影响范围 -->
                                    <a-form-item label="影响范围" name="impactScope">
                                        <a-select
                                            v-model:value="formData.impactScope"
                                            mode="tags"
                                            placeholder="输入影响范围后按Enter"
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <!-- 第四行：能力分组、权限 -->
                            <a-row :gutter="24">
                                <a-col :xs="24" :sm="12">
                                    <!-- 能力分组 -->
                                    <a-form-item label="能力分组" name="businessGroup">
                                        <a-select
                                            v-model:value="formData.businessGroup"
                                            mode="tags"
                                            placeholder="输入能力分组后按Enter"
                                        />
                                    </a-form-item>
                                </a-col>

                                <a-col :xs="24" :sm="12">
                                    <!-- 权限（只读） -->
                                    <a-form-item label="权限">
                                        <a-input
                                            :value="currentPermissionName"
                                            placeholder="未绑定权限"
                                            readonly
                                            disabled
                                        />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                </div>

                <!-- 中部区域：Markdown编辑器（自带预览功能） -->
                <div class="detail-content">
                    <MarkdownEditor
                        v-model="formData.apiDoc"
                        :height="800"
                    />
                </div>

                <!-- 底部操作栏 -->
                <div class="footer-actions">
                    <a-space>
                        <a-button @click="handleCancel">返回</a-button>
                        <a-button type="primary" :loading="saving" @click="handleSave">
                            <template #icon>
                                <AIcon type="SaveOutlined"/>
                            </template>
                            保存
                        </a-button>
                    </a-space>
                </div>
            </div>
        </a-card>
    </j-page-container>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {onlyMessage} from '@jetlinks-web/utils'
import apiManageApi from '../../../api/apiManage'
import MarkdownEditor from '../../../components/MarkdownEditor/index.vue'

const route = useRoute()
const router = useRouter()
const configFormRef = ref()
const saving = ref(false)

// 权限列表
const permissionList = ref<any[]>([])

// 当前 API 数据
const currentApi = ref<any>({
    id: '',
    path: '',
    method: 'GET',
    summary: '',
    group: '',
    riskLevel: 'low',
    operationType: 'read',
    visibility: 'internal',
    stable: { text: '稳定', value: 'stable' },
})

// 表单数据
const formData = reactive({
    summary: '',
    visibility: 'internal' as string,
    riskLevel: 'low' as string,
    operationType: 'read' as string,
    stable: 'stable' as string,
    tags: [] as string[],
    impactScope: [] as string[],
    businessGroup: [] as string[],
    permissionId: '',
    apiDoc: '',
})

// 计算当前权限名称
const currentPermissionName = computed(() => {
    if (!currentApi.value.permissionId) return ''
    const permission = permissionList.value.find(p => p.id === currentApi.value.permissionId)
    return permission ? permission.name : currentApi.value.permissionId
})

// 颜色映射函数
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

const getRiskTagColor = (level?: string) => {
    const colorMap: Record<string, string> = {
        low: 'green',
        medium: 'orange',
        high: 'red',
    }
    return colorMap[level || 'low'] || 'green'
}

const getOperationTypeColor = (type?: string) => {
    const colorMap: Record<string, string> = {
        read: 'blue',
        write: 'orange',
        control: 'red',
    }
    return colorMap[type || 'read'] || 'blue'
}

const getVisibilityColor = (visibility?: string) => {
    const colorMap: Record<string, string> = {
        internal: 'default',
        partner: 'warning',
        open: 'processing',
    }
    return colorMap[visibility || 'internal'] || 'default'
}

// 权限搜索过滤
const filterPermission = (input: string, option: any) => {
    const permission = permissionList.value.find(p => p.id === option.value)
    if (!permission) return false
    return permission.name.toLowerCase().includes(input.toLowerCase())
}

// 加载权限列表
const loadPermissions = async () => {
    try {
        const resp = await apiManageApi.getPermissions({
            paging: false,
        })
        if (resp.success && resp.result) {
            permissionList.value = resp.result.map((item: any) => ({
                id: item.id,
                name: item.name || item.id,
            }))
        }
    } catch (error) {
        console.error('加载权限列表失败:', error)
    }
}

// 加载 API 详情
const loadApiDetail = async () => {
    const apiId = route.params.id as string
    if (!apiId) {
        onlyMessage('缺少 API ID', 'error')
        router.back()
        return
    }

    try {
        const resp = await apiManageApi.detail(apiId)
        if (resp.success && resp.result) {
            const item = resp.result
            currentApi.value = {
                id: item.id,
                path: item.path,
                method: item.method,
                summary: item.summary || item.description,
                group: item.group || '未分组',
                riskLevel: item.riskLevel,
                operationType: item.operationType,
                visibility: item.visibility,
                stable: item.stable || { text: '稳定', value: 'stable' },
                impactScope: item.impactScope || [],
                tags: item.tags || [],
                permissionId: item.permissionId,
            }

            // 初始化表单数据
            formData.summary = item.summary || item.description || ''
            formData.visibility = (item.visibility?.value || item.visibility) || 'internal'
            formData.riskLevel = (item.riskLevel?.value || item.riskLevel) || 'low'
            formData.operationType = (item.operationType?.value || item.operationType) || 'read'
            formData.stable = (item.stable?.value || item.stable) || 'stable'
            formData.tags = item.tags || []
            formData.impactScope = item.impactScope || []
            formData.businessGroup = item.businessGroup || []
            formData.apiDoc = item.apiDoc || ''
        }
    } catch (error) {
        console.error('加载 API 详情失败:', error)
        onlyMessage('加载数据失败', 'error')
        router.back()
    }
}

// 保存
const handleSave = async () => {
    try {
        const valid = await configFormRef.value?.validate()
        if (!valid) return

        saving.value = true
        const payload = {
            summary: formData.summary,
            visibility: formData.visibility,
            riskLevel: formData.riskLevel,
            operationType: formData.operationType,
            stable: formData.stable,
            tags: formData.tags,
            impactScope: formData.impactScope,
            businessGroup: formData.businessGroup,
            apiDoc: formData.apiDoc,
        }

        const resp = await apiManageApi.update(currentApi.value.id, payload)
        if (resp.success) {
            onlyMessage('保存成功', 'success')
            router.back()
        } else {
            onlyMessage(resp.message || '保存失败', 'error')
        }
    } catch (error) {
        console.error('保存失败:', error)
        onlyMessage('保存失败', 'error')
    } finally {
        saving.value = false
    }
}

// 返回
const handleCancel = () => {
    router.back()
}

// 页面初始化
onMounted(() => {
    loadPermissions()
    loadApiDetail()
})
</script>

<style scoped lang="less">
.api-detail-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    :deep(.ant-card-body) {
        padding: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }
}

.api-detail-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    height: 100%;
    background-color: #fff;

    .detail-header {
        flex-shrink: 0;
        background-color: #fff;
        border-bottom: 1px solid #f0f0f0;
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .header-top {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .api-path {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;

                .method-tag {
                    margin: 0;
                    font-weight: 600;
                    font-size: 12px;
                }

                .path-code {
                    font-size: 14px;
                    color: #262626;
                    font-family: 'Monaco', 'Courier New', monospace;
                    background-color: #f5f5f5;
                    padding: 4px 8px;
                    border-radius: 2px;
                }

                .description {
                    font-size: 12px;
                    color: #8c8c8c;
                    margin-left: 8px;
                }
            }

            .api-summary {
                width: 100%;

                :deep(.ant-input) {
                    font-size: 13px;
                }
            }

            .api-info-row {
                display: flex;
                gap: 32px;
                flex-wrap: wrap;

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;

                    .label {
                        color: #8c8c8c;
                        font-weight: 500;
                    }

                    .value {
                        color: #262626;
                        font-family: 'Monaco', 'Courier New', monospace;
                    }
                }
            }
        }

        .header-form {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;

            :deep(.ant-form) {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            :deep(.ant-form-item) {
                margin-bottom: 16px !important;
            }

            :deep(.ant-form-item-label) {
                padding: 0;
            }
        }

    }

    .detail-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 16px;
    }

    .footer-actions {
        flex-shrink: 0;
        display: flex;
        justify-content: flex-start;
        padding: 16px 24px;
        border-top: 1px solid #f0f0f0;
        background-color: #fff;
    }
}

// 响应式布局
@media (max-width: 1024px) {
    .api-detail-container {
        .detail-header {
            .header-form {
                gap: 12px;

                :deep(.ant-form-item) {
                    flex: 1;
                    min-width: 200px;
                }
            }
        }
    }
}
</style>