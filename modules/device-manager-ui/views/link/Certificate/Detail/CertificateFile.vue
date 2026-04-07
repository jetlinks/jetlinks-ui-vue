<template>
    <a-spin :spinning="loading">
        <a-textarea
            :rows="4"
            @change="textChange"
            v-model:value="keystoreBase64"
            :placeholder="placeholder"
        />
        <a-upload
            :accept="accept"
            listType="text"
            :action="NETWORK_CERTIFICATE_UPLOAD()"
            :headers="getUploadHeaders()"
            :showUploadList="false"
            @change="handleChange"
        >
            <a-button style="margin-top: 10px">
                <AIcon type="UploadOutlined" />
                {{ $t('Import.Import.317604-2') }}</a-button
            >
        </a-upload>
    </a-spin>
</template>

<script setup lang="ts" name="CertificateFile">
import {getUploadHeaders, onlyMessage} from '@jetlinks-web-core/utils/comm';
import type { UploadChangeParam } from 'ant-design-vue';
import { NETWORK_CERTIFICATE_UPLOAD } from '../../../../api/link/certificate';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
    accept: {
      type: String,
      default: '.key'
    }
});

const keystoreBase64 = ref(props.modelValue);
const loading = ref(false);

const handleChange = (info: UploadChangeParam) => {
    loading.value = true;
    if (info.file.status === 'done') {
        const result = info.file.response?.result;
        const reg = new RegExp(/\.key$/i);
        if (info.file.name.endsWith(props.accept)) {
            keystoreBase64.value = result;
            emit('change', result);
            emit('update:modelValue', result);
            onlyMessage($t('Detail.CertificateFile.588280-0'), 'success');
        } else {
            onlyMessage($t('Detail.CertificateFile.588280-1', [props.accept]), 'error');
        }
        loading.value = false;
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
