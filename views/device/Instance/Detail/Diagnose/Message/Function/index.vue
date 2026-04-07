<template>
    <div class="function">
        <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <a-row :gutter="24">
                <a-col :span="6">
                    <a-form-item
                        name="type"
                        :rules="{
                            required: true,
                            message: $t('DeviceAccess.index.594346-12'),
                        }"
                    >
                        <a-select
                            :placeholder="$t('DeviceAccess.index.594346-12')"
                            v-model:value="modelRef.type"
                            show-search
                            :filter-option="filterOption"
                            @change='onChange'
                        >
                            <a-select-option value="READ_PROPERTY"
                                >{{ $t('Function.index.125063-0') }}</a-select-option
                            >
                            <a-select-option value="WRITE_PROPERTY"
                                >{{ $t('Function.index.125063-1') }}</a-select-option
                            >
                            <a-select-option value="INVOKE_FUNCTION"
                                >{{ $t('Function.index.125063-2') }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col
                    :span="6"
                    v-if="
                        ['READ_PROPERTY', 'WRITE_PROPERTY'].includes(
                            modelRef?.type || '',
                        )
                    "
                >
                    <a-form-item
                        name="properties"
                        :rules="{
                            required: true,
                            message: $t('Function.index.125063-3'),
                        }"
                    >
                        <a-select
                            :placeholder="$t('Function.index.125063-3')"
                            v-model:value="modelRef.properties"
                            show-search
                            :filter-option="filterOption"
                        >
                            <a-select-option
                                v-for="i in metadata?.properties || []"
                                :key="i.id"
                                :value="i.id"
                                :label="i.name"
                                >{{ i.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-if="modelRef.type === 'WRITE_PROPERTY'">
                    <a-form-item
                        name="propertyValue"
                        :rules="{
                            required: true,
                            message: $t('Function.index.125063-4'),
                        }"
                    >
                        <a-input v-model:value="modelRef.propertyValue" />
                    </a-form-item>
                </a-col>
                <a-col :span="6" v-if="modelRef.type === 'INVOKE_FUNCTION'">
                    <a-form-item
                        name="function"
                        :rules="{
                            required: true,
                            message: $t('Function.index.125063-5'),
                        }"
                    >
                        <a-select
                            :placeholder="$t('Function.index.125063-5')"
                            v-model:value="modelRef.function"
                            show-search
                            :filter-option="filterOption"
                            @change="funcChange"
                        >
                            <a-select-option
                                v-for="i in _properties"
                                :key="i.id"
                                :value="i.id"
                                :label="i.name"
                                >{{ i.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="4">
                    <a-button type="primary" @click="saveBtn">{{ $t('Function.index.125063-6') }}</a-button>
                </a-col>
                <a-col
                    :span="24"
                    v-if="
                        modelRef.type === 'INVOKE_FUNCTION' &&
                        modelRef.function &&
                        modelRef.inputs.length
                    "
                >
                    <!-- <a-form-item
                        name="inputs"
                        :label="$t('Function.index.125063-7')"
                        :rules="{
                            required: true,
                            message: '请输入参数列表',
                        }"
                    >
                        <EditTable v-model="modelRef.inputs" />
                    </a-form-item> -->
                    <div>{{ $t('Function.index.125063-7') }}</div>
                    <EditTable v-model="modelRef.inputs" ref="inputsRef" />
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '../../../../../../../store/instance';
import EditTable from './EditTable.vue';
import {
    executeFunctions,
    readProperties,
    settingProperties,
} from '../../../../../../../api/instance';
import {useI18n} from "vue-i18n";

const { t: $t } = useI18n();
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

const _properties = computed(() => {
  const obj = {
    'WRITE_PROPERTY': 'write',
    'READ_PROPERTY': 'read',
  }
  return (metadata.value?.properties || []).filter((i: any) => {
    return (i.expands.type || []).includes(obj[modelRef.type])
  })
})

const onChange = () => {
  modelRef.properties = undefined
  modelRef.function = undefined
  modelRef.propertyValue = undefined
  modelRef.inputs = []
}

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
