<template>
    <a-spin :spinning="loading">
        <a-input
            placeholder="请上传文件"
            v-model:value="fileValue"
            style="width: calc(100% - 110px)"
            :disabled="true"
        />
        <a-upload
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
            <a-button type="primary">
                <div>
                    <AIcon type="UploadOutlined" /><span class="upload-text"
                        >上传文件</span
                    >
                </div>
            </a-button>
        </a-upload>
    </a-spin>
</template>

<script setup lang="ts" name="FileUpload">
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { FIRMWARE_UPLOAD, querySystemApi } from '@/api/device/firmware';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { notification as Notification } from 'ant-design-vue';

const emit = defineEmits(['update:modelValue', 'update:extraValue', 'change']);

const props = defineProps({
    modelValue: {
        type: String,
        default: () => '',
    },
});

const fileValue = ref(props.modelValue);
const loading = ref(false);

const handleChange = async (info: UploadChangeParam) => {
    loading.value = true;
    if (info.file.status === 'done') {
        loading.value = false;
        const result = info.file.response?.result;
        const api = await querySystemApi(['paths']);
        const path = api.result[0]?.properties
            ? api.result[0]?.properties['base-path']
            : '';
        const f = `${path}/file/${result.id}?accessKey=${result.others.accessKey}`;
        message.success('上传成功！');
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
    }
    .upload-text {
        margin: 0 10px;
    }
}
</style>
