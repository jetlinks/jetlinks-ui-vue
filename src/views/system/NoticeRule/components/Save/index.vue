<template>
    <a-modal
        :width="1056"
        visible
        title="配置通知方式"
        @cancel="emit('close')"
        :bodyStyle="{ padding: 0 }"
    >
        <div style="background-color: #f8f9fc; padding: 25px 100px">
            <a-steps :current="current" size="small" @change="onChange">
                <a-step v-for="(item, index) in stepList" :key="item">
                    <template #title>
                        {{ item
                        }}<a-tooltip v-if="index === 4">
                            <template #title>
                                <span>
                                    通过角色控制【{{ name }}】下的【{{ showName }}通知】可被哪些用户订阅。<br />
                                    注意：当前配置会被外层【{{ name }}】中的权限控制覆盖。
                                </span>
                            </template>
                            <AIcon type="QuestionCircleOutlined"
                        /></a-tooltip>
                    </template>
                    <template #description>
                        <span v-if="current === index">进行中</span>
                        <span v-if="current < index">未开始</span>
                        <span v-if="current > index">已完成</span>
                    </template>
                </a-step>
            </a-steps>
        </div>
        <div style="margin: 20px">
            <template v-if="current === 0">
                <NotifyWay
                    :value="formModel.channelProvider"
                    v-model:name="showName"
                    @change="onWayChange"
                />
            </template>
            <template v-if="current === 1">
                <NotifyConfig
                    :value="formModel.channelConfiguration.notifierId"
                    :notifyType="formModel.channelProvider"
                    @change="onConfigChange"
                />
            </template>
            <template v-if="current === 2">
                <NotifyTemplate
                    :value="formModel.channelConfiguration.templateId"
                    :notifyType="formModel.channelProvider"
                    :notifierId="formModel.channelConfiguration.notifierId"
                    @change="onTemplateChange"
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
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    通过角色控制哪些用户可以订阅从【{{ name }}】接收到【{{ showName }}】通知
                </div>
                <Role type="add" v-model="formModel.grant.role.idList" />
            </template>
            <template v-if="current === 5">
                <div>
                    <div class="alert">
                        <AIcon type="InfoCircleOutlined" />
                        被分配了接收权限的用户将根据名称判断是否订阅该通知
                    </div>
                    <div style="margin: 50px 200px">
                        <a-form
                            ref="formRef"
                            :model="formModel"
                            layout="vertical"
                        >
                            <a-form-item
                                name="name"
                                label="名称"
                                :rules="[
                                    { required: true, message: '请输入名称' },
                                    {
                                        max: 8,
                                        message: '最多可输入8个字符',
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="formModel.name"
                                    placeholder="请输入名称"
                                />
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </template>
        </div>
        <template #footer>
            <a-space>
                <a-button v-if="current === 0" @click="emit('close')"
                    >取消</a-button
                >
                <a-button v-else @click="onPrev">上一步</a-button>
                <a-button
                    type="primary"
                    @click="onNext"
                    v-if="current !== stepList.length - 1"
                    >下一步</a-button
                >
                <a-button
                    :loading="loading"
                    type="primary"
                    @click="onSave"
                    v-else
                    >确认</a-button
                >
            </a-space>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import NotifyWay from './components/NotifyWay.vue';
import NotifyConfig from './components/NotifyConfig.vue';
import NotifyTemplate from './components/NotifyTemplate.vue';
import VariableDefinitions from './components/VariableDefinitions.vue';
import Role from '../Role/index.vue';
import { onlyMessage } from "@jetlinks-web/utils";
import Template from '@/api/notice/template';
import { variableMap } from '../../data';
import { cloneDeep } from 'lodash-es';

type GrantType = {
    role: {
        idList?: string[];
    };
    permissions: any[];
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
    loading: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
});

const stepList =  [
    '选择通知方式',
    '选择通知配置',
    '选择通知模板',
    '配置模板变量',
    '配置用户权限',
    '完成',
]
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
        permissions: [],
        role: {},
    },
    channelConfiguration: {},
});
const variableRef = ref();
const formRef = ref();
const showName = ref<string>('钉钉')

