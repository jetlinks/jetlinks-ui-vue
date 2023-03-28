<template>
    <ParamsDropdown
        placeholder="请选择"
        :options="handleOptions"
        :tabsOptions="tabOptions"
        :metricOptions="upperOptions"
        v-model:value="_value"
        v-model:source="_source"
        @select="onChange"
        valueName="id"
    >
        <template v-slot="{ label }">
            <j-input :value="label" readonly />
        </template>
    </ParamsDropdown>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import ParamsDropdown from '../../../components/ParamsDropdown';
import { handleParamsData } from './index';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    builtInList: {
        type: Array,
        default: () => [],
    },
    value: {
        type: String,
    },
    source: {
        type: String,
        default: 'fixed',
    },
});

const emit = defineEmits(['update:value', 'update:source', 'change']);

const _value = ref();
const _source = ref();

const tabOptions = computed(() => {
    return [
        {
            label: '手动输入',
            component: props.data?.valueType?.type,
            key: 'fixed',
        },
        {
            label: '内置参数',
            component: 'tree',
            key: 'upper',
        },
    ];
});

const handleOptions = computed(() => {
    const _item = props.data?.valueType || 'int';
    const _type = _item?.type;
    if (_type === 'boolean') {
        return [
            {
                label: _item.trueText || true,
                value: _item.trueValue || true,
            },
            {
                label: _item.falseText || false,
                value: _item.falseValue || false,
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
    return filterParamsData(props.data.valueType?.type, cloneDeep(props?.builtInList));
});

const onChange = () => {
    emit('update:value', _value.value);
    emit('update:source', _source.value);
    emit('change', { source: _source.value, value: _value.value });
};

watchEffect(() => {
    _value.value = props.value;
    _source.value = props.source || 'fixed';
});
</script>