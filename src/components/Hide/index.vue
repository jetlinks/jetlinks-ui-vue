<template>
  <a-tooltip placement="topLeft" :title="title" :style="{ lineHeight: '17px' }">
    <span :style="styles">
      {{ title }}
    </span>
  </a-tooltip>
</template>

<script>
  export default {
    name: 'ComHide',
    props: {
      title: {
        type: String,
        default: ''
      },
      styles: {
        type: Object,
        default: () => {}
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
