<template>
  <div class="upload-image-warp" >
    <div class="upload-image-border" :style="borderStyle">
      <a-upload
        list-type="picture-card"
        class="avatar-uploader"
        :name="name || 'file'"
        :accept="accept"
        :show-upload-list="false"
        :beforeUpload="beforeUpload"
        :headers="{ [TOKEN_KEY]: getToken() }"
        @change="handleChange"
      >
        <div class="upload-image-content" :style="style">
          <slot name="content" :imageUrl="imageUrl" :loading="loading">
            <template v-if="imageUrl">
              <img :src="imageUrl" width="100%" class="upload-image" />
              <div class="upload-image-mask">{{ $t('Image.ImageUpload.825077-0') }}</div>
            </template>
            <AIcon
              v-else
              type="PlusOutlined"
              style="font-size: 20px"
            />
          </slot>
        </div>
      </a-upload>
      <div class="upload-loading-mask" v-if="disabled"></div>
      <div class="upload-loading-mask" v-if="imageUrl && loading">
        <AIcon type="LoadingOutlined" style="font-size: 20px" />
      </div>
    </div>
  </div>
  <CropperModal
    v-if="cropper.visible"
    v-bind="cropperProps"
    :img="cropper.img"
    :title="cropperTitle"
    @cancel="cropper.visible = false"
    @ok="saveImage"
  />
</template>

<script setup lang="ts" name="ImageUpload">
import { getToken, onlyMessage, getBase64ByImg } from "@jetlinks-web/utils";
import { TOKEN_KEY } from '@jetlinks-web/constants'
import type { CSSProperties, PropType } from "vue";
import type { UploadChangeParam } from 'ant-design-vue';
import CropperModal from "./CropperModal";
import { useI18n } from "vue-i18n";
import i18n from "@/locales";

const { t: $t } = useI18n();
const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  size: {
    type: Number,
    default: 2
  },
  types: {
    type: Array as PropType<Array<string>>,
    default: ['image/jpeg', 'image/png']
  },
  disabled: {
    type: Boolean,
    default: false
  },
  accept:{
    type: String,
    default: undefined
  },
  name: {
    type: String,
    default: 'file'
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  borderStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  cropperStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  cropperTitle: {
    type: String,
    default: i18n.global.t('Image.ImageUpload.825077-1')
  },
  cropperProps: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value'])

const cropper = reactive({
  visible: false,
  img: ''
})
const loading = ref(false) // 上传图片状态
const imageUrl = ref<string | undefined >('')

const beforeUpload = (file: any) => {
  const types = (props.types || []) as Array<string>
  const inType = types.includes(file.type)
  const maxSize = (props.size || 2) as number // 文件最大多少兆
  const isMaxSize = (file.size / 1024 / 1024) < maxSize

  if (!inType) {
    onlyMessage($t('Image.ImageUpload.825077-2'), 'error')
  }

  if (!isMaxSize) {
    onlyMessage($t('Image.ImageUpload.825077-3', [maxSize]), 'error');
  }
  getBase64ByImg(file, base64Url => {
    cropper.img = base64Url
    cropper.visible = true
  })

  return false
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
  }
  if (info.file.status === 'done') {
    imageUrl.value = info.file.response?.result.accessUrl;
    loading.value = false;
    emit('update:value', info.file.response?.result.accessUrl);
  }
  if (info.file.status === 'error') {
    loading.value = false;
    onlyMessage($t('Image.ImageUpload.825077-4'), 'error');
  }
}

const saveImage = (url: string) => {
  cropper.visible = false
  imageUrl.value = url
  emit('update:value', url);
}

watch(() => props.value, (newValue) => {
  imageUrl.value = newValue as string
}, {
  immediate: true
})

</script>

<style scoped lang="less">

@border: 1px dashed @border-color-base;
@mask-color: rgba(#000, 0.25);

.flex-center() {
  align-items: center;
  justify-content: center;
}

.upload-image-warp {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 100%;

  .upload-image-border {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: all 0.3s;
    border: 1px dashed #1890ff;

    &:hover {
       border-color: @primary-color-hover;
     }

    :deep(.ant-upload-picture-card-wrapper) {
      width: 100%;
      height: 100%;
    }
    :deep(.ant-upload) {
      width: 100%;
      height: 100%;
    }

    .upload-image-content {
      .flex-center();

      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: rgba(#000, 0.06);
      cursor: pointer;
      padding: 8px;

    .upload-image-mask {
      .flex-center();

      position: absolute;
      top: 0;
      left: 0;
      display: none;
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 16px;
      background-color: @mask-color;
    }

    .upload-image {
      width: 100%;
      height: 100%;
    //border-radius: 50%;
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
