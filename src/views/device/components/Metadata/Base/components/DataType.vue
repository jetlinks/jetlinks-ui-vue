<template>
  <div class="metadata-type">
    <DataTableTypeSelect v-model:value="type" @change="typeChange" />
    <DataTableArray v-if="type === 'array'" />
    <DataTableObject v-else-if="type === 'object'" />
    <DataTableEnum v-else-if="type === 'enum'" />
    <DataTableBoolean v-else-if="type === 'object'" />
    <DataTableDouble v-else-if="['float', 'double'].includes(type)" />
    <DataTableInteger v-else-if="['int', 'long'].includes(type)" />
    <DataTableFile v-else-if="type === 'file'" />
    <DataTableDate v-else-if="type === 'date'" />
    <DataTableString v-else-if="type === 'string'" />
  </div>
</template>

<script setup lang="ts" name="MetadataDataType">
import {
  DataTableTypeSelect,
  DataTableArray,
  DataTableString,
  DataTableInteger,
  DataTableDouble,
  DataTableBoolean,
  DataTableEnum,
  DataTableFile,
  DataTableDate,
  DataTableObject,
} from 'jetlinks-ui-components'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value'])

const type = ref(props.value?.type)
const elements = ref(props.value?.elements)

const typeChange = () => {
  emit('update:value', {
    type: type,

  })
}

watch(() => props.value, () => {
  type.value = props.value?.type
  elements.value = props.value?.elements
}, { immediate: true, deep: true})

</script>

<style scoped>
.metadata-type {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>