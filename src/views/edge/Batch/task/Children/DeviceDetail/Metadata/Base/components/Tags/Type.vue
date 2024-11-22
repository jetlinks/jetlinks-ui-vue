<template>
  <j-select
      v-model:value="myValue"
      mode="multiple"
      :options="[
        { label: '读', value: 'read'},
        { label: '写', value: 'write'},
        { label: '上报', value: 'report'},
      ]"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :get-popup-container="(node) => fullRef || node"
      placeholder="请选择读写类型"
      @change="onChange"
  />
</template>

<script setup lang="ts">
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'

type Emit = {
(e: 'update:value', data: any): void
}

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const fullRef = inject(FULL_CODE);
const myValue = ref<Array<string>>([])

const onChange = () =>{
  const _data = {
    ...props.value
  }

  _data.expands['type'] = myValue.value

  emit('update:value', {
    ..._data
  })
}

watch(() => props.value.expands, () => {
  myValue.value = props.value?.expands?.type
}, { immediate: true})

</script>

<style scoped>

</style>
