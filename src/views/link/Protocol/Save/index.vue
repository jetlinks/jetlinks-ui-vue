<template lang="">
    <a-modal
        :title="data.id ? '编辑' : '新增'"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <a-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
        >
            <a-form-item label="名称" v-bind="validateInfos.name">
                <a-input
                    placeholder="请输入名称"
                    v-model:value="formData.name"
                />
            </a-form-item>
            <a-form-item label="类型" v-bind="validateInfos.type">
                <RadioCard
                    :disabled="!!id"
                    layout="horizontal"
                    :checkStyle="true"
                    :options="options"
                    v-model="formData.type"
                />
            </a-form-item>
            <a-form-item
                label="文件地址"
                v-bind="validateInfos['configuration.location']"
            >
                <a-input
                    v-if="formData.type === 'local'"
                    placeholder="请输入文件地址"
                    v-model:value="formData.configuration.location"
                />
                <FileUpload
                    v-else
                    v-model:modelValue="formData.configuration.location"
                />
            </a-form-item>
            <a-form-item label="说明" v-bind="validateInfos.description">
                <a-textarea
                    placeholder="请输入说明"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button key="back" @click="handleCancel">取消</a-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`link/Protocol:${id ? 'update' : 'add'}`"
            >
                确认
            </PermissionButton>
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import { message, Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import type { UploadChangeParam } from 'ant-design-vue';
import FileUpload from './FileUpload.vue';
import { save, update } from '@/api/link/protocol';

const loading = ref(false);
const fileLoading = ref(false);
const useForm = Form.useForm;

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const id = props.data.id;
const options = [
    {
        label: 'Jar',
        value: 'jar',
        logo: getImage('/jar.png'),
    },
    {
        label: 'Local',
        value: 'local',
        logo: getImage('/local.png'),
    },
];

const formData = ref({
    type: 'jar',
    name: '',
    configuration: {
        location: '',
    },
    description: '',
});

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64个字符' },
        ],
        'configuration.location': [
            { required: true, message: '请输入文件地址', trigger: 'blur' },
        ],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);
const onSubmit = () => {
    validate()
        .then(async (res) => {
            const params = toRaw(formData.value);

            loading.value = true;
            const response = !id
                ? await save(params)
                : await update({ ...props.data, ...params });
            if (response.status === 200) {
                emit('change', true);
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
};

const handleChange = (info: UploadChangeParam) => {
    fileLoading.value = true;
    if (info.file.status === 'done') {
        message.success('上传成功！');
        const result = info.file.response?.result;
        formData.value.configuration.location = result;
        fileLoading.value = false;
    }
};

const handleOk = () => {
    onSubmit();
};
const handleCancel = () => {
    emit('change', false);
};

watch(
    () => formData.value.type,
    () => {
        formData.value.configuration.location = '';
    },
);
watch(
    () => props.data,
    (value) => {
        if (value.id) formData.value = value;
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .form-upload-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}
</style>
