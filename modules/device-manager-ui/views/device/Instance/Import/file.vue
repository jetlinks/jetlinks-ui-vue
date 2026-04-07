<template>
    <div class="file">
        <a-form layout="vertical">
            <a-form-item>
                <template #label>
                    <div>
                        {{ $t('Import.file.677857-0') }}
                        <div class="alert"><AIcon style="margin-right: 5px;" type="InfoCircleOutlined" />{{ $t('Import.file.677857-1') }}</div>
                    </div>
                </template>

                <a-upload-dragger
                    v-model:fileList="modelRef.upload"
                    name="file"
                    :action="FileStaticPath()"
                    :headers="getUploadHeaders()"
                    :maxCount="1"
                    :showUploadList="false"
                    @change="uploadChange"
                    :accept="'.xlsx,.csv'"
                    :before-upload="beforeUpload"
                    :disabled="disabled"
                    @drop="handleDrop"
                >
                    <div class="dragger-box">
                        <AIcon class="icon" type="PlusCircleFilled" />
                        <span style="margin: 16px 0 8px 0">{{ $t('Import.file.677857-2') }}</span>
                        <span>{{ $t('Import.file.677857-3') }}</span>
                    </div>
                </a-upload-dragger>
            </a-form-item>
            <div style="margin-bottom: 16px">
                <a-checkbox v-model:checked="modelRef.file.autoDeploy"
                    >{{ $t('Import.file.677857-4') }}</a-checkbox
                >
            </div>
            <div v-if="importLoading" class="result">
                <div v-if="flag">
                    <a-spin size="small" style="margin-right: 10px" />{{ $t('Import.file.677857-5') }}
                </div>
                <div v-else>
                    <AIcon
                        style="
                            color: #08e21e;
                            margin-right: 10px;
                            font-size: 16px;
                        "
                        type="CheckCircleOutlined"
                    />{{ $t('Import.file.677857-6') }}
                </div>
                <div>{{ $t('Import.file.677857-7') }}{{ count }} {{ $t('Import.file.677857-8') }}</div>
                <div>
                    {{ $t('Import.file.677857-9') }}<span style="color: #ff595e">{{ errCount }}</span>
                    {{ $t('Import.file.677857-8') }}<a
                        v-if="errMessage && !flag && errCount > 0"
                        style="margin-left: 20px"
                        @click="downError"
                        >{{ $t('Import.file.677857-10') }}</a
                    >
                </div>
            </div>
            <a-form-item :label="$t('Import.file.677857-11')">
                <div class="file-download">
                    <a-button class="btn" @click="downFile('xlsx')">{{ $t('Import.file.677857-12') }}</a-button>
                    <a-button class="btn" @click="downFile('csv')">{{ $t('Import.file.677857-13') }}</a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang='ts' name='DeviceImportFile'>
import {inject,Ref} from 'vue'
import { FileStaticPath } from '@jetlinks-web-core/api/comm';
import { onlyMessage, downloadFileByUrl } from '@jetlinks-web/utils';
import { deviceImport, pluginDeviceImport, templateDownload } from '../../../../api/instance';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useI18n } from 'vue-i18n';
import {getUploadHeaders} from "@jetlinks-web-core/utils";

const { t: $t } = useI18n();
const props = defineProps({
    product: {
        type: String,
        default: undefined,
    },
    accessProvider: {
        type: String,
        default: undefined,
    }
});

const modelRef = reactive({
    product: props.product,
    upload: [],
    file: {
        fileType: 'xlsx',
        autoDeploy: false,
    },
});

const importLoading = ref<boolean>(false);
const flag = inject("flag") as Ref<boolean>;
const count = ref<number>(0);

const errCount = ref<number>(0);
const errMessage = ref<string>('');
const disabled = ref(false);

const downFile = async (type: string) => {
    const res: any = await templateDownload(props.product!, type);
    if (res) {
        const blob = new Blob([res], { type: type });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(url, $t('Import.file.677857-14'), type);
    }
};

const beforeUpload = (_file: any) => {
    // const fileType = modelRef.file?.fileType === 'csv' ? 'csv' : 'xlsx';
    const isCsv = _file.type === 'text/csv';
    const isXlsx =
        _file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isCsv && !isXlsx) {
        onlyMessage($t('Import.file.677857-15'), 'warning');
    }
    // if (!isXlsx) {
    //     onlyMessage('请上传.xlsx格式文件', 'warning');
    // }
    // return  (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv');
    return  isCsv || isXlsx;
};

const handleDrop = () => {};

const downError = () => {
    window.open(errMessage.value);
};

const submitData = async (fileUrl: string) => {
    if (!!fileUrl) {
        count.value = 0;
        errCount.value = 0;
        const autoDeploy = !!modelRef?.file?.autoDeploy || false;
        importLoading.value = true;
        flag.value = true;
        let dt = 0;
        let et = 0;
        const source = new EventSourcePolyfill(
            props.accessProvider === 'plugin_gateway'
            ? pluginDeviceImport(props.product!, fileUrl, autoDeploy)
            : deviceImport(props.product!, fileUrl, autoDeploy),
        );
        source.onmessage = (e: any) => {
            const res = JSON.parse(e.data);
            if (res.success) {
                const temp = res.result.total;
                dt += temp;
                count.value = dt;
            } else {
                if (res.detailFile) {
                    errMessage.value = res.detailFile;
                } else {
                    et += 1;
                    errCount.value = et;
                }
            }
            disabled.value = false;
        };
        source.onerror = (e: { status: number }) => {
            if (e.status === 403) errMessage.value = $t('Import.file.677857-16');
            flag.value= false;
            disabled.value = false;
            source.close();
        };
        source.onopen = () => {};
    } else {
        onlyMessage($t('Import.file.677857-17'), 'error');
    }
};

const uploadChange = async (info: Record<string, any>) => {
    disabled.value = true;
    if (info.file.status === 'done') {
        const resp: any = info.file.response?.result || { accessUrl: '' };
        await submitData(resp?.accessUrl || '');
    }else{
        disabled.value = false;
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
        .btn {
            border: none;
            background-color: #ECECF0;
            width: 152px;
            color: #666666;
        }
    }

    .dragger-box {
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

    .result {
        div {
            margin: 5px 0;
            color: #605e5c;
        }
    }

    .alert {
        height: 40px;
        width: 100%;
        padding: 0 20px 0 10px;
        color: rgba(0, 0, 0, 0.55);
        line-height: 40px;
        background-color: #f6f6f6;
    }

    :deep(.ant-form-item) {
        .ant-upload.ant-upload-drag {
            background: #F8F9FC;
            border: 1px dashed rgba(212, 219, 243, 0.7);
        }
    }
}
</style>
