<template>
  <div>
    <a-checkbox-group
        v-model:value="_value"
        :options="options"
        @change="onChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type:Array,
    default: () => []
  },
  value: {
    type: Array,
    default: () => ['view']
  }
})
const emits = defineEmits(['change'])
const _value = ref([])

const onChange = (val) => {
  emits('change', val)
}

watch(() => props.value, (val) => {
  _value.value = val.length ? val : ['view'];
}, {
  deep: true,
  immediate: true
})
</script>

<style lang="less" scoped>

</style>
