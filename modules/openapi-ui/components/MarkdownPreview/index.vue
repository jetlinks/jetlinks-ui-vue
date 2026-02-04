<template>
  <div class="markdown-preview-wrapper">
    <MdPreview
      :modelValue="content"
      :previewTheme="previewTheme"
      :codeTheme="codeTheme"
      editorId="markdown-preview"
    />
  </div>
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

interface Props {
  content?: string
  previewTheme?: 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'
  codeTheme?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  previewTheme: 'github',
  codeTheme: 'atom',
})
</script>

<style scoped lang="less">
.markdown-preview-wrapper {
  width: 100%;
  height: 100%;

  :deep(.md-preview) {
    height: 100%;
    overflow-y: auto;
  }

  // 复写代码块标题头的 sticky 定位
  :deep(.md-editor-preview .md-editor-code .md-editor-code-head) {
    position: static !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    z-index: auto !important;
    transform: none !important;
    will-change: auto !important;
  }

  // 也覆盖直接的选择器
  :deep(.md-editor-code .md-editor-code-head) {
    position: static !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    z-index: auto !important;
    transform: none !important;
    will-change: auto !important;
  }
}
</style>

<style lang="less">
// 全局样式确保覆盖 md-editor-v3 的默认样式
.md-editor-preview .md-editor-code .md-editor-code-head {
  position: static !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  z-index: auto !important;
  transform: none !important;
  will-change: auto !important;
}
</style>
