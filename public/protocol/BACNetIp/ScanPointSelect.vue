<script setup name="SelectOnlyOne">
import { defineEmits, inject, defineProps, computed} from 'vue'

const setting = inject('plugin-scan-point', {})
const emit = defineEmits(['change', 'update:value'])
const props = defineProps({
  value: String
})

const options = computed(() => {
  return setting.value.options.filter(item => !setting.value.selectKeys.has(item.value))
})

const onChange = (v) => {
  setting.value.selectKeys.add(v)
  emit('update:value', v)
}

</script>

<template>
  <a-select
    style="width: 100%"
    :options="options"
    @change="onChange"
  />
</template>

<style scoped lang="less">

</style>
