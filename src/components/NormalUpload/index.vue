<template>
    <a-space align="end">
        <a-upload
            v-model:fileList="modelValue.upload"
            name="file"
            :action="FILE_UPLOAD"
            :headers="{
                'X-Access-Token': LocalStore.get(TOKEN_KEY)
            }"
            accept=".xlsx,.csv"
            :maxCount="1"
            :showUploadList="false"
            @change="uploadChange"
        >
            <a-button>
                <template #icon><AIcon type="UploadOutlined" /></template>
                文件上传
            </a-button>
        </a-upload>
        <div style="margin-left: 20px">
            <a-space>
                <a @click="downFile('xlsx')">.xlsx</a>
                <a @click="downFile('csv')">.csv</a>
            </a-space>
        </div>
    </a-space>
    <div style="margin-top: 20px" v-if="importLoading">
        <a-badge v-if="flag" status="processing" text="进行中" />
        <a-badge v-else status="success" text="已完成" /> 
        <span>总数量：{{count}}</span>
        <p style="color: red">{{errMessage}}</p>
    </div>
</template>

<script lang="ts" setup>
import { FILE_UPLOAD } from '@/api/comm'
import { TOKEN_KEY  } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';
import { downloadFile } from '@/utils/utils';
import { deviceImport, deviceTemplateDownload } from '@/api/device/instance'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { message } from 'ant-design-vue';

type Emits = {
    (e: 'update:modelValue', data: string[]): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    // 组件双向绑定的值
    modelValue: {
        type: Array,
        default: () => []
    },
    product: {
        type: String,
        default: ''
    },
    file: {
        type: Object,
        default: () => {
            return {
                fileType: 'xlsx',
                autoDeploy: false,
            }
        }
    }
})

const importLoading = ref<boolean>(false)
const flag = ref<boolean>(false)
const count = ref<number>(0)
const errMessage = ref<string>('')

const downFile = (type: string) => {
    downloadFile(deviceTemplateDownload(props.product, type));
}

const submitData = async (fileUrl: string) => {
    if (!!fileUrl) {
      count.value = 0
      errMessage.value = ''
      flag.value = true
      const autoDeploy = !!props?.file?.autoDeploy || false;
      importLoading.value = true
      let dt = 0;
      const source = new EventSourcePolyfill(deviceImport(props.product, fileUrl, autoDeploy));
      source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        if (res.success) {
          const temp = res.result.total;
          dt += temp;
          count.value = dt
        } else {
          errMessage.value = res.message || '失败'
        }
      };
      source.onerror = (e: { status: number; }) => {
        if (e.status === 403) errMessage.value = '暂无权限，请联系管理员'
        flag.value = false
        source.close();
      };
      source.onopen = () => {};
    } else {
      message.error('请先上传文件')
    }
}

const uploadChange = async (info: Record<string, any>) => {
    if (info.file.status === 'done') {
        const resp: any = info.file.response || { result: '' };
        await submitData(resp?.result || '');
    }
}

</script>