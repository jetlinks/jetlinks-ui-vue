<template>
    <a-modal
        visible
        title="重置密码"
        width="615px"
        :bodyStyle="{
            padding: 0,
        }"
        :confirmLoading="loading"
        @cancel="emits('close')"
    >
        <div>
            <div style="background-color: #f8f9fc; padding: 24px">
                <a-steps
                    :current="current"
                    size="small"
                    progress-dot
                    @change="onChange"
                >
                    <a-step
                        :title="item"
                        v-for="(item, index) in list"
                        :key="item"
                    >
                        <template #description>
                            <span v-if="current === index">进行中</span>
                            <span v-if="current < index">未开始</span>
                            <span v-if="current > index">已完成</span>
                        </template>
                    </a-step>
                </a-steps>
            </div>
            <div class="content">
                <a-form :model="form" layout="vertical" ref="formRef">
                    <a-form-item
                        label="当前密码"
                        name="oldPassword"
                        v-show="current === 0"
                        :rules="[
                            { required: true, message: '请输入当前密码' },
                            { validator: checkMethods.old, trigger: 'blur' },
                        ]"
                    >
                        <a-input
                            v-model:value="form.oldPassword"
                            placeholder="请输入当前密码"
                        />
                    </a-form-item>
                    <a-form-item
                        label="新密码"
                        name="newPassword"
                        v-show="current === 1"
                        :rules="[
                            { required: true, message: '请输入新密码' },
                            { validator: checkMethods.new, trigger: 'blur' },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.newPassword"
                            placeholder="请输入新密码"
                        />
                    </a-form-item>
                    <a-form-item
                        label="确认新密码"
                        v-show="current === 2"
                        name="confirmPassword"
                        :rules="[
                            { required: true, message: '请确认新密码' },
                            {
                                validator: checkMethods.confirm,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.confirmPassword"
                            placeholder="请确认新密码"
                        />
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <template #footer>
            <a-button v-if="current === 0" @click="emits('close')"
                >取消</a-button
            >
            <a-button v-if="current === 2" @click="onPrev">上一步</a-button>
            <a-button type="primary" v-else @click="onNext">下一步</a-button>
            <a-button v-if="current === 2" type="primary" @click="handleOk"
                >完成</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import {
    updateMepsd_api,
    checkOldPassword_api,
    validateField_api,
} from '@/api/account/center';
import { onlyMessage } from "@jetlinks-web/utils";
import { Modal } from 'ant-design-vue';

type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emits = defineEmits(['close']);
const router = useRouter();

const list = ['验证密码', '设置密码', '二次确认'];

const loading = ref(false);
const formRef = ref<any>();

const form = ref<formType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const current = ref<number>(0);

const onPrev = () => {
    current.value -= 1;
};

const jumpStep = (val: number) => {
    if (val === 1) {
        formRef.value?.validate('oldPassword').then(() => {
            current.value += 1;
        });
    } else if (val === 2) {
        formRef.value?.validate('newPassword').then(() => {
            current.value += 1;
        });
    }
};

const onNext = () => {
    jumpStep(current.value + 1);
};

const onChange = (cur: number) => {
    jumpStep(cur);
};

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
        else if (form.value.newPassword && value !== form.value.newPassword) {
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
                    emits('close')
                    Modal.warning({
                        content: '密码已重置，请重新登录',
                        okText: '确定',
                        onOk() {
                            localStorage.clear();
                            router.push('/user/login');
                        },
                    });
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped lang="less">
.content {
    padding: 30px 50px;
}
</style>
