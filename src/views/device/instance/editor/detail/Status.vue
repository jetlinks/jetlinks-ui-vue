<template>
  <a-spin :spinning="false">
    <a-row :gutter="24" id="device-instance-status" >
      <a-col>
        <editor-detail-status/>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
  import EditorDetailStatus from './status/DeviceState'
  export default {
    name: 'InsEditorStatus',
    components: {
      EditorDetailStatus
    }
  }
</script>

<style lang="less" scoped>

</style>
