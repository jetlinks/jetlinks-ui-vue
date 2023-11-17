<template>
    <j-modal visible title="导入" @cancel="emit('closeImport')" @ok="emit('closeImport')" :width="800" :maskClosable="false">
        <div class="import-content">
            <div class="column">
                <p>上传文件</p>
                <div class="import">
                    <a-upload-dragger v-model:fileList="fileList" name="file" :action="`${FILE_UPLOAD}?options=tempFile`"
                        :headers="{
                            'X-Access-Token': LocalStore.get(TOKEN_KEY),
                        }" :limit="1" :showUploadList="false" @change="uploadChange" :accept="['xlsx', 'xls', 'csv']"
                        :before-upload="beforeUpload">
                        <div class="dragger-box">
                            <AIcon class="icon" type="PlusCircleFilled" />
                            <span style="margin: 16px 0 8px 0">点击或拖拽上传文件</span>
                            <span>格式：.xlsx, .csv</span>
                        </div>
                    </a-upload-dragger>
                </div>
            </div>
            <div class="importing-status" v-if="importStatus == 'importing'">
                    <loading-outlined />
                正在导入
            </div>
            <div class="column" v-if="importStatus != 'wait'">
                <p>
                    <check-outlined style="color: #00a4ff" />导入成功 总数量
                    {{ successNumber }}
                </p>
                <span v-if="failNumber">
                    <close-outlined style="color: #e50012" />导入失败 总数量
                    {{ failNumber }}
                </span>
            </div>
            <div class="column">
                <p>Excel导入模板</p>
                    <div class="file-download">
                        <j-button @click="downTemplate('xlsx')"  class="btn">
                            下载模板
                        </j-button>
                    </div>
            </div>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CloseOutlined,
    LoadingOutlined,
} from '@ant-design/icons-vue';
import { FILE_UPLOAD } from '@/api/comm';
import { TOKEN_KEY, BASE_API_PATH } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';
import {
    exportTemplate
} from '@/api/data-collect/collector';
import { downloadFileByUrl } from '@/utils/utils';
import { getToken } from '@/utils/comm';
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
})
const emit = defineEmits(['closeImport'])
const fileList = ref()
type ImportStatus = 'wait' | 'importing' | 'done';
const importStatus = ref<ImportStatus>('wait'); //导入进度
const successNumber = ref(0); //导入成功数量
const failNumber = ref(0); //导入失败数量
const errorMessage = ref();
const detailFile = ref('')
const uploadChange = async (info: Record<string, any>) => {
    if (info.file.status === 'done') {
        const resp: any = info.file.response || { result: '' };
        handleImport(resp)
    }
};

const beforeUpload = (_file: any) => {
    const fileType = ['xlsx', 'xls', 'csv']
    console.log(_file.type)
    const isCsv = _file.type === 'text/csv';
    // const isXlsx =
    //     _file.type ===
    //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // if (!isCsv && fileType !== 'xlsx') {
    //     onlyMessage('请上传.csv格式文件', 'warning');
    // }
    // if (!isXlsx && fileType !== 'csv') {
    //     onlyMessage('请上传.xlsx格式文件', 'warning');
    // }
    // return (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv');
};
const downTemplate = async (type: string) => {
    const res: any = await exportTemplate(<string>props.data?.provider, type);
    if (res) {
        const blob = new Blob([res], { type: type });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(url, `${props.data?.provider}导入模版`, type);
    }
};
const handleImport = async (file: any) => {
    let message: any = []
    importStatus.value = 'importing';
    let event: EventSource
    event = new EventSource(
        `${BASE_API_PATH}/data-collect/point/${props.data?.collectorId
        }/${props.data?.provider}/import?:X_Access_Token=${getToken()
        }&fileUrl=${file.result}`,
        { withCredentials: true },
    );
    event.onopen = (e) => {
        // pushMessage.value = []
        console.log('open');
    };
    event.onmessage = (e) => {
        console.log(e, '123')
        const result = JSON.parse(e.data);
        if (result.success) {
            successNumber.value++;
        } else {
            if (result.rowNumber !== -1) {
                failNumber.value++;
                message.push({
                    rowNumber: `第${result.rowNumber}行`,
                    message: result.message,
                    name: result.name
                })
                errorMessage.value = JSON.stringify(message)
            } else {
                detailFile.value = result.detailFile;
            }
        }
    };
    event.onerror = (err) => {
        importStatus.value = 'done';
        event.close();
    };
};


</script>
<style lang="less" scoped>
.import-content {
    width: 100%;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;

    .column {
        width: 100%;
        margin-bottom: 20px;
        position: relative;

        span {
            flex: 1;
        }

        .import {
            display: flex;
            justify-content: space-between;
        }
        .importing-status {
            align-items: center;
        }
        &.last {
            margin-top: 135px;
        }
    }

    :deep(.ant-upload-select) {
        width: 100% !important;
        display: block !important;
    }

    .ant-row {
        width: 100%;
    }

    :deep(.ant-btn) {
        width: 100%;
        background-color: transparent;

        &.ant-btn-link {
            width: auto;
        }
    }
}

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
}</style>