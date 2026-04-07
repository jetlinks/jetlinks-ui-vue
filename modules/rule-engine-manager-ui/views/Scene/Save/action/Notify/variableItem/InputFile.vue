<template>
    <a-input
        allowClear
        :placeholder="$t('variableItem.InputFile.9667824-0')"
        v-model:value="url"
        disabled
        @change="onChange"
    >
        <template #addonAfter>
            <a-upload
                name="file"
                :showUploadList="false"
                :accept="'image/jpeg,image/png'"
                :disabled="loading"
                :headers="getUploadHeaders()"
                :action="`${getBaseApi()}/file/static`"
                @change="handleChange"
                @beforeUpload="handleBeforeUpload"
            >
                <a-button type="link" style="height: 30px">
                    <AIcon type="LoadingOutlined" v-if="loading" />
                    <AIcon type="PlusOutlined" v-else />
                    {{ $t('variableItem.InputFile.9667824-1') }}
                </a-button>
            </a-upload>
        </template>
    </a-input>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n'
import {getBaseApi, getUploadHeaders} from "@jetlinks-web-core/utils";

const { t: $t } = useI18n()
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
        url.value = info.file.response?.result;
        info.file.url = info.file.response?.result;
        loading.value = false;
        const result = info.file.response?.result;
        emit('update:value', result);
    }
};

const handleBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        onlyMessage($t('variableItem.InputFile.9667824-2'), 'error');
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        onlyMessage($t('variableItem.InputFile.9667824-3'), 'error');
    }
    return isJpgOrPng && isSize;
};

const onChange = (e: any) => {
    emit('update:value', e.target.value);
};
</script>
