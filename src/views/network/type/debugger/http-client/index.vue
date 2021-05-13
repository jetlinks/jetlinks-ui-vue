<template>
  <a-modal
    :visible="visible"
    title="调试HTTP客户端"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="width"
  >
    <template slot="footer">
      <a-button type="primary">
        开始
      </a-button>
      <a-divider type="vertical" />
      <a-button type="danger" >
        结束
      </a-button>
      <a-divider type="vertical"/>
      <a-button >
        清空
      </a-button>
    </template>

    <a-form
      :labelCol="{ span: 4 }"
      :style="{ overflowY: 'auto', height: '500px' }"
      :wrapperCol="{ span: 20 }"
    >
      <a-form-item label="HTTP请求">
        <a-textarea
          :rows="8"
        />
      </a-form-item>

      <a-divider>调试日志</a-divider>
      <div :style="{ height: 350, overflow: 'auto' }">
        <pre>{{ '占位' }}</pre>
      </div>
    </a-form>

  </a-modal>
</template>

<script>
  export default {
    name: 'DebuggerHttp',
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
