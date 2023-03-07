<template>
    <a-modal
        visible
        :title="props.mode"
        width="660px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :maskClosable="false"
        :confirmLoading="loading"
    >
        <a-form :model="form.data" class="basic-form" ref="formRef">
            <a-form-item
                label="编码"
                name="id"
                :rules="[
                    { required: true, message: '请输入编码' },
                    { max: 64, message: '最多可输入64个字符' },
                ]"
            >
                <a-input
                    v-model:value="form.data.id"
                    :disabled="props.mode !== '新增'"
                />
            </a-form-item>
            <a-form-item
                label="名称"
                name="name"
                :rules="[
                    { required: true, message: '请输入名称' },
                    { max: 64, message: '最多可输入64个字符' },
                ]"
            >
                <a-input
                    v-model:value="form.data.name"
                    :disabled="props.mode === '查看'"
                />
            </a-form-item>
            <a-form-item
                label="权限"
                name="permissions"
                :rules="[
                    {
                        required: true,
                        message: '请选择权限',
                        validator: form.checkPermission,
                    },
                ]"
            >
                <PermissChoose
                    :first-width="8"
                    max-height="350px"
                    v-model:value="form.data.permissions"
                    :disabled="props.mode === '查看'"
                    :key="form.data.id || ''"
                />
            </a-form-item>
            <a-form-item label="说明" name="describe">
                <a-textarea
                    v-model:value="form.data.describe"
                    :rows="4"
                    placeholder="请输入说明"
                    :disabled="props.mode === '查看'"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import PermissChoose from '../components/PermissChoose.vue';
import { saveMenuInfo_api } from '@/api/system/menu';

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    menuInfo: {
        buttons: formType[];
        id: string;
    };
    visible: boolean;
    mode: '查看' | '新增' | '编辑';
    data: formType;
}>();

const loading = ref(false);
const confirm = () => {
    loading.value = true;
    formRef.value &&
        formRef.value.validate().then(() => {
            const buttons = toRaw(props.menuInfo.buttons);
            const button = buttons.find((item) => item.id === form.data.id);
            if (button) {
                Object.entries(form.data).forEach(([key, value]) => {
                    button[key] = value;
                });
            } else buttons.push({ ...form.data });
            const params = {
                ...props.menuInfo,
                buttons,
            };
            saveMenuInfo_api(params)
                .then((resp) => {
                    message.success('操作成功');
                    emits('confirm');
                    emits('update:visible', false);
                })
                .finally(() => (loading.value = false));
        });
};
const initForm = {
    name: '',
    id: '',
    permissions: [],
    describe: '',
} as formType;
const formRef = ref<FormInstance>();
const form = reactive({
    data: { ...initForm, ...props.data },
    checkPermission: (_rule: Rule, value: string[]) => {
        if (!value || value.length < 1) return Promise.reject('请选择权限');
        return Promise.resolve();
    },
});

type formType = {
    name: string;
    id: string;
    permissions: any[];
    describe: string;
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
    }
}
</style>
