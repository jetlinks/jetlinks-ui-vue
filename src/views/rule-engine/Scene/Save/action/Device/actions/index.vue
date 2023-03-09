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
                        @change="onFunctionChange"
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
                    <EditTable v-model="modelRef.message.inputs" />
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
                <j-row>
                    <j-col :span="11">
                        <j-form-item
                            :name="['message', 'properties']"
                            label="读取属性"
                            :rules="[
                                { required: true, message: '请选择读取属性' },
                            ]"
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
                    </j-col>
                    <j-col :span="2"></j-col>
                    <j-col :span="11">
                        <j-form-item
                            :name="['message', 'properties']"
                            label="读取属性"
                            :rules="[
                                { required: true, message: '请选择读取属性' },
                            ]"
                        >
                            <j-select placeholder="请选择">
                                <!-- TODO -->
                            </j-select>
                        </j-form-item>
                    </j-col>
                </j-row>
            </template>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import TopCard from '../device/TopCard.vue';
import { detail } from '@/api/device/instance';
import EditTable from './EditTable.vue';

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

const onFunctionChange = (val: string) => {
    const _item = (metadata.value?.functions || []).find((item: any) => {
        return val === item.id;
    });
    const list = (_item?.inputs || []).map((item: any) => {
        return {
            id: item.id,
            name: item.name,
            value: undefined,
            valueType: item?.valueType?.type,
        };
    });
    modelRef.message.inputs = list;
};

watchEffect(() => {
    // console.log(props.values)
    // console.log(metadata.value)
    // Object.assign()
});

watch(
    () => [props.values?.productDetail, props.values.deviceDetail],
    ([newVal1, newVal2]) => {
        if (newVal1) {
            if (props.values?.selector === 'fixed') {
                detail(newVal2.id).then((resp) => {
                    if (resp.status === 200) {
                        metadata.value = JSON.parse(
                            resp.result?.metadata || '{}',
                        );
                    }
                });
            } else {
                metadata.value = JSON.parse(newVal1?.metadata || '{}');
            }
        }
    },
    { deep: true, immediate: true },
);
</script>