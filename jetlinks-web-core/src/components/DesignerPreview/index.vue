<template>
  <div class="ai-preview">
    <Preview
      :canvas="pageInfo.canvas"
      :components="pageInfo.components"
    />
  </div>
  <a-space style="margin-top: 6px;">
    <a-button>预览</a-button>
    <a-button type="primary">使用该方案创建项目</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { moduleRegistry } from '@jetlinks-web-core/utils/module-registry'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const { Preview } = moduleRegistry.getResource('visualization-designer-ui', 'components')
const { useDesignerHook } = moduleRegistry.getResource('visualization-designer-ui', 'hooks')
const { ResourceBasicComponentsInstance } = moduleRegistry.getResource('visualization-resources', 'events')
const { initPreview } = useDesignerHook()
const pageInfo = ref<any>({
  canvas: {
    width: 1920,
    height: 1080,
    scale: 0.6,
    name: '画布',
    adaptationType: 'AUTO',
    backgroundColor: '#424242',
    backgroundImage: {
      fileId: ''
    },
    gridLayout: {
      backgroundColor: '',
      marginHorizontal: 8,
      marginVertical: 8,
      borderColor: '',
      borderWidth: 1,
      borderStyle: 'solid',
      fontColor: 'rgba(0,0,0,1)'
    },
    enablePreviewZoom: false,
    filter: {
      hue: 0,
      saturation: 0,
      brightness: 0,
      contrast: 0,
      opacity: 100,
      grayscale: 0
    }
  },
  components: []
})

const isValidJSON = (str: string) => {
  if (!str || typeof str !== 'string') return false

  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

onMounted(() => {
  initPreview(ResourceBasicComponentsInstance)
})

watch(
  () => props.data,
  (val) => {
    if (isValidJSON(val)) {
      pageInfo.value = val
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
.ai-preview {
  min-height: 216px;
  min-width: 384px;
}
</style>
