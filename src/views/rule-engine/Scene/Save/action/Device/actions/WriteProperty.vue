<template>
    <j-form
        :layout="'vertical'"
        ref="propertyFormRef"
        :model="propertyModelRef"
    >
        <j-row :gutter="24">
            <j-col :span="12">
                <j-form-item
                    name="properties"
                    label="读取属性"
                    :rules="[{ required: true, message: '请选择读取属性' }]"
                >
                    <j-select
                        showSearch
                        placeholder="请选择属性"
                        v-model:value="propertyModelRef.properties"
                        @change="onChange"
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
            <j-col :span="12" v-if="propertyModelRef.properties">
                <j-form-item
                    name="propertiesValue"
                    label="属性值"
                    :rules="[{ required: true, message: '请选择' }]"
                >
                    <ParamsDropdown
                        placeholder="请选择"
                        :options="handleOptions"
                        :tabsOptions="tabOptions"
                        :metricOption="upperOptions"
                        v-model:value="propertyModelRef.propertiesValue"
                        v-model:source="propertyModelRef.source"
                        @change="onValueChange"
                    >
                        <template v-slot="{ label }">
                            <j-input :value="label" />
                        </template>
                    </ParamsDropdown>
                </j-form-item>
            </j-col>
        </j-row>
    </j-form>
</template>

<script lang="ts" setup>
import ParamsDropdown from '../../../components/ParamsDropdown';
import { handleParamsData } from './index';
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    metadata: {
        type: Object,
        default: () => {
            return {
                properties: [],
            };
        },
    },
    builtInList: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['update:value']);

const propertyFormRef = ref();

const propertyModelRef = reactive({
    properties: undefined,
    propertiesValue: undefined,
    source: 'fixed',
});

const getType = computed(() => {
    return props.metadata.properties.find(
        (item: any) => item.id === propertyModelRef.properties,
    );
});

const tabOptions = computed(() => {
    return [
        {
            label: '手动输入',
            component: getType.value?.valueType?.type,
            key: 'fixed',
        },
        {
            label: '内置参数',
            component: 'tree',
            key: 'upper',
        },
    ];
});

const filterParamsData = (type?: string, data?: any[]): any[] => {
    if (type && data) {
        const list = data.filter((item) => {
            if (item.children) {
                const _children = filterParamsData(type, item.children);
                item.children = _children;
                return _children.length ? true : false;
            } else if (item.type === type) {
                //   optionMap.current.set(item.id, item);
                return true;
            }
            return false;
        });
        return handleParamsData(list);
    }
    return data || [];
};

const upperOptions = computed(() => {
    return filterParamsData(getType.value?.valueType?.type, props?.builtInList);
});

const handleOptions = computed(() => {
    const _item = getType.value?.valueType;
    const _type = _item?.type;
    if (_type === 'boolean') {
        return [
            {
                label: _item.trueText,
                value: _item.trueValue,
            },
            {
                label: _item.falseText,
                value: _item.falseValue,
            },
        ];
    }
    if (_type === 'enum') {
        return _item?.elements.map((i: any) => {
            return {
                label: i.text,
                value: i.value,
            };
        });
    }
    return [];
});

const onChange = () => {
    propertyModelRef.propertiesValue = undefined;
    propertyModelRef.source = 'fixed'
    emit('update:value', {
        [`${propertyModelRef.properties}`]: {
            value: propertyModelRef?.propertiesValue,
            source: propertyModelRef?.source,
        },
    });
};

const onValueChange = () => {
    const obj = {
        [`${propertyModelRef.properties}`]: {
            value: propertyModelRef?.propertiesValue,
            source: propertyModelRef?.source,
        },
    }
    emit('update:value', obj);
};

watch(
    () => props.value,
    (newVal) => {
        if (newVal) {
            const _keys = Object.keys(newVal)?.[0];
            if (_keys) {
                propertyModelRef.properties = _keys as any;
                propertyModelRef.propertiesValue = newVal[_keys]?.value;
                propertyModelRef.source = newVal[_keys]?.source;
            }
        }
    },
    { deep: true, immediate: true },
);
</script>