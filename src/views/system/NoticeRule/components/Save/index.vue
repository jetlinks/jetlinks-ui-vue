<template>
    <j-modal
        :width="900"
        visible
        title="配置通知方式"
        @cancel="emit('close')"
        @ok="onSave"
    >
        <j-steps :current="current" size="small" @change="onChange">
            <j-step v-for="item in stepList" :title="item" :key="item" />
        </j-steps>
        <div style="margin: 20px">
            <template v-if="current === 0">
                <NotifyWay v-model:value="formModel.notifyType" />
            </template>
            <template v-if="current === 1">
                <NotifyConfig
                    v-model:value="formModel.notifierId"
                    :notifyType="formModel.notifyType"
                />
            </template>
            <template v-if="current === 2">
                <NotifyTemplate
                    v-model:value="formModel.templateId"
                    :notifierId="formModel.notifierId"
                />
            </template>
            <template v-if="current === 3">
                <VariableDefinitions
                    :variableDefinitions="_variableDefinitions"
                    :value="formModel.variables"
                    :notify="formModel"
                    ref="variableRef"
                />
            </template>
            <template v-if="current === 4">
                <Role v-model="formModel.role" />
            </template>
        </div>
        <template #footer>
            <j-space>
                <j-button v-if="current === 0" @click="emit('close')"
                    >取消</j-button
                >
                <j-button v-else @click="onPrev">上一步</j-button>
                <j-button
                    type="primary"
                    @click="onNext"
                    v-if="current !== stepList.length - 1"
                    >下一步</j-button
                >
                <j-button type="primary" @click="onSave" v-else>确认</j-button>
            </j-space>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import NotifyWay from './components/NotifyWay.vue';
import NotifyConfig from './components/NotifyConfig.vue';
import NotifyTemplate from './components/NotifyTemplate.vue';
import VariableDefinitions from './components/VariableDefinitions.vue';
import Role from '../Role/index.vue';
import { onlyMessage } from '@/utils/comm';
import Template from '@/api/notice/template';

const emit = defineEmits(['close', 'save']);

const stepList = [
    '选择通知方式',
    '选择通知配置',
    '选择通知模板',
    '配置模板变量',
    '配置用户权限',
];
const current = ref<number>(0);
const variable = ref([]);
const formModel = reactive({
    notifyType: '',
    notifierId: '',
    templateId: '',
    variables: undefined,
    role: [],
});
const variableRef = ref();

const _variableDefinitions = computed(() => {
    const arr = ['user', 'org']
    return variable.value.filter((item: any) => {
        const _type = item.expands?.businessType || item.type || ''
        return !arr.includes(_type)
    })
})

const jumpStep = async (val: number) => {
    if (val === 1) {
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
        if (formModel.templateId) {
            const resp = await Template.getTemplateDetail(formModel.templateId);
            if (resp.status === 200) {
                variable.value = resp.result?.variableDefinitions || [];
                current.value = val;
            }
        } else {
            onlyMessage('请选择通知模板', 'error');
        }
    } else if (val === 4) {
        if (_variableDefinitions.value.length) {
            formModel.variables = await variableRef.value.onSave();
            if (formModel.variables) {
                current.value = val;
            } else {
                onlyMessage('请配置模版变量', 'error');
            }
        } else {
            current.value = val;
        }
    }
};

const onPrev = () => {
    current.value -= 1;
};

const onNext = () => {
    jumpStep(current.value + 1);
};

const onChange = (cur: number) => {
    jumpStep(cur);
};

const onSave = () => {
    if (formModel.role.length) {
        emit('save');
    } else {
        onlyMessage('请配置角色权限', 'error');
    }
};
</script>