<template>
  <DataTableTypeSelect
      v-model="myValue"
      :filter="['object']"
      @change="change"
  />
</template>

<script setup lang="ts" name="DataTypeSelect">
import {
  DataTableTypeSelect,
} from 'jetlinks-ui-components';
import {typeSelectChange} from "@/views/device/components/Metadata/Base/columns";

const props = defineProps({
  value: {
    type: Object,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref()

const change = (e: string) => {
  const obj = typeSelectChange(e)
  const _data = {...props.value}
  _data.valueType = obj
  emit('update:value', _data)
}

watch(() => props.value, () => {
  myValue.value = props.value?.valueType?.type
}, { immediate: true, deep: true})

</script>

<style scoped>

</style>