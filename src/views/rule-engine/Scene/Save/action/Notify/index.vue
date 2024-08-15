<template>
    <j-modal
        :title="$t('Notify.index.5425863-0')"
        visible
        :width="900"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <div class="steps-steps">
            <j-steps :current="current" size="small" @change="onChange">
                <j-step :title="$t('Notify.index.5425863-1')" key="way" />
                <j-step :title="$t('Notify.index.5425863-2')" key="config" />
                <j-step :title="$t('Notify.index.5425863-3')" key="template" />
                <j-step :title="$t('Notify.index.5425863-4')" key="variable" />
            </j-steps>
        </div>
        <div class="steps-content">
            <j-form ref="actionForm" :model="formModel" layout="vertical">
                <template v-if="current === 0">
                    <j-form-item
                        :label="$t('Notify.index.5425863-5')"
                        name="notifyType"
                        :rules="[
                            {
                                required: true,
                                message: $t('Notify.index.5425863-6'),
                            },
                        ]"
                    >
                        <NotifyWay
                            v-model:value="formModel.notifyType"
                            @change="(val) => onValChange(val, 'notifyType')"
                        />
                    </j-form-item>
                </template>
                <template v-if="current === 1">
                    <j-form-item name="notifierId">
                        <NotifyConfig
                            v-model:value="formModel.notifierId"
                            :notifyType="formModel.notifyType"
                            @change="(val) => onValChange(val, 'notifierId')"
                        />
                    </j-form-item>
                </template>
                <template v-if="current === 2">
                    <j-form-item name="templateId">
                        <NotifyTemplate
                            v-model:value="formModel.templateId"
                            v-model:detail="template"
                            :notifyType="formModel.notifyType"
                            :notifierId="formModel.notifierId"
                            @change="(val) => onValChange(val, 'templateId')"
                        />
                    </j-form-item>
                </template>
                <template v-if="current === 3">
                    <j-form-item name="variables">
                        <VariableDefinitions
                            :variableDefinitions="variable"
                            :value="formModel.variables"
                            :notify="formModel"
                            :template="template"
                            :options='formModel.options'
                            @change="(val) => onValChange(val, 'variables')"
                            ref="variableRef"
                        />
                    </j-form-item>
                </template>
            </j-form>
        </div>
        <template #footer>
            <j-space>
                <j-button v-if="current === 0" @click="onCancel">{{ $t('Notify.index.5425863-7') }}</j-button>
                <j-button v-if="current > 0" @click="prev">{{ $t('Notify.index.5425863-8') }}</j-button>
                <j-button v-if="current < 3" type="primary" @click="next"
                    >{{ $t('Notify.index.5425863-9') }}</j-button
                >
                <j-button v-if="current === 3" type="primary" @click="onOk"
                    >{{ $t('Notify.index.5425863-10') }}</j-button
                >
            </j-space>
        </template>
    </j-modal>
</template>

<script lang="ts" setup name='NotifyIndex'>
import NotifyWay from './NotifyWay.vue';
import NotifyConfig from './NotifyConfig.vue';
import NotifyTemplate from './NotifyTemplate.vue';
import VariableDefinitions from './VariableDefinitions.vue';
import { onlyMessage } from '@/utils/comm';
import Template from '@/api/notice/template';
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
            Template.detail(newVal?.templateId).then((resp: any) => {
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
            onlyMessage($t('Notify.index.5425863-6'), 'error');
        }
    } else if (val === 2) {
        if (formModel.notifierId) {
            current.value = val;
        } else {
            onlyMessage($t('Notify.index.5425863-11'), 'error');
        }
    } else if (val === 3) {
        if (formModel.templateId) {
            const resp = await Template.getTemplateDetail(formModel.templateId);
            if (resp.status === 200) {
                variable.value = resp.result?.variableDefinitions || [];
                current.value = val;
            }
        } else {
            onlyMessage($t('Notify.index.5425863-12'), 'error');
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
