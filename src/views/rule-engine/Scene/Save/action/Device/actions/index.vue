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
        </j-form>
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
import { storeToRefs } from 'pinia';

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
        return modelRef.message?.properties === item.id;
    });
    return _item;
});

const _function = computed(() => {
    const _item = (metadata.value?.functions || []).find((item: any) => {
        return modelRef.message?.functionId === item.id;
    });
    return _item;
});

const onMessageTypeChange = (val: string) => {
    if (['WRITE_PROPERTY', 'INVOKE_FUNCTION'].includes(val)) {
        const _params = {
            branch: props.thenName,
            branchGroup: props.branchGroup,
            action: props.name - 1,
        };
        queryBuiltInParams(unref(data), _params).then((res: any) => {
            if (res.status === 200) {
                builtInList.value = res.result;
            }
        });
    }
};

watch(
    () => props.values,
    (newVal) => {
        if (newVal?.productDetail?.id) {
            if (newVal?.selector === 'fixed') {
                const id = newVal?.selectorValues?.[0]?.value;
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
                metadata.value = JSON.parse(
                    newVal?.productDetail?.metadata || '{}',
                );
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
            if (newVal.messageType === 'READ_PROPERTY') {
                modelRef.message.properties = newVal.properties?.[0];
            }
            onMessageTypeChange(newVal.messageType);
        }
    },
    { immediate: true },
);

const onFormSave = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then((_data: any) => {
                // 处理三种情况的值的格式
                const _properties = _data.message.properties || modelRef.message.properties
                const obj = {
                    message: {
                        ...modelRef.message,
                        ..._data.message,
                        properties: _data.message.messageType === 'READ_PROPERTY' ? [_properties] : _properties,
                        propertiesName:
                            deviceMessageType.value === 'INVOKE_FUNCTION'
                                ? _function.value?.name
                                : _property.value?.name,
                    },
                }
                resolve(obj);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

defineExpose({ onFormSave });
</script>