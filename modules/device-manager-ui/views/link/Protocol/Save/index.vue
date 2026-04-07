<template>
    <a-modal
        :title="data.id ? $t('Save.index.903552-0') : $t('Save.index.903552-1')"
        :open="true"
        width="700px"
        :mask-closable="false"
        @cancel="handleCancel"
    >
        <a-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <a-form-item
                :label="$t('Save.index.903552-2')"
                name="name"
                :rules="[
                    { required: true, message: $t('Save.index.903552-3'), trigger: 'blur' },
                    { max: 64, message: $t('Save.index.903552-4') },
                ]"
            >
                <a-input
                    :placeholder="$t('Save.index.903552-3')"
                    v-model:value="formData.name"
                />
            </a-form-item>
            <a-form-item
                :label="$t('Save.index.903552-5')"
                name="type"
                :rules="[
                    { required: true, message: $t('Save.index.903552-6'), trigger: 'blur' },
                ]"
            >
                <j-card-select
                    :disabled="!!id"
                    v-model:value="formData.type"
                    :options="options"
                    :column="2"
                    @change="changeType"
                />
            </a-form-item>
            <a-form-item
                :label="$t('Save.index.903552-7')"
                :name="['configuration', 'location']"
                :rules="[
                    {
                        required: true,
                        message: $t('Save.index.903552-8'),
                        trigger: 'blur',
                    },
                ]"
            >
                <a-input
                    v-if="formData.type === 'local'"
                    :placeholder="$t('Save.index.903552-8')"
                    v-model:value="formData.configuration.location"
                />
                <FileUpload
                    v-else
                    v-model:modelValue="formData.configuration.location"
                    @change="handleFileUploadChange"
                />
            </a-form-item>
            <a-form-item :label="$t('Save.index.903552-9')" name="description">
                <a-textarea
                    :placeholder="$t('Save.index.903552-10')"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button key="back" @click="handleCancel">{{ $t('Save.index.903552-11') }}</a-button>
            <j-permission-button
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`link/Protocol:${id ? 'update' : 'add'}`"
            >
                {{ $t('Save.index.903552-12') }}
            </j-permission-button>
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import type { UploadChangeParam, FormInstance } from 'ant-design-vue';
import FileUpload from './FileUpload.vue';
import { save, update } from '../../../../api/link/protocol';
import { FormDataType } from '../type.d';
import { link } from '../../../../assets'
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const loading = ref(false);
const fileLoading = ref(false);
const formRef = ref<FormInstance>();
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const route = useRoute();
const emit = defineEmits(['change']);

const id = props.data.id;
const options = [
    {
        label: 'Jar',
        value: 'jar',
        iconUrl: link.jar,
    },
    {
        label: 'Local',
        value: 'local',
        iconUrl: link.local,
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

const { onBack } = useTabSaveSuccessBack()

const changeType = (value: Array<string>) => {
    formData.value.type = value[0];
    formData.value.configuration.location = '';
};

const onSubmit = async () => {
    const data: any = await formRef.value?.validate();
    loading.value = true;
    const response: any = !id
        ? await save(data).catch(() => {})
        : await update({ ...props.data, ...data }).catch(() => {});
    if (response?.status === 200) {
        emit('change', response?.status === 200);
        if (response.result?.id) {
          onBack(response)
        }
    }
    loading.value = false;
};

const handleChange = (info: UploadChangeParam) => {
    fileLoading.value = true;
    if (info.file.status === 'done') {
        onlyMessage($t('Save.index.903552-13'), 'success');
        const result = info.file.response?.result;
        formData.value.configuration.location = result;
        fileLoading.value = false;
    }
};

const handleFileUploadChange = () => {
    formRef.value?.validate()
};

const handleOk = () => {
    onSubmit();
};
const handleCancel = () => {
    emit('change', false);
};

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
