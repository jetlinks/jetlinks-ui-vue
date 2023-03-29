<template>
    <j-select
        allowClear
        v-model:value="_value"
        @change="onChange"
        placeholder="请选择"
        style="width: 100%"
    >
        <j-select-option
            v-for="item in list"
            v-bind="item"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            showSearch
            >{{ item.name }}</j-select-option
        >
    </j-select>
</template>

<script lang="ts" setup>
import queryDataList from './utils';

const _props = defineProps({
    modelValue: {
        type: String,
        default: undefined,
    },
    type: {
        type: String,
        default: 'POINT',
    },
    id: {
        type: String,
        default: '',
    },
    edgeId: {
        type: String,
        default: '',
    },
    provider: {
        type: String,
        default: '',
    },
});

type Emits = {
    (e: 'update:modelValue', data: string | undefined): void;
    (e: 'update:provider', data: string | undefined): void;
    (e: 'change', data: string | undefined): void;
};
const emit = defineEmits<Emits>();

const list = ref<any[]>([]);
const _value = ref<string | undefined>(undefined);

watchEffect(() => {
    _value.value = _props.modelValue;
});

const onChange = (_val: string, _options: any) => {
    emit('update:modelValue', _val);
    emit('update:provider', _options?.provider);
    emit('change', _val);
};

watchEffect(() => {
    queryDataList(_props.id, _props.edgeId, _props.type).then((_data: any) => {
        list.value = _data;
    });
});
</script>

<style lang="less" scoped>
</style>