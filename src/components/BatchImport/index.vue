<template>
  <a-modal open :title="$t('BatchImport.index.250528-1')" :width="width" :mask-closable="false" @cancel="emits('close')">
    <slot name="alert">
      <div class="alert" v-if="message">
        <div>
          <AIcon type="InfoCircleFilled" style="color: #2F54EB; margin-right: 10px;"/>
        </div>
        <span v-html="message"></span>
      </div>
    </slot>
    <slot name="content"></slot>
    <p>{{ $t('BatchImport.index.250528-2') }}</p>
    <a-upload-dragger
        v-model:fileList="value"
        name="file"
        :action="FileStaticPath"
        :headers="{
            [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
        }"
        :maxCount="1"
        :showUploadList="false"
        @change="uploadChange"
        :accept="'.xlsx,.csv'"
        :before-upload="beforeUpload"
        :disabled="disabled"
    >
      <div class="draggable-box">
        <AIcon class="icon" type="PlusCircleFilled"/>
        <span style="margin: 16px 0 8px 0">{{ $t('BatchImport.index.250528-3') }}</span>
        <span>{{ $t('BatchImport.index.250528-4') }}</span>
      </div>
    </a-upload-dragger>
    <div class="result" v-if="loading">
      <div v-if="result.loading">
        <a-spin size="small" style="margin-right: 10px"/>
        {{ $t('BatchImport.index.250528-5') }}
      </div>
      <div v-else>
        <AIcon style="color: #08e21e; margin-right: 10px;font-size: 16px;" type="CheckCircleOutlined"/>
        {{ $t('BatchImport.index.250528-6') }}
      </div>
      <div>{{ $t('BatchImport.index.250528-7') }}{{ result.success }}</div>
      <div>
        {{ $t('BatchImport.index.250528-8') }}<span style="color: #ff595e">{{ result.error }}</span>
        <a
            v-if="result.errMessage && result.error > 0"
            style="margin-left: 20px"
            @click="downError"
        >
          {{ $t('BatchImport.index.250528-9') }}
        </a>
      </div>
    </div>
    <div class="file-download" v-if="downloadUrlBuilder">
      <p>{{ $t('BatchImport.index.250528-10') }}</p>
      <a-space>
        <a-button :loading="templateLoading" ghost type="primary" @click="downTemplate('xlsx')">
          {{ $t('BatchImport.index.250528-11') }}
        </a-button>
        <a-button :loading="templateLoading" ghost type="primary" @click="downTemplate('csv')">
          {{ $t('BatchImport.index.250528-12') }}
        </a-button>
      </a-space>
    </div>

    <template #footer>
      <a-button :loading="result.loading" @click="emits('close')">{{ $t('Detail.index.551010-9') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup name="BatchImport">
import {FileStaticPath} from "@/api/comm";
import {TOKEN_KEY} from "@jetlinks-web/constants";
import {downloadFileByUrl, LocalStore, onlyMessage} from "@jetlinks-web/utils";
import {useI18n} from "vue-i18n";

const props = defineProps({
  beforeUpload: {
    type: Function,
    default: undefined
  },
  message: {
    type: String,
    default: '',
  },
  downloadUrlBuilder: {
    type: Function,
    default: undefined
  },
  templateName: {
    type: String,
    default: ''
  },
  request: {
    type: Function,
    default: undefined
  },
  width: {
    type: Number || String,
    default: 600
  },
})
const emits = defineEmits(['close', 'save'])

const {t: $t} = useI18n();
const value = ref()
const loading = ref(false)
const result = reactive({
  loading: false,
  success: 0,
  error: 0,
  errMessage: undefined
})
const disabled = ref(false)
const templateLoading = ref(false)

const submitData = (url) => {
  if (props.request) {
    result.loading = true
    result.success = 0
    result.error = 0
    result.errMessage = undefined
    props.request(url).subscribe({
      next: data => {// 处理数据
        console.log('Received data:', data)
        if(data.success ){
          result.success = data.result.total
        }else{
          if(data.detailFile){
            result.errMessage = data.detailFile
          }else{
            result.error = data.result.total
          }
        }
        
        // if(data.success) {
        //   result.success = data.result.added + data.result.updated
        // } else if(!data.success && data.rowNumber !== -1) {
        //   result.error = data.result.total
        // } else if(!data.success && data.rowNumber === -1) {
        //   result.errMessage = data.detailFile
        // }
        // result.success
      },
      error: err => {
        console.error('Error:', err)
        //   result.error
        // result.errMessage
      },
      complete: () => {
        console.log('Stream complete')
        emits('save')
        disabled.value = false
        result.loading = false
      }
    });
  } else {
    disabled.value = false
  }
}

const uploadChange = async (info) => {
  disabled.value = true;
  loading.value = true
  if (info.file.status === 'done') {
    const resp = info.file.response?.result || {accessUrl: ''};
    submitData(resp?.accessUrl || '');
  } else {
    disabled.value = false;
  }
}

const beforeUpload = (_file, fileList) => {
  if (props.beforeUpload) {
    return props.beforeUpload(_file, fileList)
  }
  const isCsv = _file.type === 'text/csv';
  const isXlsx = _file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (!isCsv && !isXlsx) {
    onlyMessage($t('BatchImport.index.250528-13'), 'warning');
  }
  return isCsv || isXlsx;
};

const downError = () => {
  window.open(result.errMessage);
};

const downTemplate = async (type) => {
  templateLoading.value = true;
  const resp = await props.downloadUrlBuilder(type).finally(() => {
    templateLoading.value = false;
  })
  if (resp) {
    const blob = new Blob([resp], {type: type});
    const url = URL.createObjectURL(blob);
    downloadFileByUrl(url, props.templateName || '导入模板', type);
  }
};
</script>

<style lang="less" scoped>
.alert {
  padding: 6px 12px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  margin-bottom: 16px;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
}

.draggable-box {
  margin: 46px 0;
  display: flex;
  flex-direction: column;
  color: #666666;
  align-items: center;
  .icon {
    font-size: 30px;
    color: @primary-color;
  }
}

.result, .file-download {
  margin-top: 16px;
}
</style>
