<script setup name="ValueTree">

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const checkedKeys = ref([])
const selectedKeys = ref([])

const emit = defineEmits(['update:value'])

const onCheck = (keys) => {
  const keySet = new Set(checkedKeys.value)
  keys.forEach(key => {
    !keySet.has(key) && keySet.add(key)
  })
  checkedKeys.value = [...keySet.values()]
  emit('update:value', checkedKeys.value)
};

const onSelect = (key) => {
  selectedKeys.value = key

  emit('update:value', selectedKeys.value[0])
};

watch(() => props.value, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    if (Array.isArray(newVal)) {
      checkedKeys.value = newVal
    } else {
      selectedKeys.value = [newVal]
    }
  } else {
    checkedKeys.value = []
    selectedKeys.value = []
    }
}, { immediate: true })

</script>

<template>
<a-tree
  :checkedKeys="checkedKeys"
  :selectedKeys="selectedKeys"
  :treeData="options"
  :checkable="props.multiple !== false"
  :height="350"
  :blockNode="true"
  :fieldNames="{title: 'name', key: 'id'}"
  style="width: auto;height: 350px;overflow: auto"
  @check="onCheck"
  @select="onSelect"
>

</a-tree>
</template>

<style scoped lang="less">

</style>