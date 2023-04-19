<template>
  <j-upload
    name="file"
    accept=".jar"
    :action="uploadFile"
    :headers="{
                [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
            }"
    @change="handleChange"
    class="upload-box"
    :before-upload="beforeUpload"
    :disabled='loading'
    :maxCount='1'
  >
    <div>
      <j-button>上传文件</j-button>
      <span class='upload-tip'>格式要求：{文件名}.jar/{文件名}.zip</span>
    </div>
  </j-upload>

</template>

<script setup lang="ts" name="FileUpload">
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { uploadFile } from '@/api/link/plugin';
import { onlyMessage } from '@/utils/comm';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { notification as Notification } from 'jetlinks-ui-components';
import { useSystem } from '@/store/system';

const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
  modelValue: {
    type: String,
    default: () => '',
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const paths: string = useSystem().$state.configInfo.paths?.[
  'base-path'
  ] as string;

const value = ref(props.modelValue);
const loading = ref(false);

const beforeUpload: UploadProps['beforeUpload'] = (file, fl) => {
  const arr = file.name.split('.');
  const isFile = ['jar', 'zip'].includes(arr[arr.length - 1]); // file.type === 'application/zip' || file.type === 'application/javj-archive'
  if (!isFile) {
    onlyMessage('请上传.jar,.zip格式的文件', 'error');
    loading.value = false;
  }
  return isFile;
};
const handleChange = async (info: UploadChangeParam) => {
  loading.value = true;
  if (info.file.status === 'done') {
    loading.value = false;
    console.log(info.file)
    const result = info.file.response?.result;
    const f = result.accessUrl;
    onlyMessage('上传成功！', 'success');
    value.value = f;
    emit('update:modelValue', result.version);
    emit('change', result);
  } else {
    if (info.file.error) {
      Notification.error({
        // key: '403',
        message: '系统提示',
        description: '系统未知错误，请反馈给管理员',
      });
      loading.value = false;
    } else if (info.file.response) {
      loading.value = false;
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
