<template>
  <a-form-item :rules="rules" :name="name" validate-first>
    <template #label>
      <slot name="label">{{ label }}</slot>
    </template>
    <Editable
        :value="value"
        :type="type"
        :componentProps="componentProps"
        @change="onChange"
    />
  </a-form-item>
</template>

<script setup>
import Editable from './index.vue'

const props = defineProps({
  value: {
    type: String,
  },
  type: {
    type: String,
    default: 'string'
  },
  componentProps: {
    type: Object,
    default: () => ({})
  },
  label: {
    type: String,
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  },
  name: {
    type: [String, Array],
  }
})

const emit = defineEmits(['update:value', 'change'])

const onChange = (val) => {
  emit('update:value', val)
  emit('change', val)
}
</script>

<style lang="less" scoped>

</style>
