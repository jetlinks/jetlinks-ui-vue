<template>
    <a-modal
        :maskClosable="false"
        width="650px"
        destroyOnClose
        open
        :title="props.data?.id ? $t('Save.index.020451-0') : $t('Save.index.020451-1')"
        @ok="handleSave"
        @cancel="handleCancel"
        :okText="$t('Save.index.020451-2')"
        :cancelText="$t('Save.index.020451-3')"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <a-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <a-form-item :label="$t('Save.index.020451-4')" name="name">
                    <a-input
                        v-model:value="modelRef.name"
                        :placeholder="$t('Save.index.020451-5')"
                    />
                </a-form-item>
                <a-form-item :label="$t('Save.index.020451-6')" name="describe">
                    <a-textarea
                        v-model:value="modelRef.description"
                        :placeholder="$t('Save.index.020451-7')"
                        showCount
                        :maxlength="200"
                        :rows="4"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { saveRule, modify } from '../../../api/instance';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emit = defineEmits(['success', 'closeSave']);
const props = defineProps({
    data: {
        type: Object,
    },
});

const productList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const formRef = ref();
const modelRef = ref();
modelRef.value = {...props.data};
const rules = {
    name: [
        {
            required: true,
            message: $t('Save.index.020451-5'),
        },
        {
            max: 64,
            message: $t('Save.index.020451-8'),
        },
    ],
};
const handleCancel = () => {
    emit('closeSave');
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            if (!modelRef.value?.id) {
                let resp = await saveRule(modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    onlyMessage($t('Save.index.020451-9'));
                    emit('closeSave');
                    emit('success');
                } else {
                    onlyMessage($t('Save.index.020451-10'), 'error');
                }
            } else {
                let resp = await modify(modelRef.value?.id, modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    onlyMessage($t('Save.index.020451-9'));
                    emit('closeSave');
                    emit('success');
                } else {
                    onlyMessage($t('Save.index.020451-11'), 'error');
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>