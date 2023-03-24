<template>
    <j-modal
        title="类型"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <j-form ref="actionForm" :model="formModel" layout="vertical">
            <j-form-item
                label="类型"
                name="type"
                :rules="[
                    {
                        required: true,
                        message: '请选择类型',
                    },
                ]"
            >
                <CardSelect v-model:value="formModel.type" :options="options.filter(item => !(item.value === 'delay' && parallel))"/>
            </j-form-item>
            <ActionTypeComponent
                v-bind="props"
                v-if="!!actionType"
                :actionType="actionType"
                @save="onPropsOk"
                @cancel="onPropsCancel"
            />
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import Delay from '../Delay/index.vue';
import Notify from '../Notify/index.vue';
import Device from '../Device/index.vue';
import { PropType } from 'vue';
import { ActionsType } from '../../../typings';
import ActionTypeComponent from './ActionTypeComponent.vue';
import { randomString } from '@/utils/utils';
import CardSelect from '../../components/CardSelect.vue'

const props = defineProps({
    branchesName: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    name: {
        type: Number,
        default: 0,
    },
    data: {
        type: Object as PropType<ActionsType>,
        default: () => ({
            key: randomString(),
        }),
    },
    parallel: {
        type: Boolean,
    },
});

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
    type: 'device',
});

const actionType = ref<string>('');

watch(
    () => props.data,
    (newVal) => {
        if (newVal?.executor) {
            formModel.type = (
                newVal?.executor === 'alarm'
                    ? newVal?.alarm?.mode
                    : newVal?.executor
            ) as string;
        }
    },
    {
        immediate: true,
        deep: true,
    },
);
const onOk = () => {
    actionForm.value.validate().then((values: any) => {
        actionType.value = values?.type;
        if (values?.type === 'relieve' || values?.type === 'trigger') {
            emit(
                'save',
                {
                    // ...props.data,
                    key: props.data.key,
                    executor: 'alarm',
                    alarm: { mode: values.type },
                },
                {},
            );
        }
    });
};

const onCancel = () => {
    emit('cancel');
};

const onPropsOk = (data: any, options?: any) => {
    emit('save', { ...data, executor: data.type }, options);
    actionType.value = '';
};

const onPropsCancel = () => {
    actionType.value = '';
};
</script>