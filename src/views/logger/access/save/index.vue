<template>
  <a-modal
    :visible="visible"
    :title="`访问日志详情`"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-descriptions bordered :column="2" >
      <a-descriptions-item label="URL" :span="1">{{ data.url }}</a-descriptions-item>
      <a-descriptions-item label="请求方法" :span="1">{{ data.httpMethod }}</a-descriptions-item>
      <a-descriptions-item label="动作" :span="1">{{ data.action }}</a-descriptions-item>
      <a-descriptions-item label="类名" :span="1">{{ data.target }}</a-descriptions-item>
      <a-descriptions-item label="方法名" :span="1">{{ data.method }}</a-descriptions-item>
      <a-descriptions-item label="IP" :span="1">{{ data.ip }}</a-descriptions-item>
      <a-descriptions-item label="请求时间" :span="1">{{ GetRequestTime }}</a-descriptions-item>
      <a-descriptions-item label="请求耗时" :span="1">{{ (data.responseTime || 0) - (data.requestTime || 0) }}ms</a-descriptions-item>
      <a-descriptions-item label="请求头" :span="2">
        {{ JSON.stringify(data.httpHeaders) }}
      </a-descriptions-item>
      <a-descriptions-item label="请求参数" :span="2">
        {{ JSON.stringify(data.parameters) }}
      </a-descriptions-item>
      <a-descriptions-item label="异常信息" :span="2">
        <div
          style="{
              height: 200,
              overflow: 'auto'
          }">
          {{ data.exception }}
        </div>
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
        console.log(this.data.requestTime)
        return moment(this.data.requestTime).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      handleOk (e) {
        this.$emit('submitData', 123)
      },
      handleCancel (e) {
        this.$emit('close')
      },
      getAccessToken () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
