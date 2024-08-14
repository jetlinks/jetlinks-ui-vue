<template>
    <j-modal
        :title="$t('SolveComponent.index.891293-0')"
        :okText="$t('SolveComponent.index.891293-1')"
        :cancelText="$t('SolveComponent.index.891293-2')"
        visible
        @cancel="handleCancel"
        @ok="handleSave"
        destroyOnClose
        :confirmLoading="loading"
    >
        <j-form :rules="rules" layout="vertical" ref="formRef" :model="form">
            <j-form-item :label="$t('SolveComponent.index.891293-3')" name="describe">
                <j-textarea
                    :disabled="solveType === 'view'"
                    :rows="8"
                    :maxlength="200"
                    showCount
                    :placeholder="$t('SolveComponent.index.891293-4')"
                    v-model:value="form.describe"
                ></j-textarea>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { handleLog } from '@/api/rule-engine/log';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
    },
    solveType: {
        type: String,
        default: 'handle',
    },
    handleDes: {
        type: String,
        default: '',
    },
});
const loading = ref<boolean>(false);
const formRef = ref();
const rules = {
    describe: [
        {
            required: true,
            message: $t('SolveComponent.index.891293-4'),
        },
    ],
};
const form = reactive({
    describe: '',
});
const emit = defineEmits(['closeSolve', 'refresh']);
const handleCancel = () => {
    emit('closeSolve');
};
const handleSave = () => {
    if (props.solveType === 'view') {
        emit('closeSolve');
        return;
    }
    loading.value = true;
    formRef.value
        .validate()
        .then(async () => {
            const res = await handleLog({
                describe: form.describe,
                type: 'user',
                state: 'normal',
                alarmRecordId: props.data?.id || '',
                alarmConfigId: props.data?.alarmConfigId || '',
                alarmTime: props?.data?.alarmTime || '',
            });
            if (res.status === 200) {
                onlyMessage($t('SolveComponent.index.891293-5'));
                emit('refresh');
            } else {
                onlyMessage($t('SolveComponent.index.891293-6'), 'error');
            }
            loading.value = false;
        })
        .catch((error) => {
            console.log(error);
            loading.value = false;
        });
};
onMounted(() => {
    props.solveType === 'view' ? form.describe = props.handleDes : '';
});
</script>
<style lang="less" scoped></style>
