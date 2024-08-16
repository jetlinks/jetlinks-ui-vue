<template>
    <j-modal
        :maskClosable="false"
        width="45vw"
        :title="$t('Save.input.233003-0')"
        @cancel="close"
        @ok="save"
        visible
        :cancelText="$t('Save.input.233003-1')"
        :okText="$t('Save.input.233003-2')"
    >
        <j-form layout="vertical" :model="inputData" ref="formRef">
            <j-form-item :label="$t('Save.input.233003-3')">
                <j-switch
                    :checked-children="$t('Save.input.233003-4')"
                    :un-checked-children="$t('Save.input.233003-4')"
                    v-model:checked="inputData.status"
                ></j-switch>
            </j-form-item>
            <j-form-item
                v-if="inputData.status"
                :label="$t('Save.input.233003-5')"
                name="address"
                :rules="[
                    {
                        required: true,
                        message: $t('Save.input.233003-6'),
                    },
                    {
                        max: 64,
                        message: $t('Save.input.233003-7'),
                    },
                ]"
            >
                <j-input
                    v-model:value="inputData.address"
                    :placeholder="$t('Save.input.233003-8')"
                ></j-input>
            </j-form-item>
            <j-form-item
                v-if="inputData.status"
                label="topic"
                name="topic"
                :rules="[
                    {
                        required: true,
                        message: $t('Save.input.233003-6'),
                    },
                    {
                        max: 64,
                        message: $t('Save.input.233003-7'),
                    },
                ]"
            >
                <j-input v-model:value="inputData.topic"></j-input>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { saveOutputData } from '@/api/rule-engine/config';
import { onlyMessage } from '@/utils/comm';
import { Form } from 'jetlinks-ui-components';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
                onlyMessage($t('Save.input.233003-9'));
                emit('saveSuc');
            }
        });
    });
};
const emit = defineEmits(['closeModel', 'saveSuc']);
</script>
<style lang="less" scoped>
</style>