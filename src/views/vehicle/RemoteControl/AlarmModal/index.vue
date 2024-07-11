<template>
    <j-modal
        title="报警速度"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        width="400px"
        :confirmLoading="loading"
    >
        <j-form layout="vertical" :model="form" :rules="rules" ref="formRef">
            <j-form-item label="报警速度" name="alarmSpeed">
                <j-input v-model:value="form.alarmSpeed" placeholder="请输入" />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';

const visible = ref(false);
const loading = ref(false);
const formRef = ref();

const form = ref<any>([]);

const rules = reactive({
    alarmSpeed: [
        { required: true, message: '请填写报警速度', trigger: 'blur' },
        { max: 32, message: '最多可输入64位字符', trigger: 'change' },
    ],
});

/**
 * 显示弹窗
 */
const show = (data: any) => {
    visible.value = true;
    form.value = [];
};

defineExpose({
    show: show,
});

const submitData = () => {
    loading.value = true;
    formRef.value.validate().then(async () => {
        onlyMessage('确定', 'warning');
    });

    setTimeout(() => {
        loading.value = false;
    }, 1000);
};

const close = () => {
    visible.value = false;
};
</script>

<style scoped></style>
