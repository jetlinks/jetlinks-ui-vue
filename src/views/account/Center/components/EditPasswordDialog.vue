<template>
    <j-modal
        visible
        title="重置密码"
        @ok="handleOk"
        width="520px"
        :confirmLoading="loading"
        @cancel="emits('update:visible', false)"
    >
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-form-item
                label="旧密码"
                name="oldPassword"
                :rules="[
                    { required: true, message: '请输入密码' },
                    { validator: checkMethods.old, trigger: 'blur' },
                ]"
            >
                <j-input
                    v-model:value="form.oldPassword"
                    placeholder="请输入旧密码"
                />
            </j-form-item>
            <j-form-item
                label="密码"
                name="newPassword"

                :rules="[
                    { required: true, message: '请输入密码' },
                    { validator: checkMethods.new, trigger: 'blur' },
                ]"
            >
                <j-input-password
                    v-model:value="form.newPassword"
                    placeholder="请输入密码"
                />
            </j-form-item>
            <j-form-item
                label="确认密码"
                name="confirmPassword"
                :rules="[
                    { required: true, message: '请输入确认密码' },
                    { validator: checkMethods.confirm, trigger: 'blur' },
                ]"
            >
                <j-input-password
                    v-model:value="form.confirmPassword"
                    placeholder="请再次输入密码"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import {
    updateMepsd_api,
    checkOldPassword_api,
    validateField_api,
} from '@/api/account/center';
import { FormInstance, message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/lib/form';

const emits = defineEmits(['ok', 'update:visible']);
const props = defineProps<{
    visible: boolean;
}>();
const loading = ref(false);
const formRef = ref<FormInstance>();
const form = ref<formType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const checkMethods = {
    old: async (_rule: Rule, value: string) => {
        if (!value) return Promise.reject('请输入密码');
        try {
            const resp: any = await checkOldPassword_api(value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject('验证失败');
        }
    },
    new: async (_rule: Rule, value: string) => {
        if (!value) return Promise.reject('请输入密码');
        else if (
            form.value.confirmPassword &&
            value !== form.value.confirmPassword
        )
            return Promise.reject('两次密码输入不一致');
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject('验证失败');
        }
    },
    confirm: async (_rule: Rule, value: string) => {
        if (!value) return Promise.reject();
        else if (form.value.newPassword && value !== form.value.newPassword) {
            formRef.value?.validate('newPassword');
        }
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject('验证失败');
        }
    },
};

const handleOk = () => {
    formRef.value?.validate().then(() => {
        loading.value = true;
        const params = {
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
        };
        updateMepsd_api(params)
            .then((resp) => {
                if (resp.status === 200) {
                    message.success('保存成功');
                    emits('ok');
                    emits('update:visible', false);
                }
            })
            .finally(() => (loading.value = false));
    });
};

type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};
</script>

<style scoped></style>
