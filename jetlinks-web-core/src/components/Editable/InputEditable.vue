<template>
  <div>
    <div v-if="!isEdit" style="display: flex; align-items: center; gap: 8px">
      <j-ellipsis>{{ _value || '--' }}</j-ellipsis>
      <a-button type="link" @click="isEdit = true" size="small">
        <AIcon type="EditOutlined"/>
      </a-button>
    </div>
    <a-input v-else v-model:value="_value" :maxLength="maxLength" @blur="onBlur" :disabled="disabled"/>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number,
    default: undefined
  }
})
const emit = defineEmits(['update:value', 'change'])

const _value = ref()
const isEdit = ref(false)

const onBlur = () => {
  isEdit.value = false
  if (_value.value !== props.value) {
    emit('update:value', _value.value)
    emit('change', _value.value)
  }
}

watch(() => props.value, (newVal) => {
  _value.value = newVal
}, {
  immediate: true
})
</script>

<style lang="less" scoped>

</style>

