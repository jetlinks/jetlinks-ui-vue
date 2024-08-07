<template>
    <j-modal
        visible
        :title="props.mode"
        width="660px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :maskClosable="false"
        :confirmLoading="loading"
    >
        <j-form :model="form.data" class="basic-form" ref="formRef">
            <j-form-item
                :label="$t('components.ButtonAddDialog.159197-0')"
                name="id"
                :rules="[
                    { required: true, message: $t('components.ButtonAddDialog.159197-1') },
                    { max: 64, message: $t('components.ButtonAddDialog.159197-2') },
                    { validator: validateIdRepeat, trigger: 'blur' },
                ]"
            >
                <j-auto-complete
                    v-model:value="form.data.id"
                    :options="codeOptions"
                    :placeholder="$t('components.ButtonAddDialog.159197-1')"
                    :disabled="props.mode !== $t('components.ButtonAddDialog.159197-3')"
                >
                    <template #option="{ value: val, message }">
                        {{ val }}
                        <span class="message">{{ message }}</span>
                    </template>
                </j-auto-complete>
            </j-form-item>
            <j-form-item
                :label="$t('components.ButtonAddDialog.159197-4')"
                name="name"
                :rules="[
                    { required: true, message: $t('components.ButtonAddDialog.159197-5') },
                    { max: 64, message: $t('components.ButtonAddDialog.159197-2') },
                ]"
            >
                <j-input
                    v-model:value="form.data.name"
                    :disabled="props.mode === $t('components.ButtonAddDialog.159197-6')"
                    :placeholder="$t('components.ButtonAddDialog.159197-5')"
                />
            </j-form-item>
            <j-form-item
                :label="$t('components.ButtonAddDialog.159197-7')"
                name="permissions"
                :rules="[
                    {
                        required: true,
                        message: $t('components.ButtonAddDialog.159197-8'),
                        validator: form.checkPermission,
                    },
                ]"
            >
                <PermissChoose
                    :first-width="8"
                    max-height="350px"
                    v-model:value="form.data.permissions"
                    :disabled="props.mode === $t('components.ButtonAddDialog.159197-6')"
                    :btnId="form.data.id"
                />
            </j-form-item>
            <j-form-item :label="$t('components.ButtonAddDialog.159197-9')" name="description"
            :rules="[
                    { max: 200, message: $t('components.ButtonAddDialog.159197-10') },
                ]">
                <j-textarea
                    v-model:value="form.data.description"
                    :rows="4"
                    :placeholder="$t('components.ButtonAddDialog.159197-11')"
                    :disabled="props.mode === $t('components.ButtonAddDialog.159197-6')"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import PermissChoose from '../components/PermissChoose.vue';
import { saveMenuInfo_api } from '@/api/system/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    menuInfo: {
        buttons: formType[];
        id: string;
    };
    visible: boolean;
    mode: string;
    data: formType;
    menuData: {
        type: Array<any>;
        default: [];
    };
}>();

const loading = ref(false);
const confirm = () => {
    formRef.value &&
        formRef.value.validate().then(() => {
            const buttons = toRaw(props.menuInfo?.buttons) || [];
            const button = buttons?.find((item) => item.id === form.data.id);
            if (button) {
                Object.entries(form.data).forEach(([key, value]) => {
                    button[key] = value;
                });
            } else {
                buttons.push({ ...form.data });
            }
            const params = {
                ...props.menuInfo,
                buttons,
            };
            loading.value = true;
            saveMenuInfo_api(params)
                .then((resp) => {
                    onlyMessage($t('components.ButtonAddDialog.159197-13'));
                    emits('confirm');
                    emits('update:visible', false);
                })
                .finally(() => (loading.value = false))
                .catch(() => {
                    loading.value = false;
                });
        });
};
const initForm = {
    name: '',
    id: '',
    permissions: [],
    description: '',
} as formType;
const formRef = ref<FormInstance>();
const form = reactive({
    data: { ...initForm, ...props.data },
    checkPermission: (_rule: Rule, value: string[]) => {
        if (!value || value.length < 1) return Promise.reject($t('components.ButtonAddDialog.159197-8'));
        return Promise.resolve();
    },
});
const codeOptions = [
    { label: 'add', value: 'add', message: $t('components.ButtonAddDialog.159197-3') },
    { label: 'delete', value: 'delete', message: $t('components.ButtonAddDialog.159197-14') },
    { label: 'update', value: 'update', message: $t('components.ButtonAddDialog.159197-15') },
];
const validateIdRepeat = (rule: any, val: any) => {
    if (props.mode === $t('components.ButtonAddDialog.159197-12')|| props.mode === $t('components.ButtonAddDialog.159197-6')) {
        return Promise.resolve('');
    }
    const isRepeat = props.menuData.find((i: any) => {
        return i.id === val;
    });
    if (isRepeat) {
        return Promise.reject($t('components.ButtonAddDialog.159197-16'));
    } else {
        return Promise.resolve('');
    }
};
type formType = {
    name: string;
    id: string;
    permissions: any[];
    description: string;
};
</script>

<style lang="less" scoped>
.basic-form {
    .ant-form-item {
        display: block;
        :deep(.ant-form-item-label) {
            overflow: inherit;
            label::after {
                display: none;
            }
        }

        .message {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.4);
        }
    }
}
</style>
