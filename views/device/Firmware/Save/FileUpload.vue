<template>
    <a-spin :spinning="loading">
        <a-input
            :placeholder="$t('Save.index.978508-31')"
            v-model:value="fileValue"
            style="width: calc(100% - 110px)"
            @change="fileValueChange"
        />
        <a-upload
            name="file"
            :multiple="true"
            :action="FileStaticPath()"
            :headers="getUploadHeaders()"
            @change="handleChange"
            :showUploadList="false"
            class="upload-box"
        >
            <a-button type="primary">
                <div>
                    <AIcon type="UploadOutlined" /><span class="upload-text"
                        >{{ $t('Import.Import.317604-2') }}</span
                    >
                </div>
            </a-button>
        </a-upload>
    </a-spin>
</template>

<script setup lang="ts" name="FileUpload">
import { FileStaticPath } from '@jetlinks-web-core/api/comm';
import { getUploadHeaders, onlyMessage } from '@jetlinks-web-core/utils/comm'
import type { UploadChangeParam } from 'ant-design-vue';
import { notification as Notification } from 'ant-design-vue';
import { useSystemStore } from '@jetlinks-web-core/store/system';

const emit = defineEmits(['update:modelValue', 'update:extraValue', 'change']);

const props = defineProps({
    modelValue: {
        type: String,
        default: () => '',
    },
});

const paths: string = useSystemStore().systemInfo.paths?.[
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

const fileValueChange = () =>{
    emit('update:modelValue',fileValue.value)
}

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
