<template>
    <a-modal
        visible
        :maskClosable="false"
        :title="!!data?.id ? '编辑' : '新增'"
        width="650px"
        @cancel="emit('close')"
        @ok="handleSave"
    >
        <a-form ref="formRef" layout="vertical" :model="formData" :rules="rules">
            <a-form-item name="id">
                <template #label>
                    <span>
                        插件ID
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
                <a-input v-model:value="formData.targetId" :disabled="data.targetId" placeholder="请输入插件ID"></a-input>
            </a-form-item>
            <a-form-item label="名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入名称"></a-input>
            </a-form-item>
            <a-form-item label="文件" :name="['metadata', 'filename']" :rules="{
                required: true
            }">
                <UploadFile
                    :uploadUrl="uploadFile"
                    :fileInfo="{url: formData.metadata.configuration.location, name: formData.metadata.filename}"
                    v-model:model-value="formData.metadata.configuration.location"
                    v-model:fileName="formData.metadata.filename"
                />
            </a-form-item>
            <a-form-item label="说明">
                <a-textarea v-model:value="formData.metadata.description" :maxlength="200" showCount placeholder="请输入说明"></a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import UploadFile from '@/views/EdgeResource/AiModel/Save/UploadFile.vue';
import { save } from '@/api/edge-resource/ai-model';
import { onlyMessage } from "@/utils/comm";
import { randomString } from "@/utils/utils";
import { uploadFile } from "@/api/link/plugin";

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
    targetId: props.data.targetId || undefined,
    name: props.data.name || undefined,
    describe: props.data?.describe || undefined,
    targetType: props.data?.targetType || 'PluginDriver',
    serviceId:"pluginService:driver",
    metadata: props.data?.metadata ? JSON.parse(props.data.metadata) : {
        name: '',
        filename: '',
        provider: 'jar',
        description: '',
        configuration: {
            location: '',
        }
    },
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

const handleSave = async () => {
    formRef.value?.validate().then(async () => {
        loading.value = true
        formData.value.metadata.name = formData.value.name;
        const params = {
            ...formData.value,
            metadata: JSON.stringify(formData.value.metadata)
        }
        if(!formData.value.id) {
            params.targetId = randomString()
        }
        const res = await save(params).finally(() => loading.value = false);
        if (res) {
            onlyMessage('操作成功');
            emit('save');
        }
    });
}
</script>

<style scoped lang="less">

</style>