<template>
    <j-spin :spinning="loading">
        <j-textarea
            :rows="4"
            @change="textChange"
            v-model:value="keystoreBase64"
            :placeholder="placeholder"
        />
        <j-upload
            accept=".pem"
            listType="text"
            :action="NETWORK_CERTIFICATE_UPLOAD"
            :headers="{
                [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
            }"
            :showUploadList="false"
            @change="handleChange"
        >
            <j-button style="margin-top: 10px">
                <AIcon type="UploadOutlined" />
                上传文件</j-button
            >
        </j-upload>
    </j-spin>
</template>

<script setup lang="ts" name="CertificateFile">
import { onlyMessage } from '@/utils/comm';
import type { UploadChangeParam } from 'ant-design-vue';
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { NETWORK_CERTIFICATE_UPLOAD } from '@/api/link/certificate';

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
        onlyMessage('上传成功！', 'success');
        const result = info.file.response?.result;
        keystoreBase64.value = result;
        loading.value = false;
        emit('change', result);
        emit('update:modelValue', result);
    }
};
const textChange = (val: any) => {
    emit('change', keystoreBase64.value);
    emit('update:modelValue', keystoreBase64.value);
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
