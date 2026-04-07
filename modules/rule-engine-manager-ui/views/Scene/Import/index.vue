<template>
  <a-modal
    title="导入"
    open
    @cancel="emit('close')"
    @ok="handleImport"
    :confirm-loading="loading"
    :ok-button-props="{ disabled: !fileContent }"
  >
    <!-- 导入文件 -->
    <div class="import-container">
      <a-upload-dragger
        accept=".json"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :custom-request="customRequest"
        @change="handleChange"
        class="upload-area"
      >
        <div class="upload-content">
          <AIcon type="InboxOutlined" style="font-size: 48px; color: #999;" />
          <p class="upload-text">点击或拖拽JSON文件到此区域上传</p>
          <p class="upload-hint">仅支持 .json 格式文件</p>
        </div>
      </a-upload-dragger>

      <!-- 文件信息显示 -->
      <div v-if="selectedFile" class="file-info">
        <a-alert
          :message="`已选择文件: ${selectedFile.name}`"
          :description="`文件大小: ${formatFileSize(selectedFile.size)}`"
          type="success"
          show-icon
        />
      </div>

      <!-- 错误信息显示 -->
      <div v-if="errorMessage" class="error-info">
        <a-alert
          :message="errorMessage"
          type="error"
          show-icon
          closable
          @close="errorMessage = ''"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { save } from "@rule-engine-manager-ui/api/scene";
import { omit } from 'lodash-es';
import { onlyMessage } from '@jetlinks-web/utils';

const props = defineProps({

})

const emit = defineEmits(['close', 'save'])

// 响应式数据
const loading = ref(false)
const selectedFile = ref<File | null>(null)
const fileContent = ref<string>('')
const errorMessage = ref<string>('')

// 文件上传前的校验
const beforeUpload = (file: File) => {
  // 清除之前的错误信息
  errorMessage.value = ''

  // 检查文件类型
  const isJSON = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')
  if (!isJSON) {
    errorMessage.value = '只能上传 JSON 格式的文件！'
    return false
  }

  // 检查文件大小（限制为10MB）
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    errorMessage.value = '文件大小不能超过 10MB！'
    return false
  }

  return true
}

// 自定义上传请求（不实际上传，只读取文件内容）
const customRequest = (options: any) => {
  const { file } = options
  selectedFile.value = file

  // 使用FileReader读取文件内容
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      // 验证是否为有效的JSON
      JSON.parse(content)
      fileContent.value = content
      onlyMessage('文件读取成功！')
    } catch (error) {
      errorMessage.value = '文件内容不是有效的JSON格式！'
      selectedFile.value = null
      fileContent.value = ''
    }
  }

  reader.onerror = () => {
    errorMessage.value = '文件读取失败！'
    selectedFile.value = null
    fileContent.value = ''
  }

  reader.readAsText(file, 'UTF-8')
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理导入
const handleImport = async () => {
  if (!fileContent.value) {
    onlyMessage('请先选择要导入的文件！', 'warning')
    return
  }

  try {
    loading.value = true
    const jsonData = JSON.parse(fileContent.value)

    console.log(jsonData)
    loading.value = true;
    const resp = await save(omit(jsonData, 'id'));
    if (resp.success) {
      emit('save', resp.result)
    }
  } catch (error) {
    errorMessage.value = '导入失败，请检查文件格式！'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.import-container {
  padding: 16px 0;
}

.upload-area {
  margin-bottom: 16px;
}

.upload-content {
  padding: 40px 20px;
  text-align: center;
}

.upload-text {
  margin: 16px 0 8px;
  font-size: 16px;
  color: #666;
}

.upload-hint {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.file-info,
.error-info {
  margin-top: 16px;
}
</style>
