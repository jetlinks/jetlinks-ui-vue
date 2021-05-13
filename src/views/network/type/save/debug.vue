<template>
  <div>
    <debugger-mqtt
      :visible="visible"
      :data="data"
      @closeModal="handleCancel"
      :width="width"
      v-if="type === 'MQTT_CLIENT'"
    />
  </div>
</template>

<script>
  import DebuggerMqtt from '../debugger/mqtt-client'
  export default {
    name: 'TypeSvaeDebug',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 840
      },
      data: {
        type: Object,
        default: () => {}
      },
      type: {
        type: String,
        default: ''
      }
    },
    components: {
      DebuggerMqtt
    },
    methods: {
      handleOk (e) {
        this.$emit('submitData', 123)
      },
      handleCancel (e) {
        this.$emit('closeModal')
      },
      getAccessToken () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
