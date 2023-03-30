<template>
    <div>
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item
                :name="['message', 'messageType']"
                label="动作类型"
                :rules="[{ required: true, message: '请选择动作类型' }]"
            >
                <TopCard
                    :typeList="TypeList"
                    v-model:value="modelRef.message.messageType"
                    @change="onMessageTypeChange"
                />
            </j-form-item>
            <template v-if="deviceMessageType === 'INVOKE_FUNCTION'">
                <j-form-item
                    :name="['message', 'functionId']"
                    label="功能调用"
                    :rules="[{ required: true, message: '请选择功能' }]"
                >
                    <j-select
                        showSearch
                        placeholder="请选择功能"
                        v-model:value="modelRef.message.functionId"
                        @change="functionSelect"
                    >
                        <j-select-option
                            v-for="item in metadata?.functions || []"
                            :value="item?.id"
                            :key="item?.id"
                            :label="item?.name"
                            >{{ item?.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item
                    v-if="modelRef.message.functionId && functions.length"
                    :name="['message', 'inputs']"
                    :rules="functionRules"
                >
                    <EditTable
                        :functions="functions"
                        v-model:value="modelRef.message.inputs"
                        :builtInList="builtInList"
                    />
                </j-form-item>
            </template>
            <template v-else-if="deviceMessageType === 'READ_PROPERTY'">
                <j-form-item
                    :name="['message', 'properties']"
                    label="读取属性"
                    :rules="[{ required: true, message: '请选择读取属性' }]"
                >
                    <j-select
                        showSearch
                        placeholder="请选择属性"
                        v-model:value="modelRef.message.properties[0]"
                        @change="propertySelect"
                    >
                        <j-select-option
                            v-for="item in (metadata?.properties || []).filter((i) =>
                                i?.expands?.type?.includes('read'),
                            ) || []"
                            :value="item?.id"
                            :key="item?.id"
                            :label="item?.name"
                            >{{ item?.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
            </template>
            <template v-else-if="deviceMessageType === 'WRITE_PROPERTY'">
                <WriteProperty
                    ref="writeFormRef"
                    v-model:value="modelRef.message.properties"
                    :metadata="metadata"
                    :builtInList="builtInList"
                    @change="onWriteChange"
                />
            </template>
        </j-form>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import TopCard from '../device/TopCard.vue';
import { detail } from '@/api/device/instance';
import EditTable from './EditTable.vue';
import WriteProperty from './WriteProperty.vue';
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import { getParams } from '../../../util';

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const TypeList = [
    {
        label: '功能调用',
        value: 'INVOKE_FUNCTION',
        image: getImage('/scene/invoke-function.png'),
        tip: '',
    },
    {
        label: '读取属性',
        value: 'READ_PROPERTY',
        image: getImage('/scene/read-property.png'),
        tip: '',
    },
    {
        label: '设置属性',
        value: 'WRITE_PROPERTY',
        image: getImage('/scene/write-property.png'),
        tip: '',
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
});

const emit = defineEmits(['change']);

const formRef = ref();

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

const functionSelect = (val: any, options?: any) => {
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
            if (!value?.length && functions.value.length) {
                return Promise.reject('请输入功能值');
            } else {
                const hasValue = value?.find(
                    (item: { name: string; value: any }) => !item.value,
                );
                if (hasValue) {
                    const functionItem = functions.value?.find(
                        (item: any) => item.id === hasValue.name,
                    );
                    return Promise.reject(
                        functionItem?.name
                            ? `请输入${functionItem.name}值`
                            : '请输入功能值',
                    );
                }
            }
            return Promise.resolve();
        },
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
    const _params = {
        branch: props.thenName,
        branchGroup: props.branchesName,
        action: props.name - 1,
    };
    const _data = await getParams(_params, unref(data));
    builtInList.value = _data;
};

const onMessageTypeChange = (val: string) => {
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

watch(
    () => props.productDetail,
    (newVal) => {
        if (newVal?.id) {
            if (props.values?.selector === 'fixed') {
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
    { immediate: true, deep: true },
);

watch(
    () => props.values?.message,
    (newVal) => {
        if (newVal?.messageType) {
            modelRef.message = newVal;
            if (
                ['WRITE_PROPERTY', 'INVOKE_FUNCTION'].includes(
                    newVal.messageType,
                )
            ) {
                queryBuiltIn();
            }
        }
    },
    { immediate: true },
);

const onWriteChange = (val: string) => {
    modelRef.propertiesValue = val;
    emit('change', {
        propertiesName:
            deviceMessageType.value === 'INVOKE_FUNCTION'
                ? _function.value?.name
                : _property.value?.name,
        propertiesValue: modelRef.propertiesValue,
    });
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

defineExpose({ onFormSave });
</script>