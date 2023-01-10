<template>
    <a-spin :spinning="loading">
        <div>
            <a-textarea
                :rows="4"
                @change="textChange"
                v-model:value="keystoreBase64"
                :placeholder="placeholder"
            />
            <a-upload
                accept=".pem"
                listType="text"
                :action="`${BASE_API_PATH}${NETWORK_CERTIFICATE_UPLOAD}`"
                :headers="{
                    [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                }"
                :showUploadList="false"
                @change="handleChange"
            >
                <a-button style="margin-top: 10px">
                    <upload-outlined />
                    上传文件</a-button
                >
            </a-upload>
        </div>
    </a-spin>
</template>

<script setup lang="ts" name="CertificateFile">
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { LocalStore } from '@/utils/comm';
import {
    BASE_API_PATH,
    TOKEN_KEY,
    NETWORK_CERTIFICATE_UPLOAD,
} from '@/utils/variable';
import type { UploadProps } from 'ant-design-vue';

const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    name: {
        type: String,
        default: () => '',
    },
    modelValue: {
        type: String,
        default: () => '',
    },
    placeholder: {
        type: String,
        default: () => '',
    },
});

const keystoreBase64 = ref(props.modelValue);
const loading = ref(false);

const handleChange = (info: UploadChangeParam) => {
    loading.value = true;
    if (info.file.status === 'done') {
        message.success('上传成功！');
        const result = info.file.response?.result;
        keystoreBase64.value = result;
        console.log(1114, result);
        loading.value = false;
        emit('change', result);
        emit('update:modelValue', result);
    }
};
const textChange = (val: any) => {
    val.name = props.name;
    emit('change', val);
    // emit('update:modelValue', val);
};

watch(
    () => props.modelValue,
    (v) => {
        keystoreBase64.value = v;
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped></style>
