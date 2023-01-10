<template>
  <a-spin :spinning="loading">
    <div>
      <a-textarea
        :rows="4"
        @change="textChange"
        v-model="keystoreBase64"
        :placeholder=placeholder
      />
      <a-upload
        accept=".pem"
        listType="text"
        :action="action"
        :headers="headers"
        :showUploadList="false"
        @change="handleChange"
      >
        <a-button style="margin-top: 10px">
          <upload-outlined></upload-outlined>

          上传文件</a-button>
      </a-upload>
    </div>
  </a-spin>
</template>

<script>
// import storage from 'store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { ACCESS_TOKEN_KEY } from '@/utils/consts'
import { UploadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'CertificateFile',
  data () {
    return {
      keystoreBase64: '',
      loading: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers:{
        authorization: 'authorization-text',
      }
      // action: process.env.VUE_APP_BASE_API + `/network/certificate/upload`,
      // headers: {
      //   [ACCESS_TOKEN_KEY]: storage.get(ACCESS_TOKEN)
      // }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => ''
    }
  },
  watch: {
    value: {
        handler (v) {
            this.keystoreBase64 = v
        }
    }
  },
  methods: {
    handleChange (info) {
      this.loading = true
      if (info.file.status === 'done') {
        this.$message.success('上传成功！')
        const result = info.file.response?.result
        this.loading = false
        this.$emit('change', result)
      }
    },
    textChange (val) {
        this.$emit('change', val)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
