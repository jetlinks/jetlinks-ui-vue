<template>
  <div class="upload-file-container">
    <a-upload
      v-model:file-list="fileList"
      name="file"
      :accept="accept"
      :action="action"
      :maxCount="maxCount"
      :headers="{ [TOKEN_KEY]: getToken() }"
      @change="handleChange"
      @remove="handleRemove"
      :listType="listType"
      :beforeUpload="beforeUpload"
      @preview="handlePreview"
      :multiple="true"
    >
      <template v-if="listType === 'text'">
        <a-button>
          <AIcon type="UploadOutlined" />
          {{ btnText }}
        </a-button>
      </template>
      <template v-else-if="listType === 'picture-card'">
        <div v-if="fileList.length < maxCount">
          <AIcon type="PlusOutlined" />
        </div>
      </template>
    </a-upload>
    <div
      v-if="listType === 'picture-card'"
      style="display: none"
    >
      <a-image-preview-group
        :preview="{
          visible: visible,
          minScale: 0.1,
          current: currentPreviewIndex,
          onVisibleChange: (vis) => (visible = vis)
        }"
      >
        <a-image
          v-for="(item, index) in previewImage"
          :src="item.url"
          :key="index"
          @click="handleImageClick(index)"
        />
      </a-image-preview-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { getToken, onlyMessage } from '@jetlinks-web/utils'
import { FileStaticPath } from '@/api/comm'
import { getImageUrl } from '@/utils'

const props = defineProps({
  value: {
    type: [String, Array<UploadProps['fileList']>],
    default: undefined
  },
  btnText: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: undefined
  },
  types: {
    type: Array as PropType<Array<string>>,
    default: []
  },
  size: {
    type: Number,
    default: 2
  },
  maxCount: {
    type: Number,
    default: 1
  },
  listType: {
    type: String as PropType<'text' | 'picture' | 'picture-card'>,
    default: 'text'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  publicAccess: {
    type: Boolean,
    default: false
  },
  isUpload: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:value', 'change', 'remove'])
const fileList = ref([] as any[])
const loading = ref(false)
const action = computed(() => `${FileStaticPath}${props.publicAccess ? '' : '?options=publicAccess'}`)
const visible = ref(false)
const currentPreviewIndex = ref(0)
const previewImage = ref<any>([])

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (props.listType === 'picture-card') {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string
    }
    // if (file.name === file.uid) {
    //编辑状态
    previewImage.value.push({
      url: file.url,
      uid: file.uid
    })
    // }
    currentPreviewIndex.value = fileList.value.findIndex((f: any) => f.uid === file.uid)
    visible.value = true
  }
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true
  }
  if (info.file.status === 'done') {
    loading.value = false
    const _id = info.file.response?.result?.id
    previewImage.value.push({
      url: info.file.response?.result.accessUrl,
      uid: info.file.uid
    })
    emit('update:value', _id)
    emit('change', info)
  }
  if (info.file.status === 'error') {
    loading.value = false
    onlyMessage('上传失败', 'error')
  }
  if (!info.file.status) {
    fileList.value = fileList.value.filter((item: any) => item.uid !== info.file.uid)
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!props.isUpload) {
    emit('change', file)
    return false
  }

  let inType = true
  if (props.types?.length) {
    inType = props.types?.includes(file.type)
    if (file.type.includes('application')) {
      const type = file.type.split('/')[1]
      inType = props.types?.includes(type)
    }
  }

  const maxSize = props.size // 文件最大多少兆
  const isMaxSize = file.size / 1024 / 1024 < maxSize

  if (!inType) {
    onlyMessage('请上传正确格式的文件', 'error')
    return false
  }

  if (!isMaxSize) {
    onlyMessage(`文件大小必须小于${maxSize}M`, 'error')
    return false
  }
}

const handleRemove = (file: any) => {
  previewImage.value = previewImage.value.filter((item: any) => item.uid !== file.uid)
  emit('remove', file)
  emit('update:value')
}

const handleImageClick = (index: number) => {
  currentPreviewIndex.value = index
}

watch(
  () => props?.value,
  (newValue: any) => {
    if (newValue) {
      fileList.value = [{ url: getImageUrl(newValue), name: newValue }]
    } else {
      fileList.value = []
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
