<template>
  <div 
    class="markdown-editor-wrapper"
    :style="{ '--editor-height': typeof editorHeight === 'number' ? `${editorHeight}px` : editorHeight }"
  >
    <MdEditor
      v-model="editorValue"
      :language="language"
      :theme="theme"
      :preview-theme="previewTheme"
      :toolbars="toolbars"
      :height="editorHeight"
      :preview-only="previewOnly"
      :code-theme="codeTheme"
      @on-save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

interface Props {
  modelValue: string
  height?: string | number
  language?: 'zh-CN' | 'en-US'
  theme?: 'light' | 'dark'
  previewTheme?: 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'
  previewOnly?: boolean
  codeTheme?: string
  toolbars?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 600,
  language: 'zh-CN',
  theme: 'light',
  previewTheme: 'github',
  previewOnly: false,
  codeTheme: 'atom',
  toolbars: () => [
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'table',
    '-',
    'revoke',
    'next',
    'save',
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'catalog',
  ],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'save': [value: string]
}>()

const editorValue = ref(props.modelValue)
const editorHeight = ref(props.height)

watch(
  () => props.modelValue,
  (newVal) => {
    editorValue.value = newVal
  }
)

watch(editorValue, (newVal) => {
  emit('update:modelValue', newVal)
})

watch(
  () => props.height,
  (newVal) => {
    editorHeight.value = newVal
  },
  { immediate: true }
)

const handleSave = (value: string, html: string, text: string) => {
  emit('save', value)
}
</script>

<style scoped lang="less">
.markdown-editor-wrapper {
  width: 100%;

  :deep(.md-editor) {
    height: var(--editor-height, 600px) !important;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus-within {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }

  :deep(.md-editor-toolbar) {
    border-bottom: 1px solid #f0f0f0;
    background-color: #fafafa;
  }

  :deep(.md-editor-content) {
    .md-editor-textarea {
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
    }
  }

  // 预览区域样式优化
  :deep(.md-editor-preview) {
    padding: 16px;
    font-size: 14px;
    line-height: 1.8;
  }
}
</style>
