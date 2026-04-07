<template>
  <div class="dashboard-preview-tab">
    <div
      v-if="loading"
      class="state state-center"
    >
      <a-spin size="large" />
    </div>

    <div
      v-else-if="PreviewComp && dashboardDraftId"
      class="preview-host"
    >
      <component
        :is="PreviewComp"
        :draftId="dashboardDraftId"
        :targetId="targetId"
        embedded
        :showHeader="false"
      />
    </div>

    <a-empty
      v-else
      :description="emptyText || $t('device.DashboardPreviewTab.101001-0')"
      class="state state-center"
    />
  </div>
</template>

<script setup lang="ts">
import { useInstanceStore } from '@device-manager-ui/store/instance'
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = withDefaults(
  defineProps<{
    targetId?: string
    emptyText?: string
  }>(),
  {
    targetId: '',
    emptyText: ''
  }
)

const loading = ref(false)
const dashboardDraftId = ref('')
const PreviewComp = shallowRef<any>(null)
const instanceStore = useInstanceStore()
const route = useRoute()

const projectId = computed(() => `project_${instanceStore.current.productId || route.params.id}`)

const reload = async () => {
  if (!projectId.value) {
    dashboardDraftId.value = ''
    return
  }

  loading.value = true
  try {
    const { DesignerPreview } = moduleRegistry.getResource('visualization-manager-ui', 'components') as any
    const { queryProjectList } = moduleRegistry.getResource('visualization-manager-ui', 'apis') as any

    PreviewComp.value = DesignerPreview

    const res = await queryProjectList({
      paging: false,
      terms: [
        { column: 'projectType', value: 'dashboard' },
        { column: 'projectId', value: projectId.value, type: 'and' }
      ],
      sorts: [{ name: 'modifyTime', order: 'desc' }]
    })

    dashboardDraftId.value = res?.result?.data?.[0]?.draftId || ''
  } catch (e: any) {
    console.warn($t('device.DashboardPreviewTab.101001-1'), e)
  } finally {
    loading.value = false
  }
}

watch(
  () => projectId.value,
  () => {
    reload()
  },
  { immediate: true }
)

defineExpose({
  reload
})
</script>

<style lang="less" scoped>
.dashboard-preview-tab {
  width: 100%;
  height: 100%;
}

.preview-host {
  width: 100%;
  height: 100%;
}

.state {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
}

.state-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
