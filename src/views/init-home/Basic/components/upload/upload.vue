<template>
  <div class="upload">
    <a-upload @change="change"
            :drag="uploadInfo.drag"
            name="file"
            :headers="uploadInfo.headers"
            :accept="accept"
            :beforeUpload="beforeUpload"
            :showUploadList="uploadInfo.showUploadList"
            :action="uploadInfo.action">
        <div class="upload-div" :style="`width: ${width};`">
          <div v-if="loading">
            <AIcon type="LoadingOutlined" />
          </div>
          <template v-else>
            <img id="upload-img" :style="`height: ${height};`" :src="imgSrc" :alt="$t('upload.upload.283727-0')">
            <div class="upload-mask" :style="`height: ${height};`">{{ $t('upload.upload.283727-1') }}</div>
          </template>
        </div>
        <div v-for="item in messages" :key="item" class="uploadTip">{{item}}</div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { UploadInfoType } from './typing'
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { getToken, onlyMessage } from '@jetlinks-web/utils'
import {FileStaticPath} from '@/api/comm'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['update:imgSrc'])

// 传入参数
const props = defineProps({
  uploadType: {
    type: String,
    default: 'logo'
  },
  imgSrc: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '160px'
  },
  width: {
    type: String,
    default: '160px'
  }
})

// 上传框接收类型
const accept = computed(() => {
  switch (props.uploadType) {
    case 'logo':
    case 'background':
      return uploadInfo.imageType;
    case 'ico':
      return uploadInfo.icoType;
    default:
      return '';
  }
})

// 上传校验
const beforeUpload = computed(() => {
  switch (props.uploadType) {
    case 'logo':
      return uploadInfo.isLogoImage;
    case 'ico':
      return uploadInfo.isIcoImage;
    case 'background':
      return uploadInfo.isBackground;
    default:
      return () =>  {};
  }
})

// 上传事件
const change = computed(() => {
  switch (props.uploadType) {
    case 'logo':
      return uploadInfo.changeLogoUpload;
    case 'ico':
      return uploadInfo.changeIcoUpload;
    case 'background':
      return uploadInfo.changeBackgroundUpload;
    default:
      return () =>  {};
  }
})

// 提示文字
const messages = computed(() => {
  switch (props.uploadType) {
    case 'logo':
      return uploadInfo.logoTip;
    case 'ico':
      return uploadInfo.icoTip;
    case 'background':
      return uploadInfo.backgroundTip;
    default:
      return () =>  {};
  }
})

// 上传状态
const loading = ref<Boolean>(false)

// 上传相关信息
const uploadInfo: UploadInfoType = {
  // 上传提示文字
  logoTip: [$t('upload.upload.283727-2'), $t('upload.upload.283727-3')],
  icoTip: [$t('upload.upload.283727-4'), $t('upload.upload.283727-5')],
  backgroundTip: [$t('upload.upload.283727-6'), $t('upload.upload.283727-7')],
  // 上传的地址
  action: FileStaticPath,
  headers: { [TOKEN_KEY]: getToken() },
  // 是否展示uplaodList
  showUploadList: false,
  // 是否支持拖拽
  drag: true,
  // 上传接受的类型
  imageType: ['.jpg', '.png', '.jfif', '.pjp', '.pjpeg', '.jpeg'].toString(),
  icoType: ['image/x-icon'].toString(),

/**
 * 验证图片是否在范围内
 * @param file 需要判断的文件
 * @param size 文件大小的最大值，超出该范围文件返回 false
 * @returns {boolean} 如果文件在范围内，返回 true，否则返回 false
 */
  isImageLessSize: (file: File, size: number) => {
    const isLess = 1.0 * file.size / 1024 / 1024 < size
    if (!isLess) {
      onlyMessage($t('upload.upload.283727-8') + size + $t('upload.upload.283727-9'),'error')
    }
    return isLess
  },

/**
 * 验证图片是否为jpg、png等格式
 * @param file 需要判断的文件
 * @returns {boolean} 如果文件为jpg、png等格式，返回 true，否则返回 false
 */
  isImageType: (file: File) => {
    const isImage =uploadInfo.imageType.split(',')
        .map((m: string) => m.split('.')[1])
        .filter((typeStr) => file.type.includes(typeStr)).length > 0
    if(!isImage) {
      onlyMessage($t('upload.upload.283727-10'),'error')
    }
    return isImage
  },

/**
 * 验证图片是否为ico格式
 * @param file 需要判断的文件
 * @returns {boolean} 如果文件为jico格式，返回 true，否则返回 false
 */
  isIcoType: (file: File) => {
    const isico = file.type.includes("x-icon")
    if(!isico) {
      onlyMessage($t('upload.upload.283727-11'),'error')
    }
    return isico
  },

 /**
 * 验证图片是否为jpg、png等格式
 * @param info 上传信息
 * @param msg 上传的内容名称，作为上传失败提示文字
 */
  changUpload: (info: any, msg: string) => {
    console.log("status",  info.file.status)
    if (info.file.status === 'uploading') {
      loading.value = true
    } else if (info.file.status === 'done') {
      info.file.url = info.file.response?.result.accessUrl
      loading.value = false
      emit('update:imgSrc', info.file.url)
    } else if (info.file.status === 'error') {
      loading.value = false
      onlyMessage(msg + $t('upload.upload.283727-12'), 'error')
    }
  },

/**
 * logo上传change事件
 * @param info 上传信息
 */
  changeLogoUpload: (info: any) => {
    uploadInfo.changUpload(info, $t('upload.upload.283727-13'))
  },

/**
 * 浏览器页签上传change事件
 * @param info 上传信息
 */
  changeIcoUpload: (info: any) => {
    uploadInfo.changUpload(info, $t('upload.upload.283727-14'))
  },

/**
 * 背景图片上传change事件
 * @param info 上传信息
 */
  changeBackgroundUpload: (info: any) => {
    uploadInfo.changUpload(info, $t('upload.upload.283727-15'))
  },

/**
 * logo 上传验证
 * @param file 上传文件
 */
  isLogoImage: (file: File) => {
    return uploadInfo.isImageType(file) && uploadInfo.isImageLessSize(file, 4)
  },

/**
 * icon 上传验证
 * @param file 上传文件
 */
  isIcoImage: (file: File) => {
    return uploadInfo.isIcoType(file) && uploadInfo.isImageLessSize(file, 1)
  },

/**
 * 背景图片上传验证
 * @param file 上传文件
 */
  isBackground: (file: File) => {
    return uploadInfo.isImageType(file) && uploadInfo.isImageLessSize(file, 4)
  }
}

</script>

<style lang="less" scoped>
.upload {
    flex: 1;
    width: inherit;
    overflow: hidden;
    .upload-div {
      width: 160px;
      background-color: #eeeeee;
        .upload-mask{
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          width: inherit;
          height: 160px;
          color: white;
          font-size: 16px;
          background-color: rgba(0, 0, 0, 0.35);
          display: none;
      }
      &:hover .upload-mask {
          display: flex;
      }
      #upload-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
      }
    }
    .uploadTip {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 1.5715;
    }
}
</style>
