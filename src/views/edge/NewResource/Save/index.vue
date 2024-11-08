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
            <a-form-item name="targetType">
                <j-card-select
                    :disabled="!!data.id"
                    v-model:value="targetType"
                    :options="TargetTypeOptions"
                    :column="3"
                    @change="handleChangeTargetType"
                ></j-card-select>
            </a-form-item>
            <a-form-item name="targetId">
                <template #label>
                    <span>
                        模型ID
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
                <a-input v-model:value="formData.targetId" :disabled="data.targetId" placeholder="请输入模型ID"></a-input>
            </a-form-item>
            <a-form-item label="名称" name="name">
                <a-input v-model:value="formData.name" placeholder="请输入名称"></a-input>
            </a-form-item>
            <a-form-item
                v-if="formData.targetType == 'AiModel'"
                label="文件"
                :name="['properties', 'fileName']"
                :rules="{
                    required: true,
                    message: '请上传文件',
                    trigger: 'blur'
                }"
            >
                <UploadFile
                    :fileInfo="{url: formData.metadata.fileUrl, name: formData.properties?.fileName}"
                    v-model:model-value="formData.metadata.fileUrl"
                    v-model:fileName="formData.properties.fileName"
                    @change="handleFileChange"
                />
            </a-form-item>
            <a-form-item
                v-else-if="formData.targetType == 'PluginDriver'"
                label="文件"
                :name="['metadata', 'filename']"
                :rules="{
                    required: true,
                    message: '请上传文件',
                    trigger: 'blur'
                }"
            >
                <UploadFile
                    :fileInfo="{url: formData.metadata.configuration.location, name: formData.metadata.filename}"
                    v-model:model-value="formData.metadata.configuration.location"
                    v-model:fileName="formData.metadata.filename"
                />
            </a-form-item>
            <a-form-item
                v-else-if="formData.targetType == 'entityTemplate:Collector'"
                label="文件"
                :name="['metadata' ,'properties', 'fileName']"
                :rules="{
                    required: true,
                    message: '请选择文件',
                    trigger: 'blur'
                }"
            >
                <FileSelect
                    v-model:metadata="formData.metadata"
                />
            </a-form-item>
            <a-form-item label="说明">
                <a-textarea v-model:value="formData.metadata.description" :maxlength="200" showCount placeholder="请输入说明"></a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import UploadFile from './UploadFile.vue';
import FileSelect from "./FileSelect.vue";
import { save } from '@/api/edge-resource/ai-model';
import { onlyMessage } from "@/utils/comm";
import { randomString } from "@/utils/utils";
import { useUserInfo } from "store/userInfo";
import {ServiceIdEnum, TargetTypeOptions} from "@/views/edge/NewResource/utils";

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    }
})

const targetType = ref('AiModel');
const initAiModelMetadata = {
    name: '',
    fileUrl: '',
    others: {
        fileName: '',
        md5: '',
    },
    provider: 'plugin',
    description: '',
};

const initPluginDriverMetadata = {
    name: '',
    filename: '',
    provider: 'jar',
    description: '',
    configuration: {
        location: '',
    }
}

const initCollectorTemplateMetadata = {
    id: "",
    name: '',
    serviceId: 'commonService:entityTemplate',
    category: '',
    description: '',
    properties: {
        fileName: '',
    },
    metadata: {
        collector: {},
        points: []
    }
}
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
    },
    metadata: props.data.metadata ? JSON.parse(props.data.metadata) : initAiModelMetadata
})

const rules = {
    targetId: [
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

const handleFileChange = (data: any) => {
    formData.value.metadata.others.fileName = data.name;
    formData.value.metadata.others.md5 = data.md5;
}
const handleSave = () => {
    formRef.value?.validate().then(async () => {
        loading.value = true;
        formData.value.metadata.name = formData.value.name;
        const params = {
            ...formData.value,
            metadata: JSON.stringify(formData.value.metadata)
        }
        if(!formData.value.targetId) {
            params.targetId = randomString()
        }
        if(formData.value.targetType !== 'AiModel') {
            delete params.properties
        }
        const res = await save(params).finally(() => loading.value = false);
        if (res) {
            onlyMessage('操作成功');
            emit('save');
        }
    }) ;
}

const handleChangeTargetType = (e: any) => {
    formData.value.targetType = e[0];
    formData.value.serviceId = ServiceIdEnum[e[0]]
    switch (formData.value.targetType) {
        case 'AiModel':
            formData.value.metadata = initAiModelMetadata;
            break;
        case 'PluginDriver':
            formData.value.metadata = initPluginDriverMetadata;
            break;
        case 'entityTemplate:Collector':
            formData.value.metadata = initCollectorTemplateMetadata;
            break;
    }
}
</script>

<style scoped lang="less">

</style>