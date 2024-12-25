<template>
  <a-modal
      :title="title"
      visible
      :width="400"
      @cancel="cancel"
      @ok="ok"
      :confirmLoading="loading"
  >
    <div style="height: 300px; width: 100%;">
      <vue-cropper
          ref="cropper"
          :img="img"
          :fixed-box="true"
          :autoCrop="true"
          :auto-crop-width="200"
          :auto-crop-height="200"
          outputType="jpg"
      ></vue-cropper>
    </div>
  </a-modal>
</template>

<script setup lang="ts" name="UploadCropper">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper';
import { fileUpload } from '@/api/comm';
import i18n from '@/locales';

const props = defineProps({
  img: {
    type: String
  },
  title: {
    type: String,
    default: i18n.global.t('Upload.Cropper.282287-0')
  }
})

const emit = defineEmits(['cancel', 'ok'])

const imgUrl = ref()
const cropper = ref()
const loading = ref(false)

const ok = () => {
  cropper.value.getCropBlob(async (data: Blob) => {
    console.log(data)
    let formData = new FormData()
    formData.append('file', data, new Date().getTime() + '.jpg')

    imgUrl.value = data
    loading.value = true
    fileUpload(formData).then(res => {
      if (res.success) {
        emit('ok', res.result.accessUrl)
      }
    }).finally(() => {
      loading.value = false
    })
  })

}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>

</style>
