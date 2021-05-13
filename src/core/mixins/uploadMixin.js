import { getAccessToken } from '@/utils/authority'

export const uploadMixin = {
  data () {
    return {
      photoUrl: '',
      uploadOptions: {
        name: 'file',
        action: '/jetlinks/file/static',
        headers: {
          'X-Access-Token': getAccessToken()
        },
        showUploadList: false
      }
    }
  },
  methods: {
    uploadAvatar (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.photoUrl = info.file.response.result
        this.$message.success(`上传头像成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
