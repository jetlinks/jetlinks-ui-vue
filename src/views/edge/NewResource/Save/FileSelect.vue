<template>
    <a-upload
        name="file"
        accept=".json"
        :before-upload="beforeUpload"
        :fileList="list"
        @remove="remove"
    >
        <a-button>上传文件</a-button><span class="upload-tip">格式要求：.json</span>
    </a-upload>
</template>

<script setup lang="ts">
import {onlyMessage} from "@/utils/comm";
import {PropType} from "vue";
import {cloneDeep} from "lodash-es";
const emit = defineEmits(['update:metadata'])
const props = defineProps({
    metadata: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({})
    },
})
const list = ref([]);
const beforeUpload = (file: any, files) => {
    // console.log('file: ', file);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (result) => {
        const text = result.target?.result;
        console.log('text: ', text);
        if (!file.type.includes('json')) {
            onlyMessage('请上传json格式文件', 'error');
            return false;
        }
        list.value = files;
        const data = JSON.parse(text || '{}');
        const _metadata = cloneDeep(props.metadata);
        _metadata.properties.fileName = file.name;
        Object.assign(_metadata, data)
        // formData.value.metadata.properties.fileName = file.name;
        // formRef.value?.validateFields('metadata');
        emit('update:metadata', _metadata)
        return true;
    };
    return false;
}

const remove = () => {
    list.value = [];
    // formData.value.metadata = initMetadata;
}
</script>

<style scoped lang="less">
.upload-tip {
    color: #999;
    padding-left: 12px;
}
</style>