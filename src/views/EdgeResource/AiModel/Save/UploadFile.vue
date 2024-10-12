<template>
    <a-upload
        name="file"
        accept=".jar,.zip"
        :action="uploadUrl"
        :headers="{
            [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
        }"
        @change="handleChange"
        class="upload-box"
        :before-upload="beforeUpload"
        :disabled="loading"
        :maxCount="1"
        :fileList="list"
        @remove="remove"
    >
        <div>
            <a-button>上传文件</a-button>
            <span class="upload-tip">格式要求：.jar .zip</span>
        </div>
    </a-upload>
    <template v-if="loading">
        <a-spin size="small"/>
        上传中
    </template>
</template>

<script setup lang="ts" name="FileUpload">
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { onlyMessage } from '@/utils/comm';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { notification as Notification } from 'jetlinks-ui-components';
import { useSystem } from '@/store/system';
import { FileUpload } from "@/api/comm";
import { fileList } from '@/views/device/Instance/Detail/Running/Property/index';

const emit = defineEmits(['update:modelValue', 'change', 'update:fileName']);

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
    fileInfo: {
        type: Object,
        default: () => ({})
    },
    uploadUrl: {
        type: String,
        default: FileUpload
    }
});

const paths: string = useSystem().$state.configInfo.paths?.[
    'base-path'
    ] as string;

const value = ref(props.modelValue);
const list = ref<any>(props.fileName ? [{ name: props.fileName }] : []);
const loading = ref(false);
const fileCache = ref();
const remove = () => {
    list.value = [];
    emit('update:modelValue', undefined);
    emit('update:fileName', undefined);
    emit('change', {});
};

const beforeUpload: UploadProps['beforeUpload'] = (file, fl) => {
    const arr = file.name.split('.');
    const isFile = ['jar', 'zip'].includes(arr[arr.length - 1]); // file.type === 'application/zip' || file.type === 'application/javj-archive'
    if (!isFile) {
        onlyMessage('请上传.jar,.zip格式的文件', 'error');
        loading.value = false;
        return false;
    }
    list.value = fl;
    return isFile;
};
const handleChange = async (info: UploadChangeParam) => {
    loading.value = true;
    if (info.file.status === 'done') {
        loading.value = false;
        const result = info.file.response?.result;
        const f = result.accessUrl;
        onlyMessage('上传成功！', 'success');
        value.value = f;
        fileCache.value = info.fileList;
        emit('update:modelValue', result.accessUrl);
        emit('update:fileName', result.filename || result.name)
        emit('change', result);
    } else {
        if (info.file.error) {
            list.value = fileCache.value;
            Notification.error({
                // key: '403',
                message: '系统提示',
                description: info.file.response?.message,
            });
            // emit('update:modelValue', { err:'file_upload_error'});
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
