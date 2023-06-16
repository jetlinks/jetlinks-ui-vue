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
                <NotifyWay
                    v-model:value="formModel.channelProvider"
                    v-model:name="formModel.name"
                />
            </template>
            <template v-if="current === 1">
                <NotifyConfig
                    v-model:value="formModel.channelConfiguration.notifierId"
                    :notifyType="formModel.channelProvider"
                />
            </template>
            <template v-if="current === 2">
                <NotifyTemplate
                    v-model:value="formModel.channelConfiguration.templateId"
                    :notifierId="formModel.channelConfiguration.notifierId"
                />
            </template>
            <template v-if="current === 3">
                <VariableDefinitions
                    :variableDefinitions="_variableDefinitions"
                    :value="formModel.channelConfiguration.variables"
                    :notify="formModel"
                    ref="variableRef"
                />
            </template>
            <template v-if="current === 4">
                <Role v-model="formModel.grant.role.idList" />
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
import { variableMap } from '../../data';

type GrantType = {
    role: {
        idList?: string[];
    };
};

type ConfigurationType = {
    notifierId: string;
    templateId: string;
    variables: any;
};

const emit = defineEmits(['close', 'save']);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const stepList = [
    '选择通知方式',
    '选择通知配置',
    '选择通知模板',
    '配置模板变量',
    '配置用户权限',
];
const current = ref<number>(0);
const variable = ref([]);
const formModel = reactive<{
    id?: string;
    name: string;
    channelConfiguration: Partial<ConfigurationType>;
    grant: GrantType;
    channelProvider: string;
}>({
    name: '',
    channelProvider: '',
    grant: {
        role: {},
    },
    channelConfiguration: {},
});
const variableRef = ref();

const _variableDefinitions = computed(() => {
    const arr = ['user', 'org'];
    return variable.value.filter((item: any) => {
        const _type = item.expands?.businessType || item.type || '';
        return !arr.includes(_type);
    });
});

const handleVariable = (obj: any) => {
    const arr = ['user', 'org'];
    const _array = variable.value.filter((item: any) => {
        const _type = item.expands?.businessType || item.type || '';
        return arr.includes(_type);
    }).map((i: any) => i?.id);
    const _variable = variableMap.get(formModel.channelProvider)
    const _obj = {};
    [...new Set([..._array, _variable]).values()].map((item: string) => {
        _obj[item] = {
            source: 'relation',
            relation: {
                objectType: 'user',
                objectSource: {
                    source: 'upper',
                    upperKey: 'subscriber',
                },
            },
        };
    });
    formModel.channelConfiguration.variables = {
        ..._obj,
        ...obj,
    };
};

const jumpStep = async (val: number) => {
    if (val === 1) {
        if (formModel.channelProvider) {
            current.value = val;
        } else {
            onlyMessage('请选择通知方式', 'error');
        }
    } else if (val === 2) {
        if (formModel.channelConfiguration.notifierId) {
            current.value = val;
        } else {
            onlyMessage('请选择通知配置', 'error');
        }
    } else if (val === 3) {
        if (formModel.channelConfiguration.templateId) {
            const resp = await Template.getTemplateDetail(
                formModel.channelConfiguration.templateId,
            );
            if (resp.status === 200) {
                variable.value = resp.result?.variableDefinitions || [];
                current.value = val;
            }
        } else {
            onlyMessage('请选择通知模板', 'error');
        }
    } else if (val === 4) {
        if (variable.value.length) {
            if (_variableDefinitions.value.length) {
                const obj = await variableRef.value.onSave();
                if (obj) {
                    handleVariable(obj);
                    current.value = val;
                } else {
                    onlyMessage('请配置模版变量', 'error');
                }
            } else {
                handleVariable({});
                current.value = val;
            }
        } else {
            current.value = val;
        }
    }
};

watchEffect(() => {
    Object.assign(formModel, props.data);
});

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
    emit('save', formModel);
};
</script>