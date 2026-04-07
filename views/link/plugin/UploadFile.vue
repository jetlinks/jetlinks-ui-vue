<template>
  <a-upload
      name="file"
      accept=".jar,.zip"
      :action="uploadFile()"
      :headers="{
            [TOKEN_KEY]: getToken(),
        }"
      @change="handleChange"
      class="upload-box"
      :before-upload="beforeUpload"
      :disabled="uploading"
      :maxCount="1"
      :fileList="list"
      @remove="remove"
  >
    <div>
      <a-button :disabled="uploading">{{ $t('plugin.UploadFile.628586-0') }}</a-button>
      <span class="upload-tip">{{ $t('plugin.UploadFile.628586-1') }}</span>
    </div>
  </a-upload>
  <template v-if="uploading">
    <a-spin size="small"/>
    {{ $t('plugin.UploadFile.628586-2') }}
  </template>
</template>

<script setup lang="ts" name="FileUpload">
import {getToken, onlyMessage} from '@jetlinks-web/utils';
import {TOKEN_KEY} from '@jetlinks-web/constants';
import {uploadFile} from '../../../api/link/plugin';
import type {UploadChangeParam, UploadProps} from 'ant-design-vue';
import {notification as Notification} from 'ant-design-vue';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const emit = defineEmits(['update:modelValue', 'change','update:uploading']);

const props = defineProps({
  modelValue: {
    type: String,
    default: () => '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fileName: {
    type: String,
    default: undefined,
  },
  uploading: {
    type: Boolean,
    default: false,
  }
});

const value = ref(props.modelValue);
const list = ref<any>(props.fileName ? [{name: props.fileName}] : []);
const fileCache = ref();
const remove = () => {
  list.value = [];
  emit('update:modelValue', '');
  emit('change', {});
};

const beforeUpload: UploadProps['beforeUpload'] = (file, fl) => {
  const arr = file.name.split('.');
  const isFile = ['jar', 'zip'].includes(arr[arr.length - 1]); // file.type === 'application/zip' || file.type === 'application/javj-archive'
  if (!isFile) {
    onlyMessage($t('plugin.UploadFile.628586-3'), 'error');
    emit('update:uploading', false);
    return false;
  }
  list.value = fl;
  return isFile;
};
const handleChange = async (info: UploadChangeParam) => {
  emit('update:uploading', true);
  if (info.file.status === 'done') {
    emit('update:uploading', false);
    const result = info.file.response?.result;
    const f = result.accessUrl;
    onlyMessage($t('plugin.UploadFile.628586-4'), 'success');
    value.value = f;
    fileCache.value = info.fileList;
    emit('update:modelValue', result.version);
    emit('change', result);
  } else {
    if (info.file.error) {
      list.value = fileCache.value;
      Notification.error({
        // key: '403',
        message: $t('plugin.UploadFile.628586-5'),
        description: info.file.response?.message,
      });
      // emit('update:modelValue', { err:'file_upload_error'});
      emit('update:uploading', false);
    } else if (info.file.response) {
      emit('update:uploading', false);
    }
  }
};
</script>

<style lang="less" scoped>
.upload-tip {
  color: #999;
  padding-left: 12px;
}
</style>
