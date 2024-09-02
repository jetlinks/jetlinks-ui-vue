<template>
  <div class="upload-image-warp">
    <div class="upload-image-border" :style="borderStyle">
      <a-upload
        name="file"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        @change="handleChange"
        :action="`${BASE_API}/${FileStatic}`"
        :headers="{
          'X-Access-Token': LocalStore.get(TOKEN_KEY),
        }"
        v-bind="props"
      >
        <div class="upload-image-content">
          <template v-if="imageUrl">
            <img :src="imageUrl" height="100%" class="upload-image" />
          </template>
          <template v-else>
            <AIcon type="UserOutlined" style="font-size: 20px" />
          </template>
          <div class="upload-image-mask">更换</div>
        </div>
      </a-upload>
      <div class="upload-loading-mask" v-if="props.disabled"></div>
      <div class="upload-loading-mask" v-if="imageUrl && loading">
        <AIcon type="LoadingOutlined" style="font-size: 20px" />
      </div>
    </div>
  </div>
  <ImageCropper
    v-if="cropperVisible"
    :img="cropperImg"
    @cancel="cropperVisible = false"
    @ok="saveImage"
    title="更换头像"
  />
</template>

<script lang="ts" setup name="JProUpload">
import { UploadChangeParam, UploadProps } from 'ant-design-vue'
import { BASE_API } from '@jetlinks-web/constants'
import { FileStatic } from '@/api/comm'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { getBase64ByImg, LocalStore, onlyMessage } from '@jetlinks-web/utils'
import { CSSProperties } from 'vue'
import ImageCropper from '@/components/Upload/Cropper.vue'

type Emits = {
  (e: 'update:modelValue', data: string): void
  (e: 'change', data: string): void
}

interface JUploadProps extends UploadProps {
  modelValue: string
  disabled?: boolean
  types?: string[]
  errorMessage?: string
  size?: number
  borderStyle?: CSSProperties
}

const emit = defineEmits<Emits>()

const props: JUploadProps = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: undefined,
  },
  borderStyle: {
    type: Object,
    default: undefined,
  },
})

const loading = ref<boolean>(false)
const imageUrl = ref<string>(props?.modelValue || '')
const imageTypes = props.types ? props.types : ['image/jpeg', 'image/png']

const cropperImg = ref()
const cropperVisible = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {

    imageUrl.value = newValue
  },
  {
    immediate: true,
  },
)

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true
  }
  if (info.file.status === 'done') {
    imageUrl.value = info.file.response?.result.accessUrl
    loading.value = false
    emit('update:modelValue', info.file.response?.result.accessUrl)
    emit('change', info.file.response?.result.accessUrl)
  }
  if (info.file.status === 'error') {
    loading.value = false
    onlyMessage('上传失败', 'error')
  }
}

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isType = imageTypes.includes(file.type)
  const maxSize = props.size || 2 // 最大值
  if (!isType) {
    if (props.errorMessage) {
      onlyMessage(props.errorMessage, 'error')
    } else {
      onlyMessage(`请上传正确格式的图片`, 'error')
    }
    return false
  }
  const isSize = file.size / 1024 / 1024 < maxSize
  if (!isSize) {
    onlyMessage(`图片大小必须小于${maxSize}M`, 'error')
    return false
  }

  getBase64ByImg(file, (base64Url) => {
    cropperImg.value = base64Url
    cropperVisible.value = true
  })

  return false
}

const saveImage = (url: string) => {
  cropperVisible.value = false
  imageUrl.value = url
  emit('update:modelValue', url)
  emit('change', url)
}
</script>

<style lang="less" scoped>
@border: 1px dashed @border-color-base;
@mask-color: rgba(#000, 0.35);
@with: 96px;
@height: 96px;

.flex-center() {
  align-items: center;
  justify-content: center;
}

.upload-image-warp {
  display: flex;
  justify-content: flex-start;

  .upload-image-border {
    position: relative;
    width: @with;
    height: @height;
    overflow: hidden;
    transition: all 0.3s;

    :deep(.ant-upload-picture-card-wrapper) {
      width: 100%;
      height: 100%;
    }

    :deep(.ant-upload) {
      width: 100%;
      height: 100%;
    }

    :deep(.ant-upload-select-picture-card) {
      background: none !important;
      border: none !important;
    }

    .upload-image-content {
      .flex-center();

      border-radius: 50%;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, 0.06);
      cursor: pointer;
      // padding: 8px;

      .upload-image-mask {
        .flex-center();

        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        height: 100%;
        color: #fff;
        border-radius: 50%;
        font-size: 16px;
        background-color: @mask-color;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      &:hover .upload-image-mask {
        display: flex;
      }
    }
  }

  .upload-loading-mask {
    .flex-center();

    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: @mask-color;
  }
}
</style>
