<template>
    <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-row :gutter="24">
            <j-col :span="24" v-if="actionType === 'command'">
                <j-form-item
                    name="messageType"
                    label="指令类型"
                    :rules="{
                        required: true,
                        message: '请选择指令类型',
                    }"
                >
                    <j-select
                        placeholder="请选择指令类型"
                        v-model:value="modelRef.messageType"
                        show-search
                    >
                        <j-select-option value="READ_PROPERTY"
                            >读取属性</j-select-option
                        >
                        <j-select-option value="WRITE_PROPERTY"
                            >修改属性</j-select-option
                        >
                        <j-select-option value="INVOKE_FUNCTION"
                            >调用功能</j-select-option
                        >
                    </j-select>
                </j-form-item>
            </j-col>
            <j-col
                class="inputs"
                :span="
                    modelRef.messageType === 'READ_PROPERTY' ||
                    actionType === 'latestData'
                        ? 24
                        : 12
                "
                v-if="
                    (actionType === 'command' &&
                        ['READ_PROPERTY', 'WRITE_PROPERTY'].includes(
                            modelRef.messageType,
                        )) ||
                    actionType === 'latestData'
                "
            >
                <j-form-item
                    :name="['message', 'properties']"
                    label="属性"
                    :rules="{
                        required: true,
                        message: '请选择属性',
                    }"
                >
                    <j-select
                        placeholder="请选择属性"
                        v-model:value="modelRef.message.properties"
                        show-search
                        @change="onPropertyChange"
                    >
                        <j-select-option
                            v-for="i in metadata?.properties || []"
                            :key="i.id"
                            :value="i.id"
                            :label="i.name"
                            >{{ i.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
            </j-col>
            <j-col
                :span="12"
                class="inputs"
                v-if="
                    modelRef.messageType === 'WRITE_PROPERTY' &&
                    actionType === 'command'
                "
            >
                <j-form-item
                    :name="['message', 'value']"
                    label="值"
                    :rules="{
                        required: true,
                        message: '请输入值',
                    }"
                >
                    <ValueItem
                        v-model:modelValue="modelRef.message.value"
                        :itemType="
                            property.valueType?.type || property.type || 'int'
                        "
                        :options="
                            property.valueType?.type === 'enum'
                                ? (property?.valueType?.elements || []).map(
                                      (item) => {
                                          return {
                                              label: item?.text,
                                              value: item?.value,
                                          };
                                      },
                                  )
                                : property.valueType?.type === 'boolean'
                                ? [
                                      { label: '是', value: true },
                                      { label: '否', value: false },
                                  ]
                                : undefined
                        "
                    />
                </j-form-item>
            </j-col>
            <j-col :span="24" v-if="modelRef.messageType === 'INVOKE_FUNCTION'">
                <j-form-item
                    :name="['message', 'functionId']"
                    label="功能"
                    :rules="{
                        required: true,
                        message: '请选择功能',
                    }"
                >
                    <j-select
                        placeholder="请选择功能"
                        v-model:value="modelRef.message.functionId"
                        show-search
                        @change="funcChange"
                    >
                        <j-select-option
                            v-for="i in metadata?.functions || []"
                            :key="i.id"
                            :value="i.id"
                            :label="i.name"
                            >{{ i.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
            </j-col>
            <j-col
                :span="24"
                v-if="
                    modelRef.messageType === 'INVOKE_FUNCTION' &&
                    modelRef.message.functionId
                "
                class="inputs"
            >
                <j-form-item
                    :name="['message', 'inputs']"
                    label="参数列表"
                    :rules="{
                        required: true,
                        message: '请输入参数列表',
                    }"
                >
                    <EditTable
                        ref="editRef"
                        v-model="modelRef.message.inputs"
                    />
                </j-form-item>
            </j-col>
        </j-row>
    </j-form>
</template>

<script lang="ts" setup>
import EditTable from './EditTable.vue';

const formRef = ref();

const props = defineProps({
    actionType: {
        type: String,
        default: '',
    },
    modelValue: {
        type: Object,
        default: () => {},
    },
    metadata: {
        type: Object,
        default: () => {
            return {
                properties: [],
                functions: [],
            };
        },
    },
});

const editRef = ref();

const modelRef = reactive({
    messageType: 'READ_PROPERTY',
    message: {
        properties: undefined,
        functionId: undefined,
        inputs: [],
        value: undefined
    },
});

const property = ref<any>({});

const onPropertyChange = (val: string) => {
    if (val) {
        const _item = props.metadata?.properties.find(
            (item: any) => item.id === val,
        );
        property.value = _item || {};
    }
};

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            Object.assign(modelRef, newVal);
            if(newVal?.message?.properties){
                onPropertyChange(newVal?.message?.properties);
            }
        }
    },
    {
        immediate: true,
    },
);

const funcChange = (val: string) => {
    if (val) {
        const arr =
            props.metadata?.functions.find((item: any) => item.id === val)
                ?.inputs || [];
        const list = arr.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                value: undefined,
                valueType: item?.valueType?.type,
            };
        });
        modelRef.message.inputs = list;
    }
};

const saveBtn = () =>
    new Promise((resolve) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                await editRef.value.onSave().catch(() => {
                    resolve(false)
                })
                resolve(_data)
            })
            .catch((err: any) => {
                resolve(err);
            });
    });

defineExpose({ saveBtn });
</script>

<style lang="less" scoped>
.inputs {
    .ant-form-item:last-child {
        margin-bottom: 0;
    }
}
</style>