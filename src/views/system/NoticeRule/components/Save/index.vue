<template>
    <a-modal
        :width="1056"
        visible
        :title="$t('Save.index.320308-0')"
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
                                    {{ $t('Save.index.320308-1', [name, showName]) }} <br />
                                    {{ $t('Save.index.320308-4', [name]) }}
                                </span>
                            </template>
                            <AIcon type="QuestionCircleOutlined"
                        /></a-tooltip>
                    </template>
                    <template #description>
                        <span v-if="current === index">{{ $t('Save.index.320308-6') }}</span>
                        <span v-if="current < index">{{ $t('Save.index.320308-7') }}</span>
                        <span v-if="current > index">{{ $t('Save.index.320308-8') }}</span>
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
                    {{ $t('Save.index.320308-9', [name, showName]) }}
                </div>
                <Role type="add" v-model="formModel.grant.role.idList" />
            </template>
            <template v-if="current === 5">
                <div>
                    <div class="alert">
                        <AIcon type="InfoCircleOutlined" />
                        {{ $t('Save.index.320308-12') }}
                    </div>
                    <div style="margin: 50px 200px">
                        <a-form
                            ref="formRef"
                            :model="formModel"
                            layout="vertical"
                        >
                            <a-form-item
                                name="name"
                                :label="$t('Save.index.320308-13')"
                                :rules="[
                                    { required: true, message: $t('Save.index.320308-14') },
                                    {
                                        max: 8,
                                        message: $t('Save.index.320308-15'),
                                    },
                                ]"
                            >
                                <a-input
                                    v-model:value="formModel.name"
                                    :placeholder="$t('Save.index.320308-14')"
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
                    >{{ $t('Save.index.320308-16') }}</a-button
                >
                <a-button v-else @click="onPrev">{{ $t('Save.index.320308-17') }}</a-button>
                <a-button
                    type="primary"
                    @click="onNext"
                    v-if="current !== stepList.length - 1"
                    >{{ $t('Save.index.320308-18') }}</a-button
                >
                <a-button
                    :loading="loading"
                    type="primary"
                    @click="onSave"
                    v-else
                    >{{ $t('Save.index.320308-19') }}</a-button
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
    $t('Save.index.320308-20'),
    $t('Save.index.320308-21'),
    $t('Save.index.320308-22'),
    $t('Save.index.320308-23'),
    $t('Save.index.320308-24'),
    $t('Save.index.320308-25'),
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
        role: {},
    },
    channelConfiguration: {},
});
const variableRef = ref();
const formRef = ref();
const showName = ref<string>($t('Save.index.320308-26'))

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
            onlyMessage($t('Save.index.320308-27'), 'error');
            return;
        }
    }
    if (val >= 2) {
        if (!formModel.channelConfiguration.notifierId) {
            onlyMessage($t('Save.index.320308-28'), 'error');
            return;
        }
    }
    if (val >= 3) {
        if (!formModel.channelConfiguration.templateId) {
            onlyMessage($t('Save.index.320308-29'), 'error');
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
                        onlyMessage($t('Save.index.320308-30'), 'error');
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
                        onlyMessage($t('Save.index.320308-30'), 'error');
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