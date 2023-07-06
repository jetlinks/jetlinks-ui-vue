<template>
    <DataTableTypeSelect v-model:value="type" :filter="['object']" @change="change">
        
    </DataTableTypeSelect>
</template>

<script setup lang="ts" name="ValueObject">
import type { PropType } from 'vue';
import {
    DataTableTypeSelect,
    DataTableObject,
} from 'jetlinks-ui-components';
import { DataType } from '../index'
import {typeSelectChange} from "@/views/device/components/Metadata/Base/columns";


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


const type = ref(props.value.valueType?.type || null);

const change = (e: string) => {
  console.log(e)
  const obj = typeSelectChange(e)
  emit('update:value', {
    ...props.value,
    valueType: {
      type: type.value,
      ...obj
    }
  })
}

watch(
    () => props.value,
    (newV) => {
        type.value = props.value.valueType?.type;
    },
    { immediate: true },
);

</script>

<style scoped></style>
