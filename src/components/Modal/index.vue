<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <slot></slot>
  </a-modal>
</template>

<script>
  export default {
    name: 'ComModal',
    props: {
      title: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '50%'
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleOk (e) {
        this.$emit('SetModalOk')
      },
      handleCancel (e) {
        this.$emit('SetModalCancel')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
