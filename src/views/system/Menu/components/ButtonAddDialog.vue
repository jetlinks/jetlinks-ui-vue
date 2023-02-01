<template>
    <a-modal
        v-model:visible="dialog.visible"
        :title="form.mode"
        width="660px"
        @ok="dialog.handleOk"
    >
        <a-form :model="form.data" class="basic-form">
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
                :rules="[{ required: true, message: '请选择权限', validator: form.checkPermission, }]"
            >
                <PermissChoose
                    :first-width="8"
                    max-height="350px"
                    v-model:value="form.data.permissions"
                    :disabled="form.mode === '查看'"
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
import { Rule } from 'ant-design-vue/es/form';
import PermissChoose from '../components/PermissChoose.vue';

const emits = defineEmits(['confirm']);
const dialog = reactive({
    visible: false,
    handleOk: () => {
        dialog.changeVisible();
    },
    changeVisible: (mode?: string, formValue?: formType) => {
        dialog.visible = !dialog.visible;
        form.data = formValue || { ...initForm };
        form.mode = mode || '';
        console.log(1111111111, form.data);
    },
});
const initForm = {
    name: '',
    id: '',
    permissions: [],
    describe: '',
} as formType;
const form = reactive({
    data: { ...initForm },
    mode: '',
    checkPermission:async (_rule: Rule, value: string[])=>{
        if(!value || value.length < 1) return Promise.reject('请选择权限')
        return Promise.resolve()
    }
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
