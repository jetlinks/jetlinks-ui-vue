<template>
    <a-input
        allowClear
        :placeholder="$t('variableItem.InputFile.277580-0')"
        v-model:value="url"
        @change="onChange"
    >
        <template #addonAfter>
            <a-upload
                name="file"
                :showUploadList="false"
                :accept="'image/jpeg,image/png'"
                :disabled="loading"
                :headers="{
                    [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                }"
                :action="FileStaticPath"
                @change="handleChange"
                @beforeUpload="handleBeforeUpload"
            >
                <a-button type="link" style="height: 30px">
                    <AIcon type="LoadingOutlined" v-if="loading" />
                    <AIcon type="PlusOutlined" v-else />
                    {{ $t('variableItem.InputFile.277580-1') }}
                </a-button>
            </a-upload>
        </template>
    </a-input>
</template>

<script lang="ts" setup>
import { TOKEN_KEY} from '@jetlinks-web/constants'
import { LocalStore, onlyMessage } from "@jetlinks-web/utils";
import { FileStaticPath} from '@/api/comm'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    id: {
        type: String,
        default: '',
    },
    value: {
        type: String,
        default: '',
    }
});

const emit = defineEmits(['update:value', 'change']);
const url = ref(props.value || undefined);
const loading = ref<boolean>(false);

const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
        loading.value = true;
    }
    if (info.file.status === 'done') {
        info.file.url = info.file.response?.result.accessUrl;
        loading.value = false;
        const result = info.file.response?.result.accessUrl;
        emit('update:value', result);
        emit('change', {name: info.file.response?.result?.name, url: result});
    }
};

const handleBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        onlyMessage($t('variableItem.InputFile.277580-2'), 'error');
    }
    const isSize = file.size / 1024 / 1024 < 4;
    if (!isSize) {
        onlyMessage($t('variableItem.InputFile.277580-3'), 'error');
    }
    return isJpgOrPng && isSize;
};

const onChange = (e: any) => {
    emit('update:value', e.target.value);
    emit('change', {name: '', url: e.target.value});
};

watch(() => props.value, () => {
  url.value = props.value
}, {
  immediate: true
})
</script>
