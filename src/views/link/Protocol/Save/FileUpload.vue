<template>
    <j-spin :spinning="loading">
        <j-input
            :placeholder="$t('Save.FileUpload.871193-0')"
            v-model:value="value"
            style="width: calc(100% - 100px)"
            :disabled="true"
        />
        <j-upload
            name="file"
            accept=".jar, .zip"
            :multiple="true"
            :action="PROTOCOL_UPLOAD"
            :headers="{
                [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
            }"
            @change="handleChange"
            :showUploadList="false"
            class="upload-box"
            :beforeUpload="beforeUpload"
        >
            <j-button type="primary">{{ $t('Save.FileUpload.871193-1') }}</j-button>
        </j-upload>
    </j-spin>
</template>

<script setup lang="ts" name="FileUpload">
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { PROTOCOL_UPLOAD } from '@/api/link/protocol';
import { onlyMessage } from '@/utils/comm';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { notification as Notification } from 'jetlinks-ui-components';
import { useSystem } from '@/store/system';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    modelValue: {
        type: String,
        default: () => '',
    },
});

const paths: string = useSystem().$state.configInfo.paths?.[
    'base-path'
] as string;

const value = ref(props.modelValue);
const loading = ref(false);

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const arr = file.name.split('.');
    const isFile = ['jar', 'zip'].includes(arr[arr.length - 1]); // file.type === 'application/zip' || file.type === 'application/javj-archive'
    if (!isFile) {
        loading.value = false;
        onlyMessage($t('Save.FileUpload.871193-2'), 'error');
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
        onlyMessage($t('Save.FileUpload.871193-3'), 'success');
        value.value = f;
        emit('update:modelValue', f);
        emit('change', f);
    } else {
        if (info.file.error) {
            Notification.error({
                // key: '403',
                message: $t('Save.FileUpload.871193-4'),
                description: $t('Save.FileUpload.871193-5'),
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
