<template>
  <a-modal
    :visible="visible"
    :title="`编辑通知配置`"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="840"
  >
    <a-form
      :form="form"
      :labelCol="{ span: 4 }"
      :wrapperCol="{ span: 20 }"
    >
      <a-form-item label="配置名称">
        <a-input
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入配置名称' }
            ],
            initialValue:data?data.name:''
          }]"
        />
      </a-form-item>
      <a-form-item label="通知类型">
        <a-select
          v-decorator="['type', {
            rules: [
              { required: true, message: '请输入通知类型' }
            ],
            initialValue:data?data.type:''
          }]"
          @change="setType"
        >
          <a-select-option
            v-for="(item, index) in typeItems"
            :key="item + index"
            :value="item.id"
            :initialValue="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="服务商">
        <a-select
          v-decorator="['provider', {
            rules: [
              { required: true, message: '请输入通知类型' }
            ],
            initialValue:data?data.provider:''
          }]"
          @change="setProvider"
        >
          <a-select-option v-for="(item, index) in GetproviderItems(noticeType)" :key="item + index" :value="item.name">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <template v-if="noticeType === 'sms' && result.name">
        <config-provide-item :data="result">

        </config-provide-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script>
  import ConfigProvideItem from './ProvideItem'
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
    components: {
      ConfigProvideItem
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'CerSaveModalForm' }),
        typeItems: [
          { id: 'sms', name: '短信', providerInfos: [{ type: 'sms', id: 'aliyunSms', name: '阿里云短信服务' }, { type: 'sms', id: 'test', name: '测试' }] },
          { id: 'email', name: '邮件', providerInfos: [{ type: 'email', id: 'embedded', name: '默认' }] },
          { id: 'weixin', name: '微信', providerInfos: [{ type: 'weixin', id: 'corpMessage', name: '微信企业消息通知' }] },
          { id: 'voice', name: '语音', providerInfos: [{ type: 'voice', id: 'aliyun', name: '阿里云' }] },
          { id: 'dingTalk', name: '钉钉', providerInfos: [{ type: 'dingTalk', id: 'dingTalkMessage', name: '钉钉消息通知' }] }
        ],
        noticeType: '',
        result: {}
      }
    },
    computed: {
      GetproviderItems (type) {
        return function (type) {
          return this.typeItems.find(v => v.id === this.noticeType)?.providerInfos || []
        }
      }
    },
    methods: {
      handleOk (e) {
        this.$emit('submitData', 123)
      },
      handleCancel (e) {
        this.form.resetFields()
        this.noticeType = ''
        this.result = {}
        this.$emit('close')
      },
      setType (value) {
        this.noticeType = value
      },
      setProvider (value) {
        this.result = {
          'name': '阿里云API配置',
          'description': 'https://help.aliyun.com/document_detail/101300.html',
          'scopes': [],
          'properties': [{
            'property': 'regionId',
            'name': 'regionId',
            'description': 'regionId',
            'type': {
              'name': '字符串',
              'id': 'string',
              'type': 'string'
            },
            'scopes': []
          }, { 'property': 'accessKeyId', 'name': 'accessKeyId', 'description': '', 'type': { 'name': '字符串', 'id': 'string', 'type': 'string' }, 'scopes': [] }, { 'property': 'secret', 'name': 'secret', 'description': '', 'type': { 'name': '字符串', 'id': 'string', 'type': 'string' }, 'scopes': [] }] }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