const _getType = computed(() => {
    if (['notifier-dingTalk'].includes(props.data?.channelProvider)) {
        return ['user', 'tag'];
    } else {
        return ['user', 'org', 'tag'];
    }
});

const _variableDefinitions = computed(() => {
    return variable.value.filter((item: any) => {
        const _type = item.expands?.businessType || item.type || '';
        return !['user', 'org', 'tag'].includes(_type);
    });
});

const handleVariable = (obj: any) => {
    const _array = variable.value
        .filter((item: any) => {
            const _type = item.expands?.businessType || item.type || '';
            return _getType.value.includes(_type);
        })
        .map((i: any) => i?.id);
    const _variable = variableMap.get(formModel.channelProvider);
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
    if (val >= 1) {
        if (!formModel.channelProvider) {
            onlyMessage('请选择通知方式', 'error');
            return;
        }
    }
    if (val >= 2) {
        if (!formModel.channelConfiguration.notifierId) {
            onlyMessage('请选择通知配置', 'error');
            return;
        }
    }
    if (val >= 3) {
        if (!formModel.channelConfiguration.templateId) {
            onlyMessage('请选择通知模板', 'error');
            return;
        } else {
            // 查询变量
            const resp = await Template.getTemplateDetail(
                formModel.channelConfiguration.templateId,
            );
            if (resp.status === 200) {
                variable.value = resp.result?.variableDefinitions || [];
            }
        }
    }
    if (val >= 4) {
        if (variable.value.length) {
            if (_variableDefinitions.value.length) {
                if (variableRef.value) {
                    const obj = await variableRef.value?.onSave();
                    if (obj) {
                        handleVariable(obj);
                    } else {
                        onlyMessage('请配置模版变量', 'error');
                        return;
                    }
                } else {
                    const flag = _variableDefinitions.value.every(
                        (item: any) => {
                            const _value =
                                formModel.channelConfiguration.variables[
                                    item.id
                                ];
                            if (!_value) {
                                return false;
                            }
                            if (_value.source === 'fixed') {
                                return _value.value !== undefined;
                            }
                            if (_value.source === 'upper') {
                                return _value.upperKey !== undefined;
                            }
                            return true;
                        },
                    );
                    if (!flag) {
                        onlyMessage('请配置模版变量', 'error');
                        return;
                    }
                }
            } else {
                handleVariable({});
            }
        }
    }

    current.value = val;
};

const onWayChange = (obj: any) => {
    // 如果数据变化，清除后面的值
    if (formModel.channelProvider !== obj.value) {
        formModel.channelConfiguration.notifierId = '';
        formModel.channelConfiguration.templateId = '';
        formModel.channelConfiguration.variables = {};
    }
    formModel.channelProvider = obj?.value;
    // formModel.name = obj?.label;
};

const onConfigChange = (obj: any) => {
    // 如果数据变化，清除后面的值
    if (formModel.channelConfiguration?.notifierId !== obj?.value) {
        formModel.channelConfiguration.templateId = '';
        formModel.channelConfiguration.variables = {};
    }
    formModel.channelConfiguration.notifierId = obj?.value;
};

const onTemplateChange = (obj: any) => {
    // 如果数据变化，清除后面的值
    if (formModel.channelConfiguration?.templateId !== obj?.value) {
        formModel.channelConfiguration.variables = {};
    }
    formModel.channelConfiguration.templateId = obj?.value;
};

watchEffect(() => {
    Object.assign(formModel, cloneDeep(props.data));
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

const onSave = async () => {
    await formRef.value?.validate();
    formModel.grant.permissions =
        props.provider === 'alarm'
            ? [{ id: 'alarm-config', actions: ['query'] }]
            : [];
    emit('save', formModel);
};
</script>

<style lang="less" scoped>
.alert {
    height: 40px;
    padding: 0 20px 0 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
</style>