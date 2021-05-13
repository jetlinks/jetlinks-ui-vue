<template>
  <div class="standardFormRowBlock">
    <div class="label">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StandardFormRow',
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="less" scoped>
@import "index.less";
</style>
