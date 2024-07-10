<template>
    <j-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        width="350px"
        :confirmLoading="loading"
    >
        <j-form layout="vertical" :model="form" :rules="rules" ref="formRef">
            <j-form-item :label="props.myForm.label" :name="props.myForm.name">
                <j-input
                    v-model:value="form.networkCardId"
                    placeholder="请输入"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
const visible = ref(false);
const loading = ref(false);

const props = defineProps({
    title: { type: String, default: '最高限速' },
    myForm: {
        type: Object,
        default: {
            label: '最高限速',
            name: 'maximumSpeedLimit',
        },
    },
});

const form = ref<any>([]);

const rules = reactive({
    maximumSpeedLimit: [
        { required: true, message: '请填写最高限速', trigger: 'blur' },
        { max: 64, message: '最多可输入64位字符', trigger: 'change' },
    ],
});

const submitData = () => {};

const close = () => {};
</script>

<style scoped></style>
