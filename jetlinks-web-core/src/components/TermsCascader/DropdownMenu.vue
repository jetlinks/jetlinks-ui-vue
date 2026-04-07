<script setup name="DropdownMenu">

const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  value: {
    type: String,
    default: undefined,
  }
})

const selectedKeys = ref([])

const optionsMap = computed(() => {
  const map = new Map()
  props.options.forEach(item => {
    map.set(item.value, item)
  })
  return map
})

const label = computed(() => {
  const _value = selectedKeys.value[0]
  return optionsMap.value.get(_value)?.label || _value
})

const onChange = (e) => {
  selectedKeys.value = [e.key]
  emit('update:value', e.key)
  emit('change', e.key)
}

watch(() => props.value, (newValue) => {
  selectedKeys.value = [newValue]
}, { immediate: true })

</script>

<template>
  <a-dropdown :trigger="['click']">
    <div class="terms-value--type">
      <a-space :size="2">
        <span>{{ label }}</span>
      </a-space>
    </div>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys" @click="onChange">
        <a-menu-item v-for="item in options" :key="item.value">{{ item.label}}</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped lang="less">

</style>
