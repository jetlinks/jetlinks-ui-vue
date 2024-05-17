<template>
  <a-table
    size="small"
    v-bind="props"
  >
    <template v-for="(_, key) in slots" :key="key" #[key]="slotData">
      <slot :name="key" v-bind="slotData"/>
    </template>
  </a-table>
</template>

<script setup name="MetadataBaseTable">
import {useValidate} from './utils'
import { tableProps } from 'ant-design-vue/lib/table'
import { useFormContext } from './context'

const slots = useSlots()
const props = defineProps({
  ...tableProps(),
})

const { rules, validateItem } = useValidate(props.dataSource, props.columns)

const fields = {}
const addField = (key, field) => {
  fields[key] = field
}

const removeField = (key) => {
  delete fields[key]
}

const validate = () => {
  Object.values(fields).forEach(field => {
    field.validateRules()
  })
}

useFormContext({
  dataSource: computed(() => props.dataSource),
  addField,
  removeField,
  validateItem,
  rules
})

defineExpose({
  validate
})
</script>

<style scoped>

</style>
