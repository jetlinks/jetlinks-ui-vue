<template>
    <div>
        <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <a-form-item
                :name="['message', 'messageType']"
                :label="$t('actions.index.9667837-0')"
                :rules="[{ required: true, message: $t('actions.index.9667837-1') }]"
            >
                <TopCard
                    :typeList="TypeList"
                    v-model:value="modelRef.message.messageType"
                    @change="onMessageTypeChange"
                />
            </a-form-item>
            <template v-if="deviceMessageType === 'INVOKE_FUNCTION'">
                <a-form-item
                    :name="['message', 'functionId']"
                    :label="$t('actions.index.9667837-2')"
                    :rules="[{ required: true, message: $t('actions.index.9667837-3') }]"
                >
                    <a-select
                        showSearch
                        :placeholder="$t('actions.index.9667837-3')"
                        v-model:value="modelRef.message.functionId"
                        @change="functionSelect"
                    >
                        <a-select-option
                            v-for="item in metadata?.functions || []"
                            :value="item?.id"
                            :key="item?.id"
                            :label="item?.name"
                            >{{ item?.name }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
                <EditTable
                    ref="functionRef"
                    v-model:value="modelRef.message.inputs"
                    v-model:columnMap="columnMap"
                    :functions="functions"
                    :builtInList="builtInList"
                />
            </template>
            <template v-else-if="deviceMessageType === 'READ_PROPERTY'">
                <a-form-item
                    :name="['message', 'properties']"
                    :label="$t('actions.index.9667837-4')"
                    :rules="[{ required: true, message: $t('actions.index.9667837-5') }]"
                >
                    <a-select
                        showSearch
                        :placeholder="$t('actions.index.9667837-6')"
                        v-model:value="modelRef.message.properties[0]"
                        @change="propertySelect"
                    >
                        <a-select-option
                            v-for="item in (metadata?.properties || []).filter(
                                (i) => i?.expands?.type?.includes('read'),
                            ) || []"
                            :value="item?.id"
                            :key="item?.id"
                            :label="item?.name"
                            >{{ item?.name }}</a-select-option
                        >
                    </a-select>
                </a-form-item>
            </template>
            <template v-else-if="deviceMessageType === 'WRITE_PROPERTY'">
                <WriteProperty
                    ref="writeFormRef"
                    v-model:value="modelRef.message.properties"
                    v-model:columnMap="columnMap"
                    :metadata="metadata"
                    :builtInList="builtInList"
                    @change="onWriteChange"
                />
            </template>
        </a-form>
    </div>
</template>

<script lang="ts" setup name="ActionDeviceActions">
import TopCard from '../device/TopCard.vue';
import { detail } from '@rule-engine-manager-ui/api/others';
import EditTable from './EditTable.vue';
import WriteProperty from './WriteProperty.vue';
import { useSceneStore } from '@rule-engine-manager-ui/store/scene';
import { storeToRefs } from 'pinia';
import {ACTION_DATA, getParams} from '../../../util';
import { sceneImages } from '@rule-engine-manager-ui/assets';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);
const action_data = inject(ACTION_DATA)
const TypeList = [
    {
        label: $t('actions.index.9667837-2'),
        value: 'INVOKE_FUNCTION',
        image: sceneImages.invokeFunction,
        tip: '',
        disabled: false,
    },
    {
        label: $t('actions.index.9667837-4'),
        value: 'READ_PROPERTY',
        image: sceneImages.readProperty,
        tip: '',
        disabled: false,
    },
    {
        label: $t('actions.index.9667837-7'),
        value: 'WRITE_PROPERTY',
        image: sceneImages.writeProperty,
        tip: '',
        disabled: false,
    },
];

