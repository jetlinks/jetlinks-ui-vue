<template>
    <j-input
        allowClear
        placeholder="请上传文件"
        v-model:value="url"
        @change="onChange"
    >
        <template #addonAfter>
            <j-upload
                name="file"
                :showUploadList="false"
                :accept="'image/jpeg,image/png'"
                :disabled="loading"
                :headers="{
                    [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                }"
                :action="`${BASE_API_PATH}/file/static`"
                @change="handleChange"
                @beforeUpload="handleBeforeUpload"
            >
                <j-button type="link" style="height: 30px">
                    <AIcon type="LoadingOutlined" v-if="loading" />
                    <AIcon type="PlusOutlined" v-else />
                    上传附件
                </j-button>
            </j-upload>
        </template>
    </j-input>
</template>

<script lang="ts" setup>
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';

const props = defineProps({
    id: {
        type: String,
        default: '',
    },
    value: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:value']);
const url = ref(props.value || undefined);
const loading = ref<boolean>(false);

const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
        loading.value = true;
    }
    if (info.file.status === 'done') {
        info.file.url = info.file.response?.result;
        loading.value = false;
        const result = info.file.response?.result;
        emit('update:value', result);
    }
};

const handleBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        onlyMessage('请上传正确格式图片', 'error');
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        onlyMessage(`图片大小必须小于4M`, 'error');
    }
    return isJpgOrPng && isSize;
};

const onChange = (e: any) => {
    emit('update:value', e.target.value);
};
</script>