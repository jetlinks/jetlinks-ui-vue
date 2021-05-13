<template>
  <div
    :class="[
      'standardFormRow',
      block ? 'standardFormRowBlock': '',
      last ? 'standardFormRowLast': '',
      grid ? 'standardFormRowGrid': ''
    ]"
    :style="styles"
  >
    <div class="label" v-if="title">
      <span>{{ title }}</span>
    </div>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ComStandardFormRow',
    props: {
      title: {
        type: String,
        default: ''
      },
      block: {
        type: Boolean,
        default: false
      },
      last: {
        type: Boolean,
        default: false
      },
      grid: {
        type: Boolean,
        default: false
      },
      styles: {
        type: Object,
        default: () => {}
      }
    }
  }
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
