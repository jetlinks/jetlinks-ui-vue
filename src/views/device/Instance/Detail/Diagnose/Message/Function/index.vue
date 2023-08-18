<template>
    <div class="function">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-row :gutter="24">
                <j-col :span="6">
                    <j-form-item
                        name="type"
                        :rules="{
                            required: true,
                            message: '请选择',
                        }"
                    >
                        <j-select
                            placeholder="请选择"
                            v-model:value="modelRef.type"
                            show-search
                            :filter-option="filterOption"
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
                    :span="6"
                    v-if="
                        ['READ_PROPERTY', 'WRITE_PROPERTY'].includes(
                            modelRef?.type || '',
                        )
                    "
                >
                    <j-form-item
                        name="properties"
                        :rules="{
                            required: true,
                            message: '请选择属性',
                        }"
                    >
                        <j-select
                            placeholder="请选择属性"
                            v-model:value="modelRef.properties"
                            show-search
                            :filter-option="filterOption"
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
                <j-col :span="6" v-if="modelRef.type === 'WRITE_PROPERTY'">
                    <j-form-item
                        name="propertyValue"
                        :rules="{
                            required: true,
                            message: '请输入值',
                        }"
                    >
                        <j-input v-model:value="modelRef.propertyValue" />
                    </j-form-item>
                </j-col>
                <j-col :span="6" v-if="modelRef.type === 'INVOKE_FUNCTION'">
                    <j-form-item
                        name="function"
                        :rules="{
                            required: true,
                            message: '请选择功能',
                        }"
                    >
                        <j-select
                            placeholder="请选择功能"
                            v-model:value="modelRef.function"
                            show-search
                            :filter-option="filterOption"
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
                <j-col :span="4">
                    <j-button type="primary" @click="saveBtn">发送</j-button>
                </j-col>
                <j-col
                    :span="24"
                    v-if="
                        modelRef.type === 'INVOKE_FUNCTION' &&
                        modelRef.function &&
                        modelRef.inputs.length
                    "
                >
                    <!-- <j-form-item
                        name="inputs"
                        label="参数列表"
                        :rules="{
                            required: true,
                            message: '请输入参数列表',
                        }"
                    >
                        <EditTable v-model="modelRef.inputs" />
                    </j-form-item> -->
                    <div>参数列表</div>
                    <EditTable v-model="modelRef.inputs" ref="inputsRef" />
                </j-col>
            </j-row>
        </j-form>
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import EditTable from './EditTable.vue';
import {
    executeFunctions,
    readProperties,
    settingProperties,
} from '@/api/device/instance';

const instanceStore = useInstanceStore();

const formRef = ref();

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

type Emits = {
    (e: 'update:modelValue', data: any): void;
};
const emit = defineEmits<Emits>();

const inputsRef = ref<any>(null);

const modelRef = reactive({
    type: undefined,
    properties: undefined,
    function: undefined,
    inputs: [],
    propertyValue: undefined,
});

const metadata = computed(() => {
    return JSON.parse(instanceStore.current?.metadata || '{}');
});

const funcChange = (val: string) => {
    if (val) {
        const arr =
            metadata.value?.functions.find((item: any) => item.id === val)
                ?.inputs || [];
        const list = arr.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                value: undefined,
                valueType: item?.valueType,
                required: item?.expands?.required,
            };
        });
        modelRef.inputs = list;
    }
};

const saveBtn = async () => {
    const _data = await formRef.value?.validate();
    if (!_data) return;
    const values = toRaw(modelRef);
    if (values.type === 'READ_PROPERTY') {
        await readProperties(instanceStore.current?.id || '', [
            values.properties,
        ]);
    } else if (values.type === 'WRITE_PROPERTY') {
        await settingProperties(instanceStore.current?.id || '', {
            [values.properties || '']: values.propertyValue,
        });
    } else {
        if (modelRef.inputs.length) {
            const _inputs = await inputsRef.value?.onSave();
            if (!_inputs) {
                return;
            }
        }

        const list = (modelRef?.inputs || [])?.filter((it: any) => !!it.value);
        const obj = {};
        list.map((it: any) => {
            obj[it.id] = it.value;
        });
        await executeFunctions(
            instanceStore.current.id || '',
            values?.function || '',
            {
                ...obj,
            },
        );
    }
};

defineExpose({ saveBtn });
</script>

<style lang="less" scoped>
.function {
    padding: 24px 15px 0 15px;
    background-color: #e7eaec;
}
</style>