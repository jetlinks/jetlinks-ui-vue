<template>
  <div>
    哈哈哈哈哈哈这是一个自定义组件
    <a-input :value="value" @change="onChange" />
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String
  }
})

const emits = defineEmits(['update:value', 'change'])

// const myValue = ref(props.value)

const onChange = (e) => {
  emits('update:value', e.target.value)
  emits('change', e.target.value)
}

// watch(() => props.value, (val) => {
//   myValue.value = val
// }, {
//   immediate: true
// })
</script>

<style lang="less" scoped>

</style>
