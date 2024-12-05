<template>
    <a-button type="primary" ghost @click="showImport">
        <template #icon>
            <AIcon type="DownloadOutlined" />
        </template>
        导入
    </a-button>
    <a-modal
        v-if="visible"
        visible
        :title="'批量导入'"
        :width="600"
        :keyboard="false"
        :maskClosable="false"
        :okButtonProps="{
            disabled: !successCount,
        }"
        :getContainer="modalContainer"
        @cancel="onCancel"
        @ok="onOk"
    >
        <a-form layout="vertical">
            <a-form-item label="上传文件">
                <a-upload-dragger
                    name="file"
                    :headers="{ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) }"
                    :maxCount="1"
                    :accept="'.xlsx,.csv'"
                    :showUploadList="showUploadList"
                    :before-upload="beforeUpload"
                    @change="uploadChange"
                    @reject="onReject"
                    @drop="handleDrop"
                >
                    <div class="dragger-box">
                        <AIcon class="icon" type="PlusCircleFilled" />
                        <span style="margin: 16px 0 8px 0"
                            >点击或拖拽上传文件</span
                        >
                        <span>格式：.xlsx, .csv</span>
                    </div>
                    <template #itemRender="{ file }">
                        <a-space>{{ file.name }}</a-space>
                    </template>
                </a-upload-dragger>
            </a-form-item>
            <a-form-item label="下载模版">
                <div class="file-download">
                    <j-button class="btn" @click="downFile('xlsx')"
                        >模板格式.xlsx</j-button
                    >
                    <j-button class="btn" @click="downFile('csv')"
                        >模板格式.csv</j-button
                    >
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup name="MetadataImport">
import { TOKEN_KEY, TOKEN_KEY_URL } from '@/utils/variable';
import { getToken, isFullScreen, LocalStore, onlyMessage } from '@/utils/comm';
import { validate } from './util';
import { getTemplate, uploadAnalyzeMetadata } from '@/api/device/instance';
import { getTemplate as getProductTemplate } from '@/api/device/product';
import { downloadFileByUrl } from '@/utils/utils';
import {
    useGroupActive,
    useTableWrapper,
} from '@/components/Metadata/Table/context';
import { useProductStore } from '@/store/product';
import { useInstanceStore } from '@/store/instance'

const props = defineProps({
    target: {
        type: String,
        default: undefined,
    },
    metadata: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['ok']);
const { current } = props.target === 'product' ? useProductStore() : useInstanceStore();
const visible = ref(false);
const successCount = ref(0);
const errorCount = ref(0);
const showUploadList = ref(false);
const groupActive = useGroupActive();
const tableWrapperRef = useTableWrapper();

let submitMetadata = [];

const route = useRoute();

const modalContainer = (e) => {
    if (isFullScreen()) {
        return tableWrapperRef.value || document.body;
    }
    return document.body;
};

const init = () => {
    showUploadList.value = false;
    successCount.value = 0;
    errorCount.value = 0;
};

const showImport = () => {
    init();
    visible.value = true;
};

const onCancel = () => {
    visible.value = false;
};

const submitData = async (metadataStr) => {
    successCount.value = 0;
    errorCount.value = 0;
    if (metadataStr) {
        showUploadList.value = true;
        const _metadataObject = JSON.parse(metadataStr || '{}');
        const properties = _metadataObject.properties;
        const _metadata = props.metadata.filter(
            (item) => item.id && !item.expands?.isProduct,
        );
        const result = properties.map((item) => {
            if (item.expands) {
                item.expands.groupId = groupActive.value;
                item.expands.groupName = groupActive.label;
            } else {
                item.expands = {
                    groupId: groupActive.value,
                    groupName: groupActive.label,
                };
            }
            return item;
        });

        submitMetadata = validate(result, _metadata, (validate) => {
            if (validate) {
                successCount.value += 1;
            } else {
                errorCount.value += 1;
            }
        });
    } else {
        onlyMessage('请先上传文件', 'error');
        showUploadList.value = false;
    }
};

const onOk = () => {
    onlyMessage('操作成功！');
    emit('ok', submitMetadata);
    visible.value = false;
};

const onReject = () => {
    init();
    onlyMessage('请上传.xlsx或.csv格式文件', 'warning');
};

const downFile = (type) => {
    const url =
        props.target === 'device'
            ? getTemplate(route.params.id, type)
            : getProductTemplate(route.params.id, type);

    downloadFileByUrl(
        url + `?${TOKEN_KEY_URL}=${getToken()}`,
        '物模型模版',
        type,
    );
};

const handleDrop = () => {};

const handleError = () => {
    onlyMessage('上传失败', 'error');
    init();
};

const beforeUpload = (file) => {
    const isCsv = file.type === 'text/csv';
    const isXlsx =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isCsv && !isXlsx) {
        onReject();
    } else {
        const formData = new FormData();
        formData.append('file', file);
        uploadAnalyzeMetadata(current?.id, formData)
            .then((res) => {
                if (res.success) {
                    submitData(res.result);
                } else {
                    handleError();
                }
            })
            .catch(() => {
                handleError();
            });
    }
    return false;
};

const uploadChange = async (info) => {
    if (info.file.status === 'done') {
        const resp = info.file.response || { result: {} };
        await submitData(resp?.result || '');
    }
    if (info.file.status === 'error') {
        onlyMessage('上传失败', 'error');
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
        background-color: #ececf0;
        width: 152px;
        color: #666666;
    }
}
</style>
