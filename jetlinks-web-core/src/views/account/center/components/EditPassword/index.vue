<template>
    <a-modal
        visible
        :title="$t('EditPassword.index.010161-0')"
        width="615px"
        :bodyStyle="{
            padding: 0,
        }"
        :confirmLoading="loading"
        @cancel="emits('close')"
    >
        <div>
            <div v-if="!isResetMode" style="background-color: #f8f9fc; padding: 24px">
                <a-steps
                    :current="current"
                    size="small"
                    progress-dot
                >
<!--                  @change="onChange"-->
                    <a-step
                        :title="item"
                        v-for="(item, index) in list"
                        :key="item"
                    >
                        <template #description>
                            <span v-if="current === index">{{ $t('EditPassword.index.010161-1') }}</span>
                            <span v-if="current < index">{{ $t('EditPassword.index.010161-2') }}</span>
                            <span v-if="current > index">{{ $t('EditPassword.index.010161-3') }}</span>
                        </template>
                    </a-step>
                </a-steps>
            </div>
            <div class="content">
                <a-form :model="form" layout="vertical" ref="formRef">
                    <a-form-item
                        :label="$t('EditPassword.index.010161-4')"
                        name="oldPassword"
                        v-show="current === 0 && !isResetMode"
                        :rules="isResetMode ? [] : [
                            { required: true, message: $t('EditPassword.index.010161-5') },
                            { validator: checkMethods.old, trigger: 'blur' },
                        ]"
                    >
                        <template #extra>
                            <a-button type="link" size="small" @click="handleForgotPassword" style="padding: 0;">
                                {{ $t('EditPassword.index.010161-22') }}
                            </a-button>
                        </template>
                        <a-input
                            v-model:value="form.oldPassword"
                            :placeholder="$t('EditPassword.index.010161-5')"
                        />
                    </a-form-item>
                    <a-form-item
                        :label="$t('EditPassword.index.010161-6')"
                        name="newPassword"
                        v-show="(current === 1 && !isResetMode) || isResetMode"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.010161-7') },
                            { validator: checkMethods.new, trigger: 'blur' },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.newPassword"
                            :placeholder="$t('EditPassword.index.010161-7')"
                        />
                    </a-form-item>
                    <a-form-item
                        :label="$t('EditPassword.index.010161-8')"
                        v-show="(current === 2 && !isResetMode) || isResetMode"
                        name="confirmPassword"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.010161-9') },
                            {
                                validator: checkMethods.confirm,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.confirmPassword"
                            :placeholder="$t('EditPassword.index.010161-9')"
                        />
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <template #footer>
            <template v-if="isResetMode">
                <a-button @click="emits('close')">{{ $t('EditPassword.index.010161-10') }}</a-button>
                <a-button type="primary" @click="handleOk">{{ $t('EditPassword.index.010161-13') }}</a-button>
            </template>
            <template v-else>
                <a-button v-if="current === 0" @click="emits('close')">{{ $t('EditPassword.index.010161-10') }}</a-button>
                <a-button v-if="current === 2" @click="onPrev">{{ $t('EditPassword.index.010161-11') }}</a-button>
                <a-button type="primary" v-if="current !== 2" @click="onNext">{{ $t('EditPassword.index.010161-12') }}</a-button>
                <a-button v-if="current === 2" type="primary" @click="handleOk">{{ $t('EditPassword.index.010161-13') }}</a-button>
            </template>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import {
    updateMepsd_api,
    checkOldPassword_api,
    validateField_api,
    resetPassword_api,
} from '@jetlinks-web-core/api/account/center';
import { onlyMessage } from "@jetlinks-web/utils";
import { Modal } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emits = defineEmits(['close']);
const router = useRouter();

const props = defineProps({
  type: {
    type: Boolean,
    default: false
  }
})

// 是否为重置密码模式（忘记密码）
const isResetMode = ref(props.type);

const list = computed(() => {
    if (isResetMode.value) {
        return [$t('EditPassword.index.010161-15'), $t('EditPassword.index.010161-16')];
    }
    return [$t('EditPassword.index.010161-14'), $t('EditPassword.index.010161-15'), $t('EditPassword.index.010161-16')];
});

const loading = ref(false);
const formRef = ref<any>();

const form = ref<formType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const current = ref<number>(0);

const jumpStep = (val: number) => {
    if (isResetMode.value) {
        // 重置密码模式：只有两步（新密码、确认密码）
        if (val === 1) {
            formRef.value?.validate('newPassword').then(() => {
                current.value = val
            });
        } else {
            current.value = val
        }
    } else {
        // 修改密码模式：三步（旧密码、新密码、确认密码）
        if (val === 1) {
            formRef.value?.validate('oldPassword').then(() => {
                current.value = val
            });
        } else if (val === 2) {
            formRef.value?.validate('newPassword').then(() => {
                current.value = val
            });
        } else {
            current.value = val
        }
    }
};

const onPrev = () => {
  current.value -= 1;
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
            return Promise.reject($t('EditPassword.index.010161-17'));
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
            return Promise.reject($t('EditPassword.index.010161-17'));
        }
    },
    confirm: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        else if (form.value.newPassword && value !== form.value.newPassword) {
            return Promise.reject($t('EditPassword.index.010161-18'));
        }
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject($t('EditPassword.index.010161-17'));
        }
    },
};

