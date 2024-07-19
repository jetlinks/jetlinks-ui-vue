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
                    label="设置属性"
                    :rules="[{ required: true, message: '请选择设置属性' }]"
                >
                    <j-select
                        showSearch
                        placeholder="请选择属性"
                        v-model:value="propertyModelRef.properties"
                        @change="onChange"
                    >
                        <j-select-option
                            v-for="item in (metadata?.properties || [])?.filter(i => i?.expands?.type?.includes('write')) || []"
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
                        :options="handleOptions"
                        :tabsOptions="tabOptions"
                        :metricOptions="upperOptions"
                        v-model:value="propertyModelRef.propertiesValue"
                        v-model:source="propertyModelRef.source"
                        valueName="id"
                        treeKey="id"
                        @select="onValueChange"
                    >
                        <template v-slot="{ label }">
                            <j-input readonly :value="label" placeholder="请选择" />
                        </template>
                    </ParamsDropdown>
                </j-form-item>
            </j-col>
        </j-row>
    </j-form>
</template>

<script lang="ts" setup>
import { cloneDeep, isObject } from 'lodash-es'
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
    columnMap: {
      type: Object,
      default: () => ({})
    }
});

const emit = defineEmits(['update:value', 'change', 'update:columnMap']);

const propertyFormRef = ref();
const columnMap = ref(props.columnMap || {})

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
                return true;
            }
            return false;
        });
        return handleParamsData(list);
    }
    return data || [];
};

const upperOptions = computed(() => {
    const _data = filterParamsData(getType.value?.valueType?.type, cloneDeep(props?.builtInList))
    return _data
});

const handleOptions = computed(() => {
    const _item = getType.value?.valueType;
    const _type = _item?.type;
    if (_type === 'boolean') {
        return [
            {
                label: _item.trueText || true,
                name: _item.trueText || true,
                value: _item.trueValue || true,
                id: String(_item.trueValue || true),
            },
            {
                label: _item.falseText || false,
                name: _item.falseText || false,
                value: _item.falseValue || false,
                id: String(_item.falseValue || false),
            },
        ];
    }
    if (_type === 'enum') {
        return _item?.elements.map((i: any) => {
            return {
                label: i.text,
                name: i.text,
                value: i.value,
                id: i.value,
            };
        });
    }
    return [];
});

const onChange = () => {
    propertyModelRef.propertiesValue = undefined;
    propertyModelRef.source = 'fixed';
    columnMap.value = {}
    emit('update:value', {
        [`${propertyModelRef.properties}`]: {
            value: propertyModelRef?.propertiesValue,
            source: propertyModelRef?.source,
        },
    });
};

const onValueChange = (val: any, label: string) => {
  const optionColumn = isObject(val) && (val as any).metadata ? [(val as any).column] : []

  const objectValue: any = {
    value: propertyModelRef?.propertiesValue,
    source: propertyModelRef?.source,
  }

    if (propertyModelRef?.source === 'upper') {
      objectValue.upperKey = propertyModelRef?.propertiesValue
    }

    const obj = {
        [`${propertyModelRef.properties}`]: objectValue
    };

    columnMap.value = {
      [propertyModelRef.properties]: propertyModelRef?.source === 'upper' ? val.column : undefined
    }

    emit('update:value', obj);
    emit('update:columnMap', columnMap.value);
    emit('change', label || val, optionColumn)
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

const onSave = () => {
    return new Promise((resolve, reject) => {
        propertyFormRef.value
            .validate()
            .then(() => {
                resolve(true);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

defineExpose({ onSave });
</script>
