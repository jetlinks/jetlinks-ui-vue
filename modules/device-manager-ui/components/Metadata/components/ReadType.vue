<template>
  <a-form-item
    name="type"
    :label="$t('components.ReadType.885151-0')"
    :rules="[
      {
        required: true,
        message: $t('components.ReadType.885151-1')
      }
    ]"
    style="margin-bottom: 0"
  >
    <j-check-button
      v-model:value="myValue"
      :multiple="true"
      :options="options"
      :disabled="disabled"
      @change="onChange"
    />
  </a-form-item>
</template>

<script setup lang="ts" name="ReadType">

import type {PropType} from "vue";
import {useTableWrapper} from "../context";

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
  },
  options: {
    type: Array as PropType<Array<{label: string, value: string}>>,
    default: () => []
  },
  formRef: {
    type: Object
  }
})

const emit = defineEmits<Emit>()

const myValue = ref<Array<string>>([])
const tableWrapperRef = useTableWrapper()

const onChange = (keys: Array<string>) =>{
  myValue.value = keys
  emit('update:value', keys)
  emit('change', keys)
  props.formRef?.validate(['type'])
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true})

</script>

<style scoped>

</style>
