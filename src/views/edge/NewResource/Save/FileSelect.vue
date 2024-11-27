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
const emit = defineEmits(['update:metadata', 'update:fileName', 'change']);
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
        Object.assign(_metadata, data)
        emit('update:metadata', _metadata)
        emit('update:fileName', file.name)
        emit('change')
        return true;
    };
    return false;
}

const remove = () => {
    list.value = [];
    emit('change')
    emit('update:fileName', '')
}
watch(() => props.metadata, () => {
    if(props.metadata?.properties?.fileName) {
        list.value = [
            {
                name: props.metadata?.properties?.fileName
            }
        ]
    }
}, { immediate: true })
</script>

<style scoped lang="less">
.upload-tip {
    color: #999;
    padding-left: 12px;
}
</style>