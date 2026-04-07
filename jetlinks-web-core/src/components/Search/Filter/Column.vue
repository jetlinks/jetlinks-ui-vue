<script setup lang="ts">
import { useColumnsMap } from './hooks/useSearchEngine'

const props = defineProps({
  value: {
    type: String,
    default: undefined,
  }
})

const columnsMap = useColumnsMap()

const label = computed(() => {
  if (props.value) {
    return columnsMap[props.value]?.title
  }
  return ''
})
</script>

<template>
  <a-tag color="processing" style="margin: 0">
    {{ label }}
  </a-tag>
</template>

<style scoped lang="less">

</style>