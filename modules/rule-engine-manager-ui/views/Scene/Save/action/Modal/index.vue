<template>
    <a-modal
        :title="$t('Modal.index.966774-0')"
        open
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <a-form ref="actionForm" :model="formModel" layout="vertical">
            <a-form-item
                name="type"
                :rules="[
                    {
                        required: true,
                        message: $t('Modal.index.966774-1'),
                    },
                ]"

            >
                <template #label>
                  <div style="position: relative">
                    {{ $t('Modal.index.966774-0') }}
                    <template v-if="data.executor">
                        <div v-if="optionDisabled" class="action-tip">
                            {{ $t('Modal.index.966774-2') }}
                        </div>
                        <div v-else class="action-tip">
                            {{ $t('Modal.index.966774-2-1') }}
                        </div>
                    </template>
                  </div>
                </template>
                <CardSelect v-model:value="formModel.type" :options="actionList"/>
            </a-form-item>
            <ActionTypeComponent
                v-bind="props"
                v-if="!!actionType"
                :actionType="actionType"
                :options='actionOptions'
                @save="onPropsOk"
                @cancel="onPropsCancel"
            />
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup name='UpdateActionItemModal'>
import { PropType } from 'vue';
import { ActionsType } from '../../../typings';
import ActionTypeComponent from './ActionTypeComponent.vue';
import { randomNumber, randomString } from '@jetlinks-web/utils';
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

const options = inject('action-options', [])

const actionList = computed(() => {
  return options.value.filter(item => !(item.value === 'delay' && props.parallel)).map(item => {
    return {
      ...item,
      disabled: (!['trigger', 'relieve'].includes(item.value) && props.data.executor === 'alarm') || (['trigger', 'relieve'].includes(item.value) && props.data.executor && props.data.executor !== 'alarm')
    }
  })
})
// const options = [
//   {
//     label: $t('Modal.index.966774-3'),
//     value: 'device',
//     iconUrl: 'icon-shebeishuchu',
//     subLabel: $t('Modal.index.966774-4'),
//     disabled: optionDisabled
//   },
//   {
//     label: $t('Modal.index.966774-5'),
//     value: 'notify',
//     iconUrl: 'icon-xiaoxitongzhi',
//     subLabel: $t('Modal.index.966774-6'),
//     disabled: optionDisabled
//   },
//   {
//     label: $t('Modal.index.966774-7'),
//     value: 'delay',
//     iconUrl: 'icon-yanchizhihang',
//     subLabel: $t('Modal.index.966774-8'),
//     disabled: optionDisabled
//   },
//   {
//     label: $t('Modal.index.966774-9'),
//     value: 'trigger',
//     iconUrl: 'icon-chufagaojing',
//     subLabel: $t('Modal.index.966774-10'),
//   },
//   {
//     label: $t('Modal.index.966774-11'),
//     value: 'relieve',
//     iconUrl: 'icon-jiechugaojing',
//     subLabel: $t('Modal.index.966774-12'),
//   },
// ];

const actionForm = ref();
const formModel = reactive({
    type: 'device-data',
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
