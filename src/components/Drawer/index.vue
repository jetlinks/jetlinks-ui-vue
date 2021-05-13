<template>
  <a-drawer
    :title="title"
    :width="width"
    placement="right"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    @close="onClose"
  >
    <slot></slot>
  </a-drawer>
</template>

<script>
  export default {
    name: 'ComDrawer',
    props: {
      width: {
        type: String,
        default: '256px'
      },
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    methods: {
      afterVisibleChange (val) {
      },
      onClose () {
        this.$emit('onClose', false)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