const props = defineProps({
    values: {
        type: Object,
        default: () => {},
    },
    name: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    branchesName: {
        type: Number,
        default: 0,
    },
    productDetail: {
        type: Object,
        default: () => {},
    },
    columnMap: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['change']);

const formRef = ref();
const columnMap = ref(props.columnMap || {});

const modelRef = reactive({
    message: {
        messageType: 'INVOKE_FUNCTION',
        functionId: undefined,
        properties: undefined,
        inputs: [],
    },
    propertiesValue: '',
});

const writeFormRef = ref();
const functionRef = ref();

const functionSelect = (val: any, options?: any) => {
    columnMap.value = {};
    modelRef.message.inputs = [];
    emit('change', {
        propertiesName: options?.label,
        propertiesValue: modelRef.propertiesValue,
    });
};

const propertySelect = (val: any, options?: any) => {
    emit('change', {
        propertiesName: options?.label,
        propertiesValue: modelRef.propertiesValue,
    });
};

const functionRules = [
    {
        validator(_: string, value: any) {
            const arr = functions.value.filter((i: any) => {
                return i?.expands?.required;
            });
            if (arr.length) {
                if (!value?.length) {
                    return Promise.reject($t('actions.index.9667837-8'));
                } else {
                    const hasValue = value?.find(
                        (item: { name: string; value: any }) =>
                            item.value === undefined,
                    );
                    if (hasValue) {
                        const functionItem = arr?.find(
                            (item: any) => item.id === hasValue.name,
                        );
                        return Promise.reject(
                            functionItem?.name
                                ? $t('actions.index.9667837-9', [functionItem.name])
                                : $t('actions.index.9667837-8'),
                        );
                    }
                }
            }
            return Promise.resolve();
        },
        trigger: ['change', 'blur'],
    },
];

const metadata = ref<{
    functions: any[];
    properties: any[];
}>({
    functions: [],
    properties: [],
});

const deviceMessageType = computed(() => {
    return modelRef.message.messageType;
});

const builtInList = ref<any[]>([]);

const functions = computed(() => {
    const _item = (metadata.value?.functions || []).find((item: any) => {
        return modelRef.message?.functionId === item.id;
    });
    return _item?.inputs || [];
});

const _property = computed(() => {
    const _item = (metadata.value?.properties || []).find((item: any) => {
        if (deviceMessageType.value === 'WRITE_PROPERTY') {
            return (
                Object.keys(modelRef.message.properties || {})?.[0] === item.id
            );
        }
        return modelRef.message?.properties?.[0] === item.id;
    });
    return _item;
});

const _function = computed(() => {
    const _item = (metadata.value?.functions || []).find((item: any) => {
        return modelRef.message?.functionId === item.id;
    });
    return _item;
});

const queryBuiltIn = async () => {
    // const _params = {
    //     branch: props.branchesName,
    //     branchGroup: props.thenName,
    //     action: props.name - 1,
    // };
  const _params: Record<string, Number> = {
    branch: (action_data?.branchIndex || 0),
    branchGroup: props.thenName,
    action: props.name, // action
  }
    const _data = await getParams(_params, unref(data));
    builtInList.value = _data;
};

const onMessageTypeChange = (val: string) => {
    columnMap.value = {};
    const flag = ['WRITE_PROPERTY', 'INVOKE_FUNCTION'].includes(val);
    modelRef.message = {
        messageType: val,
        functionId: undefined,
        properties: (flag ? undefined : []) as any,
        inputs: [],
    };
    if (flag) {
        queryBuiltIn();
    }
};

const onWriteChange = (val: string, optionColumn: string[]) => {
    modelRef.propertiesValue = val;
    emit(
        'change',
        {
            propertiesName:
                deviceMessageType.value === 'INVOKE_FUNCTION'
                    ? _function.value?.name
                    : _property.value?.name,
            propertiesValue: modelRef.propertiesValue,
        },
        optionColumn,
    );
};

const onFormSave = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                if (writeFormRef.value) {
                    const _val = await writeFormRef.value?.onSave();
                    if (!_val) {
                        reject(false);
                    }
                }
                if (functionRef.value) {
                    const _val = await functionRef.value?.validate();
                }
                resolve({
                    message: {
                        ...modelRef.message,
                        ..._data.message,
                    },
                });
                // emit('change', {
                //     propertiesName:
                //         deviceMessageType.value === 'INVOKE_FUNCTION'
                //             ? _function.value?.name
                //             : _property.value?.name,
                //     propertiesValue: modelRef.propertiesValue,
                // });
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

const getColumnMap = () => {
    return columnMap.value;
};

watch(
    () => props.productDetail,
    (newVal) => {
        if (newVal?.id) {
            if (
                props.values?.selector === 'fixed' &&
                props.values?.selectorValues?.length === 1
            ) {
                const id = props.values?.selectorValues?.[0]?.value;
                if (id) {
                    detail(id).then((resp) => {
                        if (resp.status === 200) {
                            metadata.value = JSON.parse(
                                resp.result?.metadata || '{}',
                            );
                        }
                    });
                }
            } else {
                metadata.value = JSON.parse(newVal?.metadata || '{}');
            }
        }
    },
    { immediate: true },
);

watch(
    () => props.values?.message,
    (newVal) => {
        if (newVal?.messageType) {
            modelRef.message = JSON.parse(JSON.stringify(newVal));
            if (
                ['WRITE_PROPERTY', 'INVOKE_FUNCTION'].includes(
                    newVal.messageType,
                )
            ) {
                queryBuiltIn();
            } else {
                if (!modelRef.message.properties) {
                    modelRef.message = Object.assign(modelRef.message, {
                        properties: [],
                    });
                }
            }
        }
    },
    { immediate: true },
);

defineExpose({ onFormSave, getColumnMap });
</script>
