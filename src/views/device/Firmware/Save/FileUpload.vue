<template>
    <j-spin :spinning="loading">
        <j-input
            placeholder="请上传文件"
            v-model:value="fileValue"
            style="width: calc(100% - 110px)"
            :disabled="true"
        />
        <j-upload
            name="file"
            :multiple="true"
            :action="FIRMWARE_UPLOAD"
            :headers="{
                [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
            }"
            @change="handleChange"
            :showUploadList="false"
            class="upload-box"
        >
            <j-button type="primary">
                <div>
                    <AIcon type="UploadOutlined" /><span class="upload-text"
                        >上传文件</span
                    >
                </div>
            </j-button>
        </j-upload>
    </j-spin>
</template>

<script setup lang="ts" name="FileUpload">
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { FIRMWARE_UPLOAD } from '@/api/device/firmware';
import { onlyMessage } from '@/utils/comm';
import type { UploadChangeParam } from 'ant-design-vue';
import { notification as Notification } from 'ant-design-vue';
import { useSystem } from '@/store/system';

const emit = defineEmits(['update:modelValue', 'update:extraValue', 'change']);

const props = defineProps({
    modelValue: {
        type: String,
        default: () => '',
    },
});

const paths: string = useSystem().$state.configInfo.paths?.[
    'base-path'
] as string;

const fileValue = ref(props.modelValue);
const loading = ref(false);

const handleChange = async (info: UploadChangeParam) => {
    loading.value = true;
    if (info.file.status === 'done') {
        loading.value = false;
        const result = info.file.response?.result;
        const f = `${paths || ''}/file/${result.id}?accessKey=${
            result.others.accessKey
        }`;
        onlyMessage('上传成功！', 'success');
        fileValue.value = f;
        emit('update:modelValue', f);
        emit('update:extraValue', result);
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

watch(
    () => props.modelValue,
    (value) => {
        fileValue.value = value;
    },
);
</script>

<style lang="less" scoped>
.upload-box {
    :deep(.ant-btn) {
        width: 110px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .upload-text {
        margin: 0 10px;
    }
}
</style>
