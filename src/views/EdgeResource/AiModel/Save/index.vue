<template>
    <a-modal
        visible
        :maskClosable="false"
        :title="!!data?.id ? '编辑' : '新增'"
        width="650px"
        :confirm-loading="loading"
        @cancel="emit('close')"
        @ok="handleSave"
    >
        <a-form ref="formRef" layout="vertical" :model="formData" :rules="rules">
            <a-form-item name="id">
                <template #label>
                    <span>
                        ID
                        <a-tooltip
                            title="若不填写，系统将自动生成唯一ID"
                        >
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </a-tooltip>
                    </span>
                </template>
                <a-input v-model:value="formData.id" :disabled="data.id" placeholder="请输入ID"></a-input>
            </a-form-item>
            <a-form-item label="名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入名称"></a-input>
            </a-form-item>
            <a-form-item label="文件" :name="['properties', 'fileName']" :rules="{
                required: true
            }">
                <UploadFile :fileInfo="{url: metadata.fileUrl, name: formData.properties?.fileName}" v-model:model-value="metadata.fileUrl" v-model:fileName="formData.properties.fileName"/>
            </a-form-item>
            <a-form-item label="说明">
                <a-textarea v-model:value="metadata.description" :maxlength="200" showCount placeholder="请输入说明"></a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import UploadFile from './UploadFile.vue';
import { save } from '@/api/edge-resource/ai-model';
import { onlyMessage } from "@/utils/comm";
import { randomString } from "@/utils/utils";

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    }
})

const loading = ref(false);
const formRef = ref();
const formData = ref<Record<string, any>>({
    id: props.data.id || undefined,
    name: props.data.name || undefined,
    targetType: props.data?.targetType || 'AiModel',
    targetId: props.data?.targetId || undefined,
    serviceId:"aiService:modelManager",
    properties: props.data?.properties || {
        fileName: ""
    }
})

const metadata = reactive(props.data.metadata ? JSON.parse(props.data.metadata) : {
    name: '',
    fileUrl: '',
    description: '',
})

const rules = {
    id: [
        {
            pattern: /^[a-zA-Z0-9_\-]+$/,
            message: '请输入英文或者数字或者-或者_',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
    name: [
        {
            required: true,
            message: '请输入名称',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
}

const handleSave = () => {
    formRef.value?.validate().then(async () => {
        loading.value = true;
        metadata.name = formData.value.name;
        const params = {
            ...formData.value,
            metadata: JSON.stringify(metadata)
        }
        if(!formData.value.id) {
            params.targetId = randomString()
        }
        const res = await save(params).finally(() => loading.value = false);
        if (res) {
            onlyMessage('操作成功');
            emit('save');
        }
    }) ;
}
</script>

<style scoped lang="less">

</style>