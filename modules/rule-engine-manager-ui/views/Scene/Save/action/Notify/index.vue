<template>
    <a-modal
        :title="$t('Notify.index.966771-0')"
        open
        :width="900"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <div class="steps-steps">
            <a-steps :current="current" size="small" @change="onChange">
                <a-step :title="$t('Notify.index.966771-1')" key="way" />
                <a-step :title="$t('Notify.index.966771-2')" key="config" />
                <a-step :title="$t('Notify.index.966771-3')" key="template" />
                <a-step :title="$t('Notify.index.966771-4')" key="variable" />
            </a-steps>
        </div>
        <div class="steps-content">
            <a-form ref="actionForm" :model="formModel" layout="vertical">
                <template v-if="current === 0">
                    <a-form-item
                        :label="$t('Notify.index.966771-5')"
                        name="notifyType"
                        :rules="[
                            {
                                required: true,
                                message: $t('Notify.index.966771-6'),
                            },
                        ]"
                    >
                        <NotifyWay
                            v-model:value="formModel.notifyType"
                            @change="(val) => onValChange(val, 'notifyType')"
                        />
                    </a-form-item>
                </template>
                <template v-if="current === 1">
                    <a-form-item name="notifierId">
                        <NotifyConfig
                            v-model:value="formModel.notifierId"
                            :notifyType="formModel.notifyType"
                            @change="(val) => onValChange(val, 'notifierId')"
                        />
                    </a-form-item>
                </template>
                <template v-if="current === 2">
                    <a-form-item name="templateId">
                        <NotifyTemplate
                            v-model:value="formModel.templateId"
                            v-model:detail="template"
                            :notifyType="formModel.notifyType"
                            :notifierId="formModel.notifierId"
                            @change="(val) => onValChange(val, 'templateId')"
                        />
                    </a-form-item>
                </template>
                <template v-if="current === 3">
                    <a-form-item name="variables">
                        <VariableDefinitions
                            :variableDefinitions="variable"
                            :value="formModel.variables"
                            :notify="formModel"
                            :template="template"
                            :options='formModel.options'
                            :name="name"
                            :thenName="thenName"
                            :branchesName="branchesName"
                            @change="(val) => onValChange(val, 'variables')"
                            ref="variableRef"
                        />
                    </a-form-item>
                </template>
            </a-form>
        </div>
        <template #footer>
            <a-space>
                <a-button v-if="current === 0" @click="onCancel">{{ $t('Notify.index.966771-7') }}</a-button>
                <a-button v-if="current > 0" @click="prev">{{ $t('Notify.index.966771-8') }}</a-button>
                <a-button v-if="current < 3" type="primary" @click="next"
                    >{{ $t('Notify.index.966771-9') }}</a-button
                >
                <a-button v-if="current === 3" type="primary" @click="onOk"
                    >{{ $t('Notify.index.966771-10') }}</a-button
                >
            </a-space>
        </template>
    </a-modal>
</template>

<script lang="ts" setup name='NotifyIndex'>
import NotifyWay from './NotifyWay.vue';
import NotifyConfig from './NotifyConfig.vue';
import NotifyTemplate from './NotifyTemplate.vue';
import VariableDefinitions from './VariableDefinitions.vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { getTemplateDetail , queryTemplateDetail} from '../../../../../api/others'
import { PropType } from 'vue';
import { NotifyProps } from '../../../typings';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    value: {
        type: Object as PropType<Partial<NotifyProps>>,
        default: () => undefined,
    },
    options: {
        type: Object,
        default: () => ({}),
    },
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
});

const emit = defineEmits(['cancel', 'save']);

const current = ref(0);

const formModel = reactive({
    notifyType: '',
    notifierId: '',
    templateId: '',
    variables: {},
    options: {},
});

const variable = ref([]);
const variableRef = ref();
const template = ref();

watch(
    () => props.value,
    (newVal) => {
        Object.assign(formModel, newVal);
        if(newVal?.templateId){
            queryTemplateDetail(newVal?.templateId).then((resp: any) => {
                if(resp.status === 200){
                    template.value = resp.result
                }
            })
        }
    },
    { deep: true, immediate: true },
);

watchEffect(() => {
    formModel.options = props.options || {};
});

const onValChange = (val: any, type: string) => {
    if (type === 'notifyType') {
        formModel.templateId = '';
        formModel.variables = [];
        formModel.notifierId = '';
        formModel.options = {}
    } else if (type === 'notifierId') {
        formModel.templateId = '';
        formModel.variables = [];
        formModel.options = {
            ...val
        }
    } else if (type === 'templateId') {
        formModel.variables = [];
        formModel.options = {
            provider: formModel?.options?.provider || '',
            ...val
        }
    }
    formModel.options = {
        ...unref(formModel.options),
        ...val,
    };
};

const jumpStep = async (val: number) => {
    if (val === 0) {
        current.value = val;
    } else if (val === 1) {
        if (formModel.notifyType) {
            current.value = val;
        } else {
            onlyMessage($t('Notify.index.966771-6'), 'error');
        }
    } else if (val === 2) {
        if (formModel.notifierId) {
            current.value = val;
        } else {
            onlyMessage($t('Notify.index.966771-11'), 'error');
        }
    } else if (val === 3) {
        if (formModel.templateId) {
            const resp = await getTemplateDetail(formModel.templateId);
            if (resp.status === 200) {
                variable.value = resp.result?.variableDefinitions || [];
                current.value = val;
            }
        } else {
            onlyMessage($t('Notify.index.966771-12'), 'error');
        }
    }
};

const onChange = (cur: number) => {
    jumpStep(cur);
};

const prev = () => {
    current.value -= 1;
};

const next = async () => {
    jumpStep(current.value + 1);
};

const onCancel = () => {
    emit('cancel');
};

const onOk = async () => {
    let _data = null
    if(variable.value.length){
        _data = await variableRef.value.onSave()
    }
    formModel.variables = _data;
    const { options, ...extra } = formModel;
    emit('save', { ...extra }, { ...options });
};
</script>

<style lang="less" scoped>
.steps-steps {
    width: 100%;
    margin-bottom: 17px;
    padding-bottom: 17px;
    border-bottom: 1px solid #f0f0f0;
}

.steps-content {
    width: 100%;

  :deep(.JSearch-item) {
    .JSearch-item--column {
      width: 130px !important;
    }

    .JSearch-item--termType {
      width: 110px !important;
    }
  }
}
</style>
