<template>
<j-form-item name="type" label="读写类型" :rules="[
  {
    required: true,
    message: '请选择读写类型'
  }
]">
  <j-select
      v-model:value="myValue"
      mode="multiple"
      :options="options"
      :disabled="disabled"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :getPopupContainer="(node) => tableWrapperRef || node"
      placeholder="请选择读写类型"
      @change="onChange"
  />
</j-form-item>
</template>

<script setup lang="ts" name="ReadType">

import type {PropType} from "vue";
import {useTableWrapper} from "@/components/Metadata/Table/utils";

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
  }
})

const emit = defineEmits<Emit>()

const myValue = ref<Array<string>>([])
const tableWrapperRef = useTableWrapper()

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
