<template>
    <a-modal
        v-model:visible="dialog.visible"
        :title="form.mode"
        width="660px"
        @ok="dialog.handleOk"
        :maskClosable="false"
        cancelText="取消"
        okText="确定"
        :confirmLoading="dialog.loading"
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
                    :disabled="form.mode !== '新增'"
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
                    :disabled="form.mode === '查看'"
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
                <!-- <a-form-item-rest>
                    <PermissChoose
                        :first-width="8"
                        max-height="350px"
                        v-model:value="form.data.permissions"
                        :disabled="form.mode === '查看'"
                    />
                </a-form-item-rest> -->
                <PermissChoose
                    :first-width="8"
                    max-height="350px"
                    v-model:value="form.data.permissions"
                    :disabled="form.mode === '查看'"
                    :key="form.data.id || ''"
                />
            </a-form-item>
            <a-form-item label="说明" name="describe">
                <a-textarea
                    v-model:value="form.data.describe"
                    :rows="4"
                    placeholder="请输入说明"
                    :disabled="form.mode === '查看'"
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

const props = defineProps<{
    menuInfo: {
        buttons: formType[];
        id: string;
    };
}>();
const emits = defineEmits(['confirm']);
const dialog = reactive({
    visible: false,
    loading: false,
    handleOk: () => {
        props.menuInfo.id &&
            formRef.value &&
            formRef.value
                .validate()
                .then(() => {
                    const buttons = toRaw(props.menuInfo.buttons);
                    const button = buttons.find(
                        (item) => item.id === form.data.id,
                    );
                    if (button) {
                        Object.entries(form.data).forEach(([key, value]) => {
                            button[key] = value;
                        });
                    } else buttons.push({ ...form.data });
                    const params = {
                        ...props.menuInfo,
                        buttons,
                    };
                    dialog.loading = true;
                    saveMenuInfo_api(params)
                        .then((resp) => {
                            dialog.changeVisible();
                            message.success('操作成功');
                            emits('confirm');
                        })
                        .finally(() => (dialog.loading = false));
                })
                .catch(() => {});
    },
    changeVisible: (mode?: string, formValue?: formType) => {
        dialog.visible = !dialog.visible;
        form.data = { ...initForm, ...formValue };
        form.mode = mode || '';

        formRef.value && formRef.value.clearValidate();
    },
});
const initForm = {
    name: '',
    id: '',
    permissions: [],
    describe: '',
} as formType;
const formRef = ref<FormInstance>();
const form = reactive({
    data: { ...initForm },
    mode: '',
    checkPermission: async (_rule: Rule, value: string[]) => {
        if (!value || value.length < 1) return Promise.reject('请选择权限');
        return Promise.resolve();
    },
});

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
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
