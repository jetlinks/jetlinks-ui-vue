<template>
  <a-button type="primary" ghost @click="showImport">
    <template #icon>
      <AIcon type="DownloadOutlined"/>
    </template>
    {{ $t('Import.Import.6916344-0') }}
  </a-button>
  <a-modal
    v-if="visible"
    visible
    :title="step === 1 ? $t('Import.Import.6916344-1') : $t('Import.Import.6916344-2')"
    :width="600"
    :keyboard="false"
    :maskClosable="false"
    :okButtonProps="{
      disabled: step !== 3
    }"
    :getContainer="modalContainer"
    @cancel="onCancel"
    @ok="onOk"
  >
    <a-form v-if="step === 1" layout="vertical">
      <a-form-item :label="$t('Import.Import.6916344-3')">
        <a-upload-dragger
          name="file"
          :headers="{[TOKEN_KEY]: LocalStore.get(TOKEN_KEY)}"
          :maxCount="1"
          :showUploadList="false"
          :accept="'.xlsx,.csv'"
          :before-upload="beforeUpload"
          @change="uploadChange"
          @drop="handleDrop"
        >
          <div class="dragger-box">
            <AIcon class="icon" type="PlusCircleFilled"/>
            <span style="margin: 16px 0 8px 0">{{ $t('Import.Import.6916344-4') }}</span>
            <span>{{ $t('Import.Import.6916344-5') }}</span>
          </div>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item :label="$t('Import.Import.6916344-6')">
        <div class="file-download">
          <j-button class="btn" @click="downFile('xlsx')">{{ $t('Import.Import.6916344-7') }}</j-button>
          <j-button class="btn" @click="downFile('csv')">{{ $t('Import.Import.6916344-8') }}</j-button>
        </div>
      </a-form-item>
    </a-form>
    <div v-else-if="step === 2">
      <span>
        {{ $t('Import.Import.6916344-9') }}
      </span>
    </div>
    <div v-else>
      <div>
        {{ $t('Import.Import.6916344-10') }} {{ successCount }}{{ $t('Import.Import.6916344-11') }}
      </div>
      <div>
        {{ $t('Import.Import.6916344-12') }} {{ errorCount }}{{ $t('Import.Import.6916344-11') }}
      </div>
    </div>
  </a-modal>
</template>

<script setup name="MetadataImport">
import {TOKEN_KEY, TOKEN_KEY_URL} from '@/utils/variable';
import {getToken, isFullScreen, LocalStore, onlyMessage} from '@/utils/comm';
import {validate} from './util'
import { getTemplate, uploadAnalyzeMetadata} from '@/api/device/instance'
import {getTemplate as getProductTemplate} from '@/api/device/product'
import {downloadFileByUrl} from "@/utils/utils";
import {useGroupActive, useTableWrapper} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const props = defineProps({
  target: {
    type: String,
    default: undefined
  },
  metadata: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['ok'])

const visible = ref(false);
const successCount = ref(0);
const errorCount = ref(0);
const step = ref(1)
const groupActive = useGroupActive()
const tableWrapperRef = useTableWrapper()

let submitMetadata = []

const route = useRoute()

const modalContainer = (e) => {
  if (isFullScreen()) {
    return tableWrapperRef.value || document.body
  }
  return document.body
}

const init = () => {
  step.value = 1
  successCount.value = 0
  errorCount.value = 0
}

const showImport = () => {
  init()
  visible.value = true
}

const onCancel = () => {
  visible.value = false
}

const submitData = async (metadataStr) => {
  console.log(metadataStr)
  if (metadataStr) {
    const _metadataObject = JSON.parse(metadataStr || "{}")
    const properties = _metadataObject.properties
    const _metadata = props.metadata.filter(item => item.id && !item.expands?.isProduct)
    const result = properties.map(item => {
      if (item.expands) {
        item.expands.groupId = groupActive.value
        item.expands.groupName = groupActive.label
      } else {
        item.expands = {
          groupId: groupActive.value,
          groupName: groupActive.label,
        }
      }
      return item
    })

    submitMetadata = validate(result, _metadata, (validate) => {
      if (validate) {
        successCount.value += 1
      } else {
        errorCount.value += 1
      }
    })
    step.value = 3
  } else {
    onlyMessage($t('Import.Import.6916344-13'), 'error');
  }
};

const onOk = () => {
  emit('ok', submitMetadata)
  visible.value = false
}

const downFile = (type) => {
  const url = props.target === 'device' ? getTemplate(route.params.id, type) : getProductTemplate(route.params.id, type)

  downloadFileByUrl(url + `?${TOKEN_KEY_URL}=${getToken()}`, $t('Import.Import.6916344-14'), type)
}

const handleDrop = () => {
};

const beforeUpload = (file) => {
  const isCsv = file.type === 'text/csv';
  const isXlsx =
    file.type ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (!isCsv && !isXlsx) {
    onlyMessage($t('Import.Import.6916344-15'), 'warning');
  }

  const formData = new FormData()

  formData.append('file', file)

  step.value = 2
  uploadAnalyzeMetadata(formData).then(res => {
    if (res.success) {
      submitData(res.result)
    }
  })

  // return isCsv || isXlsx;

  return false
};


const uploadChange = async (info) => {
  console.log(info)
  if (info.file.status === 'uploading') {
    step.value = 2
  }
  if (info.file.status === 'done') {
    const resp = info.file.response || {result: {}};
    await submitData(resp?.result || '');
  }
  if (info.file.status === 'error') {
    onlyMessage($t('Import.Import.6916344-16'), 'error');
  }
};
</script>

<style scoped lang="less">
.dragger-box {
  margin: 46px 0;
  display: flex;
  flex-direction: column;
  color: #666666;

  .icon {
    font-size: 30px;
    color: @primary-color;
  }
}

.file-download {
  display: flex;
  gap: 16px;

  .btn {
    border: none;
    background-color: #ECECF0;
    width: 152px;
    color: #666666;
  }
}
</style>
