<template>
    <j-page-container>
        <a-card>
            <div class="api-manage-container">
                <ApiListView
                    ref="apiListViewRef"
                    :readonly="false"
                    :show-checkbox="showCheckbox"
                    @edit="handleEditApi"
                />

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
import {ref, computed} from 'vue'
import { useMenuStore } from '@jetlinks-web-core/store'
import { useRoute } from 'vue-router'
import apiManageApi from '../../../api/apiManage'
import ApiListView from './components/ApiListView.vue'
import ApiEditDrawer from './components/ApiEditDrawer.vue'
import type {ApiGovernanceAttrs} from './types'
import {onlyMessage} from '@jetlinks-web/utils'

const menuStore = useMenuStore()
const route = useRoute()

// 根据路由查询参数决定是否显示复选框
const showCheckbox = computed(() => {
    return route.query.mode === 'select'
})

const selectedApiIds = ref<Set<string>>(new Set())
const batchEditMode = ref(false)
const currentEditApi = ref<ApiGovernanceAttrs>()

const editDrawerRef = ref()
const apiListViewRef = ref()

// 事件处理
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
    } catch (error) {
        console.error('保存失败:', error)
        onlyMessage('保存失败', 'error')
    }
}

// 暴露方法供外部调用
defineExpose({
    getSelectedApis: () => {
        return apiListViewRef.value?.getSelectedApis?.() || []
    }
})
</script>

<style lang="less" scoped>
.api-manage-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
