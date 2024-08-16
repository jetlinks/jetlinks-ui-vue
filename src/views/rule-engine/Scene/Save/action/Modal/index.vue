<template>
    <j-modal
        :title="$t('Modal.index.5425969-0')"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <j-form ref="actionForm" :model="formModel" layout="vertical">
            <j-form-item
                name="type"
                :rules="[
                    {
                        required: true,
                        message: $t('Modal.index.5425969-1'),
                    },
                ]"

            >
                <template #label>
                  <div style="position: relative">
                    {{ $t('Modal.index.5425969-0') }}
                    <div v-if="optionDisabled" class="action-tip">
                      {{ $t('Modal.index.5425969-2') }}
                    </div>
                  </div>
                </template>
                <CardSelect v-model:value="formModel.type" :options="options.filter(item => !(item.value === 'delay' && parallel))"/>
            </j-form-item>
            <ActionTypeComponent
                v-bind="props"
                v-if="!!actionType"
                :actionType="actionType"
                :options='actionOptions'
                @save="onPropsOk"
                @cancel="onPropsCancel"
            />
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup name='UpdateActionItemModal'>
import { PropType } from 'vue';
import { ActionsType } from '../../../typings';
import ActionTypeComponent from './ActionTypeComponent.vue';
import { randomNumber, randomString } from '@/utils/utils';
import CardSelect from '../../components/CardSelect.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
            actionId: randomNumber(),
        }),
    },
    parallel: {
        type: Boolean,
    },
    actionOptions: {
      type: Object,
      default: () => ({})
    }
});

const emit = defineEmits(['cancel', 'save']);

const optionDisabled = Object.keys(props.data).length > 2 && props.data?.executor === 'alarm'

const options = [
  {
    label: $t('Modal.index.5425969-3'),
    value: 'device',
    iconUrl: 'icon-shebeishuchu',
    subLabel: $t('Modal.index.5425969-4'),
    disabled: optionDisabled
  },
  {
    label: $t('Modal.index.5425969-5'),
    value: 'notify',
    iconUrl: 'icon-xiaoxitongzhi',
    subLabel: $t('Modal.index.5425969-6'),
    disabled: optionDisabled
  },
  {
    label: $t('Modal.index.5425969-7'),
    value: 'delay',
    iconUrl: 'icon-yanchizhihang',
    subLabel: $t('Modal.index.5425969-8'),
    disabled: optionDisabled
  },
  {
    label: $t('Modal.index.5425969-9'),
    value: 'trigger',
    iconUrl: 'icon-chufagaojing',
    subLabel: $t('Modal.index.5425969-10'),
  },
  {
    label: $t('Modal.index.5425969-11'),
    value: 'relieve',
    iconUrl: 'icon-jiechugaojing',
    subLabel: $t('Modal.index.5425969-12'),
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
                    actionId: props.data.actionId,
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
<style scoped>
.action-tip {
  position: absolute;
  top: 0;
  left: 50px;
  width: 500px;
  color: #777;
}
</style>
