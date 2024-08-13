<template>
    <j-upload
        name="file"
        accept=".jar,.zip"
        :action="uploadFile"
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
            <j-button>{{ $t('plugin.UploadFile.688241-0') }}</j-button>
            <span class="upload-tip">{{ $t('plugin.UploadFile.688241-1') }}</span>
        </div>
    </j-upload>
    <template v-if="loading">
        <a-spin size="small"/>
        {{ $t('plugin.UploadFile.688241-2') }}
    </template>
</template>

<script setup lang="ts" name="FileUpload">
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { uploadFile } from '@/api/link/plugin';
import { onlyMessage } from '@/utils/comm';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { notification as Notification } from 'jetlinks-ui-components';
import { useSystem } from '@/store/system';
import { fileList } from '@/views/device/Instance/Detail/Running/Property/index';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emit = defineEmits(['update:modelValue', 'change']);

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
    emit('update:modelValue', '');
    emit('change', {});
};

const beforeUpload: UploadProps['beforeUpload'] = (file, fl) => {
    const arr = file.name.split('.');
    const isFile = ['jar', 'zip'].includes(arr[arr.length - 1]); // file.type === 'application/zip' || file.type === 'application/javj-archive'
    if (!isFile) {
        onlyMessage($t('plugin.UploadFile.688241-3'), 'error');
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
        onlyMessage($t('plugin.UploadFile.688241-4'), 'success');
        value.value = f;
        fileCache.value = info.fileList;
        emit('update:modelValue', result.version);
        emit('change', result);
    } else {
        if (info.file.error) {
            list.value = fileCache.value;
            Notification.error({
                // key: '403',
                message: $t('plugin.UploadFile.688241-5'),
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
