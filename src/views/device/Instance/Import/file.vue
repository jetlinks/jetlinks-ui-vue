<template>
  <div class='file'>
    <j-form layout='vertical'>
      <j-form-item label='文件格式' >
        <div class='file-type-label'>
          <a-radio-group class='file-type-radio' v-model:value="modelRef.file.fileType" >
            <a-radio-button value="xlsx">xlsx</a-radio-button>
            <a-radio-button value="csv">csv</a-radio-button>
          </a-radio-group>
          <a-checkbox v-model:checked="modelRef.file.autoDeploy">自动启用</a-checkbox>
        </div>
      </j-form-item>
      <j-form-item label="文件上传">
        <j-upload
          v-model:fileList="modelRef.upload"
          name="file"
          :action="FILE_UPLOAD"
          :headers="{
                  'X-Access-Token': LocalStore.get(TOKEN_KEY),
              }"
          :maxCount="1"
          :showUploadList="false"
          @change="uploadChange"
          :accept="
                  modelRef?.file?.fileType ? `.${modelRef?.file?.fileType}` : '.xlsx'
              "
          :before-upload="beforeUpload"
          :disabled='disabled'
        >
          <j-button style='width: 760px;'>
            <template #icon><AIcon type="UploadOutlined" /></template>
            上传文件
          </j-button>
        </j-upload>
      </j-form-item>
      <j-form-item label='下载模板'>
        <div class='file-download'>
          <j-button @click="downFile('xlsx')">.xlsx</j-button>
          <j-button @click="downFile('csv')">.csv</j-button>
        </div>
      </j-form-item>
    </j-form>
    <div v-if="importLoading">
      <j-badge v-if="flag" status="processing" text="进行中" />
      <j-badge v-else status="success" text="已完成" />
      <span>总数量：{{ count }}</span>
      <p style="color: red">{{ errMessage }}</p>
    </div>
  </div>
</template>

<script setup lang='ts' name='DeviceImportFile'>
import { FILE_UPLOAD } from '@/api/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import {
  deviceImport,
  templateDownload,
} from '@/api/device/instance';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { message } from 'jetlinks-ui-components'

const props = defineProps({
  product: {
    type: String,
    default: undefined
  }
})

const modelRef = reactive({
  product: props.product,
  upload: [],
  file: {
    fileType: 'xlsx',
    autoDeploy: false,
  },
});

const importLoading = ref<boolean>(false);
const flag = ref<boolean>(false);
const count = ref<number>(0);
const errMessage = ref<string>('');
const disabled = ref(false)

const downFile = async (type: string) => {
  const res: any = await templateDownload(props.product!, type);
  if (res) {
    const blob = new Blob([res], { type: type });
    const url = URL.createObjectURL(blob);
    downloadFileByUrl(url, `设备导入模板`, type);
  }
};

const beforeUpload = (_file: any) => {
  const fileType = modelRef.file?.fileType === 'csv' ? 'csv' : 'xlsx';
  const isCsv = _file.type === 'text/csv';
  const isXlsx = _file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (!isCsv && fileType !== 'xlsx') {
    onlyMessage('请上传.csv格式文件', 'warning');
  }
  if (!isXlsx && fileType !== 'csv') {
    onlyMessage('请上传.xlsx格式文件', 'warning');
  }
  return (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv');
};

const submitData = async (fileUrl: string) => {
  if (!!fileUrl) {
    count.value = 0;
    errMessage.value = '';
    const autoDeploy = !!modelRef?.file?.autoDeploy || false;
    importLoading.value = true;
    let dt = 0;
    const source = new EventSourcePolyfill(
      deviceImport(props.product!, fileUrl, autoDeploy),
    );
    source.onmessage = (e: any) => {
      const res = JSON.parse(e.data);
      if (res.success) {
        const temp = res.result.total;
        dt += temp;
        count.value = dt;
      } else {
        errMessage.value = res.message || '失败';
      }
      disabled.value = false
    };
    source.onerror = (e: { status: number }) => {
      if (e.status === 403) errMessage.value = '暂无权限，请联系管理员';
      flag.value = false;
      disabled.value = false
      source.close();
    };
    source.onopen = () => {};
  } else {
    message.error('请先上传文件');
  }
};

const uploadChange = async (info: Record<string, any>) => {
  disabled.value = true
  console.log(info.file)
  if (info.file.status === 'done') {
    const resp: any = info.file.response || { result: '' };
    await submitData(resp?.result || '');
  }
};

</script>

<style scoped lang='less'>
.file {
  .file-type-label {
    display: flex;
    gap: 16px;
    align-items: center;

    .file-type-radio {
      display: flex;
      flex-grow: 1;

      :deep(.ant-radio-button-wrapper) {
        width: 50%;
      }
    }
  }

  .file-download {
    display: flex;
    gap: 16px;
    >button {
      flex: 1;
      min-width: 0;
    }
  }
}
</style>