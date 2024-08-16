<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        destroyOnClose
        visible
        :title="props.data?.id ? $t('Save.index.052152-0') : $t('Save.index.052152-1')"
        @ok="handleSave"
        @cancel="handleCancel"
        :okText="$t('Save.index.052152-2')"
        :cancelText="$t('Save.index.052152-3')"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item :label="$t('Save.index.052152-4')" name="name">
                    <j-input
                        v-model:value="modelRef.name"
                        :placeholder="$t('Save.index.052152-5')"
                    />
                </j-form-item>
                <j-form-item :label="$t('Save.index.052152-6')" name="describe">
                    <j-textarea
                        v-model:value="modelRef.description"
                        :placeholder="$t('Save.index.052152-7')"
                        showCount
                        :maxlength="200"
                        :rows="4"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { saveRule, modify } from '@/api/rule-engine/instance';
import { getImage, onlyMessage } from '@/utils/comm';
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
            message: $t('Save.index.052152-5'),
        },
        {
            max: 64,
            message: $t('Save.index.052152-8'),
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
                    onlyMessage($t('Save.index.052152-9'));
                    emit('closeSave');
                    emit('success');
                } else {
                    onlyMessage($t('Save.index.052152-10'), 'error');
                }
            } else {
                let resp = await modify(modelRef.value?.id, modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    onlyMessage($t('Save.index.052152-9'));
                    emit('closeSave');
                    emit('success');
                } else {
                    onlyMessage($t('Save.index.052152-11'), 'error');
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>