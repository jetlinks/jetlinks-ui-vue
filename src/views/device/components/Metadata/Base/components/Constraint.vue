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
import {FULL_CODE} from "jetlinks-ui-components/es/DataTable";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: [String, Array],
    default: ['expands','required']
  }
})

const emit = defineEmits(['update:value'])
const fullRef = inject(FULL_CODE);

const myValue = ref()

const change = (e) => {
  const newData = { ...props.value }
  set(newData, props.name, myValue.value)
  console.log(newData, e);
  emit('update:value', newData)
}

watch(() => JSON.stringify(props.data), () => {
  console.log(props.value, props.name);
  myValue.value = get(props.value, props.name) || false
}, { immediate: true })

</script>

<style scoped>

</style>