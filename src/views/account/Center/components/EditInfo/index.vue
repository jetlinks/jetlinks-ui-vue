<template>
    <j-modal
        visible
        :title="$t('EditInfo.index.752628-0')"
        @ok="handleOk"
        width="770px"
        @cancel="emits('close')"
        :confirmLoading="loading"
        :zIndex="1100"
        :maskClosable='false'
    >
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        :label="$t('EditInfo.index.752628-1')"
                        name="name"
                        :rules="[
                            { required: true, message: $t('EditInfo.index.752628-2') },
                            { max: 64, message: $t('EditInfo.index.752628-3') },
                        ]"
                    >
                        <j-input
                            v-model:value="form.name"
                            :placeholder="$t('EditInfo.index.752628-4')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item :label="$t('EditInfo.index.752628-5')">
                        <j-input
                            v-model:value="form.username"
                            :placeholder="$t('EditInfo.index.752628-6')"
                            disabled
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item :label="$t('EditInfo.index.752628-7')">
                        <j-input
                            :value="
                                form.roleList.map((item) => item.name).join(',')
                            "
                            :placeholder="$t('EditInfo.index.752628-8')"
                            disabled
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item :label="$t('EditInfo.index.752628-9')">
                        <j-input
                            :value="
                                form.orgList.map((item) => item.name).join(',')
                            "
                            :placeholder="$t('EditInfo.index.752628-10')"
                            disabled
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        :label="$t('EditInfo.index.752628-11')"
                        name="telephone"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: $t('EditInfo.index.752628-12'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.telephone"
                            :placeholder="$t('EditInfo.index.752628-13')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        :label="$t('EditInfo.index.752628-14')"
                        name="email"
                        :rules="[
                            {
                                type: 'email',
                                message: $t('EditInfo.index.752628-15'),
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.email"
                            :placeholder="$t('EditInfo.index.752628-16')"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { updateMeInfo_api } from '@/api/account/center';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emits = defineEmits(['save', 'close']);
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const loading = ref(false);
const form = ref<any>(cloneDeep(props.data));
const formRef = ref<any>();


const handleOk = () => {
    formRef.value?.validate().then(() => {
        loading.value = true;
        updateMeInfo_api(form.value)
            .then((resp) => {
                if (resp.status === 200) {
                    onlyMessage($t('EditInfo.index.752628-17'), 'success');
                    emits('save', form.value);
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped></style>
