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
            <div style="background-color: #f8f9fc; padding: 24px">
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
                        v-show="current === 0"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.010161-5') },
                            { validator: checkMethods.old, trigger: 'blur' },
                        ]"
                    >
                        <a-input
                            v-model:value="form.oldPassword"
                            :placeholder="$t('EditPassword.index.010161-5')"
                        />
                    </a-form-item>
                    <a-form-item
                        :label="$t('EditPassword.index.010161-6')"
                        name="newPassword"
                        v-show="current === 1"
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
                        v-show="current === 2"
                        name="confirmPassword"
                        :rules="[
                            { required: true, message: $t('EditPassword.index.010161-9') },
                            {
                                validator: checkMethods.confirm,
                                trigger: 'blur',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.confirmPassword"
                            :placeholder="$t('EditPassword.index.010161-9')"
                        />
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <template #footer>
            <a-button v-if="current === 0" @click="emits('close')"
                >{{ $t('EditPassword.index.010161-10') }}</a-button
            >
            <a-button v-if="current === 2" @click="onPrev">{{ $t('EditPassword.index.010161-11') }}</a-button>
            <a-button type="primary" v-else @click="onNext">{{ $t('EditPassword.index.010161-12') }}</a-button>
            <a-button v-if="current === 2" type="primary" @click="handleOk"
                >{{ $t('EditPassword.index.010161-13') }}</a-button
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
type formType = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const emits = defineEmits(['close']);
const router = useRouter();

const list = [$t('EditPassword.index.010161-14'), $t('EditPassword.index.010161-15'), $t('EditPassword.index.010161-16')];

const loading = ref(false);
const formRef = ref<any>();

const form = ref<formType>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const current = ref<number>(0);

const jumpStep = (val: number) => {
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
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped lang="less">
.content {
    padding: 30px 50px;
}
</style>
