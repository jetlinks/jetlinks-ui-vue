<template>
    <a-spin :spinning="loading">
        <a-input
            :placeholder="$t('Import.index.603910-14')"
            v-model:value="value"
            style="width: calc(100% - 100px)"
            :disabled="true"
        />
        <a-upload
            name="file"
            accept=".jar, .zip"
            :multiple="true"
            :action="FileStaticPath()"
            :headers="getUploadHeaders()"
            @change="handleChange"
            :showUploadList="false"
            class="upload-box"
            :beforeUpload="beforeUpload"
        >
            <a-button type="primary">{{ $t('Save.FileUpload.684757-0') }}</a-button>
        </a-upload>
    </a-spin>
</template>

<script setup lang="ts" name="FileUpload">
import { onlyMessage } from '@jetlinks-web/utils';
import { FileStaticPath } from '@jetlinks-web-core/api/comm';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { notification as Notification } from 'ant-design-vue';
import { useSystemStore } from '@jetlinks-web-core/store/system';
import { useI18n } from 'vue-i18n';
import { getUploadHeaders } from '@jetlinks-web-core/utils'

const { t: $t } = useI18n();
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    modelValue: {
        type: String,
        default: () => '',
    },
});

const paths: string = useSystemStore().systemInfo.paths?.[
    'base-path'
] as string;

const value = ref(props.modelValue);
const loading = ref(false);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const arr = file.name.split('.');
    const isFile = ['jar', 'zip'].includes(arr[arr.length - 1]); // file.type === 'application/zip' || file.type === 'application/javj-archive'
    if (!isFile) {
        loading.value = false;
        onlyMessage($t('Save.FileUpload.684757-1'), 'error');
    }
    return isFile;
};
const handleChange = async (info: UploadChangeParam) => {
  if (!info.file.status) return
    loading.value = true;
    if (info.file.status === 'done') {
        loading.value = false;
        const result = info.file.response?.result;
        const f = `${paths || ''}/file/${result.id}?accessKey=${
            result.others.accessKey
        }`;
        onlyMessage($t('Save.FileUpload.684757-2'), 'success');
        value.value = f;
        emit('update:modelValue', f);
        emit('change', f);
    } else {
        if (info.file.error) {
            Notification.error({
                // key: '403',
                message: $t('Save.FileUpload.684757-3'),
                description: $t('Save.FileUpload.684757-4'),
            });
            loading.value = false;
        } else if (info.file.response) {
            loading.value = false;
        }
    }
};
</script>

<style lang="less" scoped>
.upload-box {
    :deep(.ant-btn) {
        width: 100px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
}
</style>
