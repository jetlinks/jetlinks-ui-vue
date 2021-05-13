<template>
  <a-modal
    :visible="visible"
    :title="`访问日志详情`"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-descriptions bordered :column="2" >
      <a-descriptions-item label="线程名称" :span="1">{{ data.threadName }}</a-descriptions-item>
      <a-descriptions-item label="日志级别" :span="1">{{ data.level }}</a-descriptions-item>
      <a-descriptions-item label="方法名" :span="1">{{ data.methodName }}</a-descriptions-item>
      <a-descriptions-item label="行号" :span="1">{{ data.lineNumber }}</a-descriptions-item>
      <a-descriptions-item label="线程ID" :span="1">{{ data.threadName }}</a-descriptions-item>
      <a-descriptions-item label="IP" :span="1">{{ GetRequestTime }}</a-descriptions-item>
      <a-descriptions-item label="创建时间" :span="2">{{ GetRequestTime }}</a-descriptions-item>
      <a-descriptions-item label="名称" :span="2">{{ data.name }}ms</a-descriptions-item>
      <a-descriptions-item label="类名" :span="2">{{ data.className }}</a-descriptions-item>
      <a-descriptions-item label="消息" :span="2">
        {{ data.message }}
      </a-descriptions-item>
      <a-descriptions-item label="上下文" :span="2">
        {{ JSON.stringify(data.context) }}
      </a-descriptions-item>
      <a-descriptions-item label="异常栈" :span="2">
        <a-textarea :rows="3" :value="data.exceptionStack" />
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'CerSaveModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
      }
    },
    computed: {
      GetRequestTime () {
        return moment(this.data.requestTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      handleOk (e) {
        this.$emit('submitData', 123)
      },
      handleCancel (e) {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
