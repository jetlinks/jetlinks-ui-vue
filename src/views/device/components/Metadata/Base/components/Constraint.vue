<template>
  <j-select-boolean
    v-model:value="myValue"
    tureTitle="必填"
    falseTitle='不必填'
    style="width: 100%;"
    @change="change"
  >

  </j-select-boolean>
</template>

<script setup name="ConstraintSelect">
import { set, get } from 'lodash-es'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: [String, Array],
    default: 'required'
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref()

const change = () => {
  const newData = { ...props.value }
  set(newData, name, myValue.value)
  emit('update:value', newData)
}

watch(() => JSON.stringify(props.data), () => {
  myValue.value = get(props.data, name)
}, { immediate: true })

</script>

<style scoped>

</style>