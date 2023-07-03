<template>
    <j-modal
        visible
        title="重置密码"
        width="520px"
        :confirmLoading="loading"
        @cancel="emits('close')"
    >
        <j-steps :current="current" size="small" progress-dot @change="onChange">
            <j-step title="验证密码" />
            <j-step title="设置密码" />
            <j-step title="二次确认" />
        </j-steps>
        <div class="content">
            <j-form :model="form" layout="vertical" ref="formRef">
                <j-form-item
                    label="请输入当前密码"
                    name="oldPassword"
                    v-show="current === 0"
                    :rules="[
                        { required: true, message: '请输入当前密码' },
                        { validator: checkMethods.old, trigger: 'blur' },
                    ]"
                >
                    <j-input
                        v-model:value="form.oldPassword"
                        placeholder="请输入当前密码"
                    />
                </j-form-item>
                <j-form-item
                    label="请输入新密码"
                    name="newPassword"
                    v-show="current === 1"
                    :rules="[
                        { required: true, message: '请输入新密码' },
                        { validator: checkMethods.new, trigger: 'blur' },
                    ]"
                >
                    <j-input-password
                        v-model:value="form.newPassword"
                        placeholder="请输入新密码"
                    />
                </j-form-item>
                <j-form-item
                    label="请确认新密码"
                    v-show="current === 2"
                    name="confirmPassword"
                    :rules="[
                        { required: true, message: '请确认新密码' },
                        { validator: checkMethods.confirm, trigger: 'blur' },
                    ]"
                >
                    <j-input-password
                        v-model:value="form.confirmPassword"
                        placeholder="请确认新密码"
                    />
                </j-form-item>
            </j-form>
        </div>
        <template #footer>
            <j-button v-if="current === 0" @click="emits('close')">取消</j-button>
            <j-button v-if="current === 2" @click="onPrev">上一步</j-button>
            <j-button type="primary" v-else @click="onNext">下一步</j-button>
            <j-button v-if="current === 2" type="primary" @click="handleOk">完成</j-button>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import {
    updateMepsd_api,
    checkOldPassword_api,
    validateField_api,
} from '@/api/account/center';
import { onlyMessage } from '@/utils/comm';

type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emits = defineEmits(['save', 'close']);

const loading = ref(false);
const formRef = ref<any>();

const form = ref<formType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const current = ref<number>(0);

const onPrev = () => {
    current.value -= 1
}

const jumpStep = (val: number) => {
    if(val === 1) {
        formRef.value?.validate('oldPassword').then(() => {
            current.value += 1
        })
    } else if(val === 2) {
        formRef.value?.validate('newPassword').then(() => {
            current.value += 1
        })
    }
}

const onNext = () => {
    jumpStep(current.value + 1)
}

const onChange = (cur: number) => {
    jumpStep(cur)
}

const checkMethods = {
    old: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        try {
            const resp: any = await checkOldPassword_api(value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject('验证失败');
        }
    },
    new: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject('验证失败');
        }
    },
    confirm: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        else if (
            form.value.newPassword &&
            value !== form.value.newPassword
        ) {
            return Promise.reject('两次密码输入不一致');
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
                    onlyMessage('保存成功', 'success');
                    emits('save');
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped>
.content {
    padding: 20px 50px;
}
</style>
