<template>
    <j-modal
        title="执行动作"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <div class="steps-steps">
            <a-steps :current="current" size="small" @change="onChange">
                <a-step title="通知方式" key="way" />
                <a-step title="通知配置" key="config" />
                <a-step title="通知模板" key="template" />
                <a-step title="模板变量" key="variable" />
            </a-steps>
        </div>
        <div class="steps-content">
            <a-form ref="actionForm" :model="formModel" layout="vertical">
                <template v-if="current === 0">
                    <a-form-item
                        label="应用"
                        name="notifyType"
                        :rules="[
                            {
                                required: true,
                                message: '请选择通知方式',
                            },
                        ]"
                    >
                        <NotifyWay v-model:value="formModel.notifyType" />
                    </a-form-item>
                </template>
                <template v-if="current === 1">
                    <a-form-item name="notifierId">
                        <NotifyConfig
                            v-model:value="formModel.notifierId"
                            :notifyType="formModel.notifyType"
                        />
                    </a-form-item>
                </template>
                <template v-if="current === 2">
                    <a-form-item name="templateId">
                        <NotifyTemplate
                            v-model:value="formModel.templateId"
                            :notifierId="formModel.notifierId"
                        />
                    </a-form-item>
                </template>
                <template v-if="current === 3">
                    <a-form-item name="variables">
                        <VariableDefinitions
                            :variableDefinitions="variable"
                            v-model:value="formModel.variables"
                            :notify="formModel"
                        />
                    </a-form-item>
                </template>
            </a-form>
        </div>
        <template #footer>
            <a-space>
                <j-button v-if="current === 0" @click="onCancel">取消</j-button>
                <j-button v-if="current > 0" @click="prev">上一步</j-button>
                <j-button v-if="current < 3" type="primary" @click="next"
                    >下一步</j-button
                >
                <j-button v-if="current === 3" type="primary" @click="onOk"
                    >确定</j-button
                >
            </a-space>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import NotifyWay from './NotifyWay.vue';
import NotifyConfig from './NotifyConfig.vue';
import NotifyTemplate from './NotifyTemplate.vue';
import VariableDefinitions from './VariableDefinitions.vue';
import { onlyMessage } from '@/utils/comm';
import Template from '@/api/notice/template';
import { PropType } from 'vue';
import { NotifyProps } from '../../../typings';

const props = defineProps({
    value: {
        type: Object as PropType<Partial<NotifyProps>>,
        default: () => undefined,
    },
    options: {
        type: Object,
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
});

const variable = ref([]);

watch(
    () => props.value,
    (newVal) => {
        Object.assign(formModel, newVal);
    },
    { deep: true, immediate: true },
);

const jumpStep = async (val: number) => {
    if (val === 0) {
        current.value = val;
    } else if (val === 1) {
        if (formModel.notifyType) {
            current.value = val;
        } else {
            onlyMessage('请选择通知方式', 'error');
        }
    } else if (val === 2) {
        if (formModel.notifierId) {
            current.value = val;
        } else {
            onlyMessage('请选择通知配置', 'error');
        }
    } else if (val === 3) {
        formModel.templateId = '1628943618904956928';
        if (formModel.templateId) {
            const resp = await Template.getTemplateDetail(formModel.templateId);
            if (resp.status === 200) {
                variable.value = resp.result?.variableDefinitions || [];
                current.value = val;
            }
        } else {
            onlyMessage('请选择通知模板', 'error');
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
const onOk = () => {
    emit('save');
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
}
</style>