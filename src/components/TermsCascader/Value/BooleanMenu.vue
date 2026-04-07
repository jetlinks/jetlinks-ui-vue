<script setup name="BooleanMenu">
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [Boolean, String],
    default: undefined,
  }
})
const emit = defineEmits(['change', 'update:modelValue'])

const selectedKeys = ref([])

const _options = computed(() => {
  return props.options.map(item => ({
    ...item,
    value: String(item.value)
  }))
})

const onChange = (e) => {
  const key = e.key
  selectedKeys.value = [key]
  const boolValue = key === 'true'
  emit('update:modelValue', boolValue)
  emit('change', boolValue)
}

watch(() => props.modelValue, (newValue) => {
  selectedKeys.value = [String(newValue)]
}, { immediate: true })
</script>

<template>
  <a-menu :selectedKeys="selectedKeys" @click="onChange">
    <a-menu-item v-for="item in _options" :key="item.value">{{ item.label}}</a-menu-item>
  </a-menu>
</template>

<style scoped lang="less">

</style>
