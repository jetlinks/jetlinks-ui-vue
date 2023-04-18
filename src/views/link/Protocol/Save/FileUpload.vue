<template>
    <j-spin :spinning="loading">
        <j-input
            placeholder="请上传文件"
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
            :before-upload="beforeUpload"
        >
            <j-button type="primary">上传jar包</j-button>
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
        onlyMessage('请上传.zip.jar格式的文件', 'error');
        loading.value = false;
    }
    return isFile;
};
const handleChange = async (info: UploadChangeParam) => {
    loading.value = true;
    if (info.file.status === 'done') {
        loading.value = false;
        const result = info.file.response?.result;
        const f = `${paths || ''}/file/${result.id}?accessKey=${
            result.others.accessKey
        }`;
        onlyMessage('上传成功！', 'success');
        value.value = f;
        emit('update:modelValue', f);
        emit('change', f);
    } else {
        if (info.file.error) {
            Notification.error({
                // key: '403',
                message: '系统提示',
                description: '系统未知错误，请反馈给管理员',
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
