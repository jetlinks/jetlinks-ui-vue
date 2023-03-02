<template>
    <a-modal
        title="告警处理"
        okText="确定"
        cancelText="取消"
        visible
        @cancel="handleCancel"
        @ok="handleSave"
        destroyOnClose
        :confirmLoading="loading"
    >
        <a-form :rules="rules" layout="vertical" ref="formRef" :model="form">
            <a-form-item label="处理结果" name="describe">
                <a-textarea
                    :rows="8"
                    :maxlength="200"
                    showCount
                    placeholder="请输入处理结果"
                    v-model:value="form.describe"
                ></a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { handleLog } from '@/api/rule-engine/log';
import { onlyMessage } from '@/utils/comm';
const props = defineProps({
    data: {
        type: Object,
    },
});
const loading = ref<boolean>(false);
const formRef = ref();
const rules = {
    describe: [
        {
            required: true,
            message: '请输入处理结果',
        },
    ],
};
const form = reactive({
    describe: '',
});
let visible = ref(true);
const emit = defineEmits(['closeSolve'])
const handleCancel = () => {
    emit('closeSolve');
};
const handleSave = () => {
    loading.value = true;
    formRef.value
        .validate()
        .then(async () => {
            const res = await handleLog({
                describe: form.describe,
                type: 'user',
                state: 'normal',
                alarmRecordId: props.data?.current?.id || '',
                alarmConfigId: props.data?.current?.alarmConfigId || '',
                alarmTime: props?.data?.current?.alarmTime || '',
            });
            if (res.status === 200) {
                onlyMessage('操作成功！');
            } else {
                onlyMessage('操作失败！', 'error');
            }
            loading.value = false;
        })
        .catch((error) => {
            console.log(error);
            loading.value = false;
        });
};
</script>
<style lang="less" scoped>
</style>