const handleForgotPassword = () => {
    // 切换到重置密码模式
    isResetMode.value = true;
    // 清空表单
    form.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    formRef.value?.resetFields();
};

const handleOk = () => {
    const validateFields = isResetMode.value 
        ? ['newPassword', 'confirmPassword'] 
        : ['oldPassword', 'newPassword', 'confirmPassword'];
    
    formRef.value?.validate(validateFields).then(() => {
        loading.value = true;
        if (isResetMode.value) {
            // 重置密码模式：调用重置密码接口
            resetPassword_api({ password: form.value.newPassword })
                .then((resp) => {
                    if (resp.status === 200) {
                        onlyMessage($t('EditPassword.index.010161-19'), 'success');
                        emits('close')
                        Modal.warning({
                            content: $t('EditPassword.index.010161-20'),
                            okText: $t('EditPassword.index.010161-21'),
                            onOk() {
                                localStorage.clear();
                                router.push('/user/login');
                            },
                        });
                    }
                })
                .catch((error) => {
                    // 取消验证时不显示错误提示
                    if (error?.message === 'verify_canceled' || error?.message?.includes('verify_canceled')) {
                        return;
                    }
                    onlyMessage(error?.message || $t('EditPassword.index.010161-17'), 'error');
                })
                .finally(() => (loading.value = false));
        } else {
            // 修改密码模式：调用修改密码接口
            const params = {
                oldPassword: form.value.oldPassword,
                newPassword: form.value.newPassword,
            };
            updateMepsd_api(params)
                .then((resp) => {
                    if (resp.status === 200) {
                        onlyMessage($t('EditPassword.index.010161-19'), 'success');
                        emits('close')
                        Modal.warning({
                            content: $t('EditPassword.index.010161-20'),
                            okText: $t('EditPassword.index.010161-21'),
                            onOk() {
                                localStorage.clear();
                                router.push('/user/login');
                            },
                        });
                    }
                })
                .catch((error) => {
                    // 取消验证时不显示错误提示
                    if (error?.message === 'verify_canceled' || error?.message?.includes('verify_canceled')) {
                        return;
                    }
                    onlyMessage(error?.message || $t('EditPassword.index.010161-17'), 'error');
                })
                .finally(() => (loading.value = false));
        }
    }).catch((error) => {
        // 表单验证失败，不处理，让 Ant Design 显示错误信息
        console.error('Form validation failed:', error);
    });
};
</script>

<style scoped lang="less">
.content {
    padding: 30px 50px;
}
</style>
