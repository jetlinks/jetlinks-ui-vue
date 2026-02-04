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
        <a-card style="margin-top: 16px">
            <ApiListView
                ref="apiListViewRef"
                :readonly="false"
                :show-checkbox="true"
                @edit="() => {}"
            />
        </a-card>

        <a-card style="margin-top: 16px">
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
import {ref, reactive, onMounted, nextTick} from 'vue'
import type {ApiGroupBaseInfo, ApiOperationInfo} from '../types'
import apiGroupApi from '../../../../api/apiGroup'
import ApiGroupBasicForm from '../components/ApiGroupBasicForm.vue'
import ApiListView from '../../api-manage/components/ApiListView.vue'
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
const apiListViewRef = ref()

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

const handleBasicInfoChange = (data: ApiGroupBaseInfo) => {
    formData.baseInfo = data
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

    // 获取选中的 API
    const selectedApis = apiListViewRef.value?.getSelectedApis?.() || []
    if (selectedApis.length === 0) {
        onlyMessage('请至少选择一个 API 操作', 'warning')
        return
    }

    saving.value = true
    try {
        const basicFormData = basicFormRef.value?.formData || formData.baseInfo

        const operations = selectedApis.map((api: any) => ({
            id: api.id || `${api.path}_${api.method}`,
            name: api.summery || api.description || `${api.method} ${api.path}`,
            description: api.summery || api.description || '',
            apiSpecIds: [api.id!],
        }))

        if (isEdit.value && editId.value) {
            // 更新模式
            const payload: any = {
                id: editId.value,
                name: basicFormData.name || formData.baseInfo.name,
                description: basicFormData.description || formData.baseInfo.description,
                operations,
            }

            await apiGroupApi.update(editId.value, payload)
        } else {
            // 创建模式
            const createPayload: any = {
                name: basicFormData.name || formData.baseInfo.name,
                description: basicFormData.description || formData.baseInfo.description,
                operations,
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

const loadDetail = async (id: string) => {
    try {
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

                // 设置 ApiListView 的选中状态
                // 需要等待 ApiListView 加载完成后再设置选中状态
                nextTick(() => {
                    if (apiListViewRef.value && operations.length > 0) {
                        const apiIds = operations.map(op => op.id).filter(Boolean)
                        apiListViewRef.value.setSelectedApiIds?.(apiIds)
                    }
                })
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
// 样式已移除，使用 ApiListView 组件自带的样式
</style>
