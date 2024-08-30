<template>
    <a-select
        v-model:value="_value"
        style="width: 200px"
        :options="_options"
        :disabled="disabled"
        :field-names="{ label: 'name', value: 'id' }"
        allowClear
        show-search
        :filter-option="filterOption"
        @change="(value, option) => onChange(value, option)"
        placeholder="请选择计划"
    />
</template>

<script setup lang="ts" name="planSelect">
import { computed, ref, watch } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    selectKeys: {
        type: Array,
        default: () => [],
    },
    value: {
        type: String,
        default: undefined,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const _options = computed(() => {
    const keys = props.selectKeys.map((i: any) => {
        if (i.id !== _value.value) return i.id;
    });
    return props.options.filter((item: any) => {
        return !keys.includes(item.id);
    });
});

const _value = ref('');

const emits = defineEmits(['change', 'update:value']);

const onChange = (value: string, option: any) => {
    emits('change', option);
    emits('update:value', value);
};

const filterOption = (input: string, option: any) => {
    return option.name?.toLowerCase().indexOf(input?.toLowerCase()) >= 0;
};

watch(
    () => props.value,
    () => {
        _value.value = props.value;
    },
    { immediate: true },
);
</script>

<style lang="less" scoped></style>
