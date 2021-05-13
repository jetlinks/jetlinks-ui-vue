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
        发送
      </a-button>
      <a-divider type="vertical"/>
      <a-button >
        清空
      </a-button>
    </template>

    <a-tabs :default-active-key="action">
      <a-tab-pane key="_subscribe" tab="订阅消息">
        <a-form
          :labelCol="{ span: 4 }"
          :style="{ overflowY: 'auto', height: '500px' }"
          :wrapperCol="{ span: 20 }"
        >
          <a-form-item label="订阅Topic">
            <a-textarea
              :rows="2"
            />
          </a-form-item>
          <a-form-item label="数据类型">
            <a-select>
              <a-select-option value="JSON">JSON</a-select-option>
              <a-select-option value="BINARY">二进制</a-select-option>
              <a-select-option value="STRING">字符串</a-select-option>
              <a-select-option value="HEX">16进制</a-select-option>
            </a-select>
          </a-form-item>
          <a-divider>调试日志</a-divider>
          <div :style="{ height: 350, overflow: 'auto' }">
            <pre>{{ '占位' }}</pre>
          </div>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
  export default {
    name: 'DebuggerMqtt',
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
    data () {
      return {
        action: '_subscribe'
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
