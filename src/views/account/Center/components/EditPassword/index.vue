<template>
    <j-modal
        visible
        :title="$t('EditPassword.index.752622-0')"
        width="615px"
        :bodyStyle="{
            padding: 0,
        }"
        :confirmLoading="loading"
        @cancel="emits('close')"
    >
        <div>
            <div style="background-color: #f8f9fc; padding: 24px">
                <j-steps
                    :current="current"
                    size="small"
                    progress-dot
                    @change="onChange"
                >
                    <j-step
                        :title="item"
                        v-for="(item, index) in list"
                        :key="item"
                    >
                        <template #description>
                            <span v-if="current === index">{{ $t('EditPassword.index.752622-1') }}</span>
                            <span v-if="current < index">{{ $t('EditPassword.index.752622-2') }}</span>
                            <span v-if="current > index">{{ $t('EditPassword.index.752622-3') }}</span>
                        </template>
                    </j-step>
                </j-steps>
            </div>
            <div class="content">
                <j-form :model="form" layout="vertical" ref="formRef">
                    <j-form-item
                        :label="$t('EditPassword.index.752622-4')"
                        name="oldPassword"
                        v-show="current === 0"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.752622-5') },
                            { validator: checkMethods.old, trigger: 'blur' },
                        ]"
                    >
                        <j-input
                            v-model:value="form.oldPassword"
                            :placeholder="$t('EditPassword.index.752622-5')"
                        />
                    </j-form-item>
                    <j-form-item
                        :label="$t('EditPassword.index.752622-6')"
                        name="newPassword"
                        v-show="current === 1"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.752622-7') },
                            { validator: checkMethods.new, trigger: 'blur' },
                        ]"
                    >
                        <j-input-password
                            v-model:value="form.newPassword"
                            :placeholder="$t('EditPassword.index.752622-7')"
                        />
                    </j-form-item>
                    <j-form-item
                        :label="$t('EditPassword.index.752622-8')"
                        v-show="current === 2"
                        name="confirmPassword"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.752622-9') },
                            {
                                validator: checkMethods.confirm,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.confirmPassword"
                            :placeholder="$t('EditPassword.index.752622-9')"
                        />
                    </j-form-item>
                </j-form>
            </div>
        </div>
        <template #footer>
            <j-button v-if="current === 0" @click="emits('close')"
                >{{ $t('EditPassword.index.752622-10') }}</j-button
            >
            <j-button v-if="current === 2" @click="onPrev">{{ $t('EditPassword.index.752622-11') }}</j-button>
            <j-button type="primary" v-else @click="onNext">{{ $t('EditPassword.index.752622-12') }}</j-button>
            <j-button v-if="current === 2" type="primary" @click="handleOk"
                >{{ $t('EditPassword.index.752622-13') }}</j-button
            >
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
import { Modal } from 'jetlinks-ui-components';
import { LoginPath } from '@/router/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emits = defineEmits(['close']);
const router = useRouter();

const list = [$t('EditPassword.index.752622-14'), $t('EditPassword.index.752622-15'), $t('EditPassword.index.752622-16')];

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
            return Promise.reject($t('EditPassword.index.752622-17'));
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
            return Promise.reject($t('EditPassword.index.752622-17'));
        }
    },
    confirm: async (_rule: any, value: string) => {
        if (!value) return Promise.resolve();
        else if (form.value.newPassword && value !== form.value.newPassword) {
            return Promise.reject($t('EditPassword.index.752622-18'));
        }
        try {
            const resp: any = await validateField_api('password', value);
            if (resp.status === 200 && !resp.result.passed)
                return Promise.reject(resp.result.reason);
            else return Promise.resolve();
        } catch (error) {
            return Promise.reject($t('EditPassword.index.752622-17'));
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
                    onlyMessage($t('EditPassword.index.752622-19'), 'success');
                    emits('close')
                    Modal.warning({
                        content: $t('EditPassword.index.752622-20'),
                        okText: $t('EditPassword.index.752622-21'),
                        onOk() {
                            localStorage.clear();
                            router.push(LoginPath);
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
