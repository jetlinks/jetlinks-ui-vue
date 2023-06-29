<template>
    <DataTableObject v-model:value="value" :columns="columns">
      
    </DataTableObject>
</template>

<script setup lang="ts" name="InputParams">
import type { PropType } from 'vue';
import {
    DataTableObject,
} from 'jetlinks-ui-components';

const columns = [{}];

type Emits = {
    (e: 'update:value', data: Record<string, any>): void;
    (e: 'change', data: string): void;
};

const emit = defineEmits<Emits>();
const props = defineProps({
    value: {
        type: Object as PropType<Record<string, any>>,
        default: () => {},
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
    options: {
        type: Array as PropType<{ label: string; value: string }[]>,
        default: () => [],
    },
});

const value = ref(props.value);

const change = (v: string) => {
    emit('update:value', { ...props.value, async: value.value });
    emit('change', v);
};

watch(
    () => props.value,
    (newV) => {
        value.value = props.value.inputs;
    },
    { immediate: true },
);
</script>

<style scoped></style>
