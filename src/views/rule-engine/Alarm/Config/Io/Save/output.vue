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
        <j-form layout="vertical" :model="outputData" ref="formRef">
            <j-form-item label="状态">
                <j-switch
                    checked-children="启用"
                    un-checked-children="启用"
                    v-model:checked="outputData.status"
                ></j-switch>
            </j-form-item>
            <j-form-item
                v-if="outputData.status"
                label="kafka地址"
                name="address"
                :rules="[
                    {
                        required: true,
                        message: '请输入kafka地址',
                    },
                    {
                        max: 64,
                        message: '最多输入64个字符',
                    },
                ]"
            >
                <j-input
                    v-model:value="outputData.address"
                    placeholder="请输入kafka地址"
                ></j-input>
            </j-form-item>
            <j-form-item
                v-if="outputData.status"
                label="topic"
                name="topic"
                :rules="[
                    {
                        required: true,
                        message: '请输入topic',
                    },
                    {
                        max: 64,
                        message: '最多输入64个字符',
                    },
                ]"
            >
                <j-input v-model:value="outputData.topic"></j-input>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { saveOutputData } from '@/api/rule-engine/config';
import { Form, message } from 'jetlinks-ui-components';
const formRef = ref();
const useForm = Form.useForm;
const Myprops = defineProps({
    data: {
        default: '',
    },
});
let outputData = reactive({
    status: false,
    address: '',
    topic: '',
});
watchEffect(() => {
    outputData.status =
        Myprops.data?.data?.state?.value === 'enabled' ? true : false;
    outputData.address = Myprops.data?.data?.config?.config?.address;
    outputData.topic = Myprops.data?.data?.config?.config?.topic;
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
                    ...outputData,
                    state: outputData?.status ? 'enabled' : 'disable',
                },
            },
            state: outputData?.status ? 'enabled' : 'disable',
            id: Myprops?.data?.data?.id,
            sourceType: 'kafka',
            exchangeType: 'producer',
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