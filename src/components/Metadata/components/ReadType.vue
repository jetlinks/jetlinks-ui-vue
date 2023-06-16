<template>
<j-form-item name="type" label="读写类型" required>
  <j-select
      v-model:value="myValue"
      mode="multiple"
      :options="[
        { value: 'read', label: '读' },
        { value: 'write', label: '写' },
        { value: 'report', label: '上报' },
      ]"
      :disabled="disabled"
      placeholder="请选择读写类型"
      @change="onChange"
  />
</j-form-item>
</template>

<script setup lang="ts" name="ReadType">

import type {PropType} from "vue";

type Emit = {
  (e: 'update:value', data: Array<string>): void
  (e: 'change', data: Array<string>): void
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: Array as PropType<Array<string>>,
    default: () => []
  }
})

const emit = defineEmits<Emit>()

const myValue = ref<Array<string>>([])

const onChange = (keys: Array<string>) =>{
  myValue.value = keys
  emit('update:value', keys)
  emit('change', keys)
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true})

</script>

<style scoped>

</style>