<template>
    <j-modal
        title="类型"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <a-form ref="actionForm" :model="formModel" layout="vertical">
            <a-form-item
                label="类型"
                name="type"
                :rules="[
                    {
                        required: true,
                        message: '请选择类型',
                    },
                ]"
            >
                <j-card-select
                    v-model:value="formModel.type"
                    :options="options"
                    type="horizontal"
                    float="right"
                />
            </a-form-item>
            <template v-if="actionType === 'device'">
                <Device @cancel="onCancel" @save="onPropsOk" />
            </template>
            <template v-else-if="actionType === 'notify'">
                <Notify @cancel="onCancel" @save="onPropsOk" />
            </template>
            <template v-else-if="actionType === 'delay'">
                <Delay @cancel="onCancel" @save="onPropsOk" />
            </template>
        </a-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import Delay from '../Delay/index.vue'
import Notify from '../Notify/index.vue'
import Device from '../Device/index.vue'

const emit = defineEmits(['cancel', 'save']);

const options = [
    {
        label: '设备输出',
        value: 'device',
        iconUrl: getImage('/scene/device-type.png'),
        subLabel: '配置设备调用功能、读取属性、设置属性规则',
    },
    {
        label: '消息通知',
        value: 'notify',
        iconUrl: getImage('/scene/message-type.png'),
        subLabel: '配置向指定用户发邮件、钉钉、微信、短信等通知',
    },
    {
        label: '延迟执行',
        value: 'delay',
        iconUrl: getImage('/scene/delay-type.png'),
        subLabel: '等待一段时间后，再执行后续动作',
    },
    {
        label: '触发告警',
        value: 'trigger',
        iconUrl: getImage('/scene/trigger-type.png'),
        subLabel: '配置触发告警规则，需配合“告警配置”使用',
    },
    {
        label: '解除告警',
        value: 'relieve',
        iconUrl: getImage('/scene/cancel-type.png'),
        subLabel: '配置解除告警规则，需配合“告警配置”使用',
    },
];

const actionForm = ref();
const formModel = reactive({
    type: '',
});

const actionType = ref<string>('')

const onCancel = () => {
    emit('cancel');
};
const onOk = () => {
    actionForm.value.validate().then((values: any) => {
        actionType.value = values?.type
        if (values?.type === 'relieve' || values?.type === 'trigger') {
            // emit('save');
            //   props.save({ ...props.data, executor: 'alarm', alarm: { mode: values.type } }, {});
        }
    });
};

const onPropsOk = (data: any, option: any) => {
    console.log(data, option)
}
</script>