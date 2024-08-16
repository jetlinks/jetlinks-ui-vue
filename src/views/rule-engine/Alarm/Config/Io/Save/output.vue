<template>
    <j-modal
        :maskClosable="false"
        width="45vw"
        :title="$t('Save.output.233002-0')"
        @cancel="close"
        @ok="save"
        visible
        :cancelText="$t('Save.output.233002-1')"
        :okText="$t('Save.output.233002-2')"
    >
        <j-form layout="vertical" :model="outputData" ref="formRef">
            <j-form-item :label="$t('Save.output.233002-3')">
                <j-switch
                    :checked-children="$t('Save.output.233002-4')"
                    :un-checked-children="$t('Save.output.233002-4')"
                    v-model:checked="outputData.status"
                ></j-switch>
            </j-form-item>
            <j-form-item
                v-if="outputData.status"
                :label="$t('Save.output.233002-5')"
                name="address"
                :rules="[
                    {
                        required: true,
                        message: $t('Save.output.233002-6'),
                    },
                    {
                        max: 64,
                        message: $t('Save.output.233002-7'),
                    },
                ]"
            >
                <j-input
                    v-model:value="outputData.address"
                    :placeholder="$t('Save.output.233002-6')"
                ></j-input>
            </j-form-item>
            <j-form-item
                v-if="outputData.status"
                label="topic"
                name="topic"
                :rules="[
                    {
                        required: true,
                        message: $t('Save.output.233002-8'),
                    },
                    {
                        max: 64,
                        message: $t('Save.output.233002-7'),
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
import { onlyMessage } from '@/utils/comm';
import { Form } from 'jetlinks-ui-components';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
                onlyMessage($t('Save.output.233002-9'));
                emit('saveSuc');
            }
        });
    });
};
const emit = defineEmits(['closeModel', 'saveSuc']);
</script>
<style lang="less" scoped>
</style>