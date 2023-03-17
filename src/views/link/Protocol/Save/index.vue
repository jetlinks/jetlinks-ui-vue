<template lang="">
    <j-modal
        :title="data.id ? '编辑' : '新增'"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item
                label="名称"
                name="name"
                :rules="[
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { max: 64, message: '最多可输入64个字符' },
                ]"
            >
                <j-input
                    placeholder="请输入名称"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item
                label="类型"
                name="type"
                :rules="[
                    { required: true, message: '请选择类型', trigger: 'blur' },
                ]"
            >
                <j-card-select
                    :disabled="!!id"
                    v-model:value="formData.type"
                    :options="options"
                    @change="changeType"
                />
            </j-form-item>
            <j-form-item
                label="文件地址"
                :name="['configuration', 'location']"
                :rules="[
                    {
                        required: true,
                        message: '请输入文件地址',
                        trigger: 'blur',
                    },
                ]"
            >
                <j-input
                    v-if="formData.type === 'local'"
                    placeholder="请输入文件地址"
                    v-model:value="formData.configuration.location"
                />
                <FileUpload
                    v-else
                    v-model:modelValue="formData.configuration.location"
                />
            </j-form-item>
            <j-form-item label="说明" name="description">
                <j-textarea
                    placeholder="请输入说明"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
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
    </j-modal>
</template>
<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import { getImage } from '@/utils/comm';
import type { UploadChangeParam, FormInstance } from 'ant-design-vue';
import FileUpload from './FileUpload.vue';
import { save, update } from '@/api/link/protocol';
import { FormDataType } from '../type.d';

const loading = ref(false);
const fileLoading = ref(false);
const formRef = ref<FormInstance>();
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
        iconUrl: getImage('/jar.png'),
    },
    {
        label: 'Local',
        value: 'local',
        iconUrl: getImage('/local.png'),
    },
];

const formData = ref<FormDataType>({
    type: 'jar',
    name: '',
    configuration: {
        location: '',
    },
    description: '',
});
const changeType = (value: Array<string>) => {
    formData.value.type = value[0];
};

const onSubmit = async () => {
    const data: any = await formRef.value?.validate();
    loading.value = true;
    const response: any = !id
        ? await save(data).catch(() => {})
        : await update({ ...props.data, ...data }).catch(() => {});
    if (response?.status === 200) {
        emit('change', response?.status === 200);
        if ((window as any).onTabSaveSuccess) {
            if (response.result?.id) {
                (window as any).onTabSaveSuccess(response);
                setTimeout(() => window.close(), 300);
            }
        }
    }
    loading.value = false;
};

const handleChange = (info: UploadChangeParam) => {
    fileLoading.value = true;
    if (info.file.status === 'done') {
        onlyMessage('上传成功！', 'success');
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
        if (value.id) {
            formData.value = value as FormDataType;
            if (!!value.type[0]?.value) {
                formData.value.type = value.type.map((i: any) => i.value);
            }
        }
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
