<template>
  <a-modal
    :visible="visible"
    :title="`${ data.id ? '编辑' : '新建'}证书`"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-form
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 16 }"
    >
      <a-form-item key="name" label="名称" >
        <a-input
          :value="data.name ? data.name: ''"
          v-decorator="['name', {
            rules: [
              { required: true }
            ],
          }]"
          placeholder="请输入"
        />
      </a-form-item>
      <a-form-item key="instance" label="类型" >
        <a-select
          :value="data.instance ? data.instance: ''"
          v-decorator="['instance', {
            rules: [
              { required: true }
            ],
          }]"
          placeholder="请输入"
        >
          <a-select-option v-for="(item, index) in selectOptions" :key="item.id+index" :value="item.id">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item key="configs.keystoreBase64" label="密钥库" >
        <a-upload
          v-decorator="['configs.keystoreBase64', {
            rules: [
              { required: true }
            ],
          }]"
          name="file"
          action="/jetlinks/network/certificate/upload"
          :headers="{
            'X-Access-Token': getAccessToken,
          }"
        >
          <a-button :style="{ width: '100%' }">
            <a-icon type="upload" />
            点击上传
          </a-button>
        </a-upload>
        <a-textarea
          v-decorator="['configs.keystoreBase64', {
            rules: [
              { required: true }
            ],
          }]"
          :rows="3"
        />
      </a-form-item>
      <a-form-item key="configs.trustKeyStoreBase64" label="密钥库密码" >
        <a-upload
          v-decorator="['configs.keystorePwd', {
            rules: [
              { required: true }
            ],
          }]"
          name="file"
          action="/jetlinks/network/certificate/upload"
          :headers="{
            'X-Access-Token': getAccessToken,
          }"
        >
          <a-button :style="{ width: '100%' }">
            <a-icon type="upload" />
            点击上传
          </a-button>
        </a-upload>
        <a-textarea
          v-decorator="['configs.trustKeyStoreBase64', {
            rules: [
              { required: true }
            ],
          }]"
          :rows="3"
        />
      </a-form-item>
      <a-form-item key="description" label="描述" >
        <a-textarea
          v-decorator="['description', {
            rules: [
              { required: true }
            ],
          }]"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
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
        selectOptions: [
          { id: 'PFX', text: 'PFX' },
          { id: 'JKS', text: 'JKS' },
          { id: 'PEM', text: 'PEM' }
        ]
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
