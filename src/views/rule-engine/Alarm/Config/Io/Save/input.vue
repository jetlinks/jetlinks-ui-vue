<template>
    <j-modal
        :maskClosable="false"
        width="45vw"
        title="编辑"
        @cancel="close"
        @ok="save"
        visible
        cancelText="取消"
        okText="确定"
    >
        <j-form layout="vertical" :model="inputData" ref="formRef">
            <j-form-item
                label="kafka地址"
                name="address"
                :rules="[
                    {
                        max: 64,
                        message: '最多输入64个字符',
                    },
                ]"
            >
                <j-input
                    v-model:value="inputData.address"
                    placeholder="请输入kafka地址"
                ></j-input>
            </j-form-item>
            <j-form-item
                label="topic"
                name="topic"
                :rules="[
                    {
                        max: 64,
                        message: '最多输入64个字符',
                    },
                ]"
            >
                <j-input v-model:value="inputData.topic"></j-input>
            </j-form-item>
            <j-form-item label="状态">
                <j-switch
                    checked-children="启用"
                    un-checked-children="启用"
                    v-model:checked="inputData.status"
                ></j-switch>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { Form } from 'ant-design-vue';
import { saveOutputData } from '@/api/rule-engine/config';
import { message } from 'ant-design-vue/es';
const useForm = Form.useForm;
const formRef = ref();
const Myprops = defineProps({
    data: {
        default: '',
    },
});
let inputData = reactive({
    status: false,
    address: '',
    topic: '',
});
watchEffect(() => {
    inputData.status =
        Myprops.data?.data?.state?.value === 'enabled' ? true : false;
    inputData.address = Myprops.data?.data?.config?.config?.address;
    inputData.topic = Myprops.data?.data?.config?.config?.topic;
});

const close = () => {
    emit('closeModel');
};
const save = () => {
    formRef.value.validateFields().then(() => {
        saveOutputData({
            config: {
                sourceType: 'kafka',
                config: {
                    ...inputData,
                    state: inputData?.status ? 'enabled' : 'disable',
                },
            },
            state: inputData?.status ? 'enabled' : 'disable',
            id: Myprops?.data?.data?.id,
            sourceType: 'kafka',
            exchangeType: 'consume',
        }).then((res) => {
            if (res.status === 200) {
                message.success('操作成功');
                emit('saveSuc');
            }
        });
    });
};
const emit = defineEmits(['closeModel', 'saveSuc']);
</script>
<style lang="less" scoped>
</style>