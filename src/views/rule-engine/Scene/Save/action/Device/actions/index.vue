<template>
    <div>
        <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
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
                        @change="(val) => onFunctionChange(val, [])"
                    >
                        <j-select-option
                            v-for="item in metadata?.functions || []"
                            :value="item?.id"
                            :key="item?.id"
                            >{{ item?.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item
                    v-if="modelRef.message.functionId"
                    :name="['message', 'inputs']"
                    :rules="[{ required: true, message: '请输入功能值' }]"
                >
                    <EditTable v-model:modelValue="modelRef.message.inputs" :builtInList="builtInList" />
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
                        v-model:value="modelRef.message.properties"
                    >
                        <j-select-option
                            v-for="item in metadata?.properties || []"
                            :value="item?.id"
                            :key="item?.id"
                            >{{ item?.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
            </template>
            <template v-else-if="deviceMessageType === 'WRITE_PROPERTY'">
                <WriteProperty
                    v-model:value="modelRef.message.properties"
                    :metadata="metadata"
                    :builtInList="builtInList"
                />
            </template>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import TopCard from '../device/TopCard.vue';
import { detail } from '@/api/device/instance';
import EditTable from './EditTable.vue';
import WriteProperty from './WriteProperty.vue';
import { queryBuiltInParams } from '@/api/rule-engine/scene';
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia'

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
    branchGroup: {
        type: Number,
        default: 0,
    },
});

const formRef = ref();

const modelRef = reactive({
    message: {
        messageType: undefined,
        functionId: undefined,
        properties: undefined,
        inputs: [],
    },
});

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

const onFunctionChange = (val: string, values?: any[]) => {
    const _item = (metadata.value?.functions || []).find((item: any) => {
        return val === item.id;
    });
    const list = (_item?.inputs || []).map((item: any) => {
        const _a = values?.find((i) => i.name === item.id);
        return {
            id: item.id,
            value: _a?.value,
            valueType: item?.valueType?.type,
            ..._a,
            name: item.name,
        };
    });
    modelRef.message.inputs = list;
};

const onMessageTypeChange = (val: string) => {
    if (['WRITE_PROPERTY', 'INVOKE_FUNCTION'].includes(val)) {
        const _params = {
            branch: props.thenName,
            branchGroup: props.branchGroup,
            action: props.name - 1,
        };
        queryBuiltInParams(unref(data), _params).then((res: any) => {
            if (res.status === 200) {
                builtInList.value = res.result
            }
        });
    }
};

watch(
    () => [
        props.values?.productDetail,
        props.values.selectorValues,
        props.values?.selector,
    ],
    ([newVal1, newVal2, newVal3]) => {
        if (newVal1?.id) {
            if (newVal3?.selector === 'fixed') {
                const id = newVal2?.[0]?.value;
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
                metadata.value = JSON.parse(newVal1?.metadata || '{}');
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
            if (newVal.messageType === 'INVOKE_FUNCTION' && newVal.functionId) {
                onFunctionChange(newVal.functionId, newVal?.inputs);
            }
            onMessageTypeChange(newVal.messageType)
        }
    },
    { deep: true, immediate: true },
);

const onFormSave = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                resolve(_data);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

defineExpose({ onFormSave });
</script>