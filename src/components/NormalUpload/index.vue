<template>
    <j-space align="end">
        <j-upload
            v-model:fileList="modelValue.upload"
            name="file"
            :action="FILE_UPLOAD"
            :headers="{
                [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
            }"
            :maxCount="1"
            :showUploadList="false"
            @change="uploadChange"
            :accept="
                props?.file?.fileType ? `.${props?.file?.fileType}` : '.xlsx'
            "
            :before-upload="beforeUpload"
        >
            <j-button>
                <template #icon><AIcon type="UploadOutlined" /></template>
                文件上传
            </j-button>
        </j-upload>
        <div style="margin-left: 20px">
            <j-space>
                下载模板
                <a @click="downFile('xlsx')">.xlsx</a>
                <a @click="downFile('csv')">.csv</a>
            </j-space>
        </div>
    </j-space>
    <div style="margin-top: 20px" v-if="importLoading">
        <j-badge v-if="flag" status="processing" text="进行中" />
        <div v-else>
            <div>
                <j-space size="large">
                    <j-badge status="success" text="已完成" />
                    <span>总数量：{{ count }}</span>
                </j-space>
            </div>
            <div>
                <j-space size="large">
                    <j-badge status="error" text="失败&emsp;" />
                    <span>总数量：{{ failCount }}</span>
                    <a :href="detailFile" v-if="failCount">下载</a>
                </j-space>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FILE_UPLOAD } from '@/api/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import {
    deviceImport,
    templateDownload,
} from '@/api/device/instance';
import { EventSourcePolyfill } from 'event-source-polyfill';

type Emits = {
    (e: 'update:modelValue', data: string[]): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    // 组件双向绑定的值
    modelValue: {
        type: Array,
        default: () => [],
    },
    product: {
        type: String,
        default: '',
    },
    file: {
        type: Object,
        default: () => {
            return {
                fileType: 'xlsx',
                autoDeploy: false,
            };
        },
    },
    url: {
        type: Object,
        default: () => {
            return {
                fileType: 'xlsx',
                autoDeploy: false,
            };
        },
    },
});

const importLoading = ref<boolean>(false);
const flag = ref<boolean>(false);
const count = ref<number>(0);
const failCount = ref(0);
const errMessage = ref<string>('');
const detailFile = ref('');

const downFile = async (type: string) => {
    const res: any = await templateDownload(props.product, type);
    if (res) {
        const blob = new Blob([res], { type: type });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(url, `设备导入模板`, type);
    }
};

const beforeUpload = (_file: any) => {
    const fileType = props?.file?.fileType === 'csv' ? 'csv' : 'xlsx';
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
        failCount.value = 0;
        errMessage.value = '';
        flag.value = true;
        const autoDeploy = !!props?.file?.autoDeploy || false;
        importLoading.value = true;
        let dt = 0;
        const source = new EventSourcePolyfill(
            deviceImport(props.product, fileUrl, autoDeploy),
        );
        source.onmessage = (e: any) => {
            const res = JSON.parse(e.data);
            if (res.success) {
                const temp = res.result.total;
                dt += temp;
                count.value = dt;
            } else if(!res.success && !res.detailFile) {
                failCount.value++;
                errMessage.value = res.message || '失败';
            } else if(res.detailFile) {
                detailFile.value = res.detailFile;
            }
        };
        source.onerror = (e: { status: number }) => {
            if (e.status === 403) errMessage.value = '暂无权限，请联系管理员';
            flag.value = false;
            source.close();
        };
        source.onopen = () => {};
    } else {
        onlyMessage('请先上传文件', 'error');
    }
};

const uploadChange = async (info: Record<string, any>) => {
    if (info.file.status === 'done') {
        const resp: any = info.file.response || { result: '' };
        await submitData(resp?.result || '');
    }
};
</script>
