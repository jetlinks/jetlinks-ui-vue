<template>
  <a-modal
    title="批量导入设备"
    visible
    okText=""
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="uploading" tip="上传中...">
      <a-form
        :form="form"
        :labelCol="{span: 4}"
        :wrapperCol="{span: 20}"
      >
        <a-form-item key="productId" label="产品" >
          <a-select placeholder="选择产品" allowClear @change="setProduct">
            <a-select-option v-for="(item,index) in productListId" :key="'productListId' + index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <template v-if="selectProductId">
          <a-form-item label="文件格式" >
            <a-radio-group default-value=".xlsx">
              <a-radio-button value=".xlsx">xlsx</a-radio-button>
              <a-radio-button value=".csv">csv</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="文件上传" >
            <a-upload v-bind="uploadOptions" @change="setUpload">
              <a-button icon="upload">上传文件</a-button>
            </a-upload>
            <span :style="{marginLeft: '10px'}">
              下载模版
              <a :style="{marginLeft: '10px'}" @click="() => downloadTemplate('xlsx')">.xlsx</a>
              <a :style="{marginLeft: '10px'}" @click="() => downloadTemplate('csv')">.csv</a>
            </span>
            <br/>
            <template v-if="importLoading">
              <div>
                <a-badge v-if="flag" status="processing" text="进行中"/>
                <a-badge v-else status="success" text="已完成"/>
                <span :style="{marginLeft: 15}">总数量:{{ count }}</span>
                <p :style="{color: 'red'}">{{ message }}</p>
              </div>
            </template>
          </a-form-item>
        </template>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { uploadMixin } from '@/core/mixins/uploadMixin'
  import { getAccessToken } from '@/utils/authority'
  import { EventSourcePolyfill } from 'event-source-polyfill'
  import { wrapAPI } from '@/utils/util'

  export default {
    name: 'DeviceImport',
    mixins: [uploadMixin],
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      productListId: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        uploading: false,
        form: this.$form.createForm(this, 'DeviceImportTable'),
        selectProductId: '',
        importLoading: false,
        flag: '',
        count: '',
        source: '',
        message: ''
      }
    },
    methods: {
      setProduct (value) {
        this.selectProductId = value
      },
      downloadTemplate (type) {
        const formElement = document.createElement('form')
        formElement.style.display = 'display:none;'
        formElement.method = 'GET'
        formElement.action = `/jetlinks/device/instance/${this.selectProductId}/template.${type}`
        const inputElement = document.createElement('input')
        inputElement.type = 'hidden'
        inputElement.name = ':X_Access_Token'
        inputElement.value = getAccessToken()
        formElement.appendChild(inputElement)
        document.body.appendChild(formElement)
        formElement.submit()
        document.body.removeChild(formElement)
      },
      setUpload (info) {
        this.count = 0
        this.message = ''
        this.flag = true
        this.importLoading = false
        this.uploading = true
        if (info.file.status === 'done') {
          this.uploading = false
          this.$message.success('文件上传成功')
          this.submitData(info.file.response.result)
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`)
        }
      },
      submitData (fileUrl) {
        if (fileUrl) {
          this.importLoading = true
          let dt = 0
          // todo:后期需优化，更换为：websocket
          const source = new EventSourcePolyfill(
            wrapAPI(`/jetlinks/device/instance/${this.selectProductId}/import?fileUrl=${fileUrl}&:X_Access_Token=${getAccessToken()}`)
          )
          this.source = source
          source.onmessage = (e) => {
            const res = JSON.parse(e.data)
            if (res.success) {
              const temp = res.result.total
              dt += temp
              this.count = dt
            } else {
              this.message = res.message
              this.$message.error(res.message)
            }
          }
          source.onerror = () => {
            // setFlag(false)
            this.flag = false
            source.close()
          }
          source.onopen = () => {
          }
        } else {
          this.$message.error('请先上传文件')
        }
      },
      handleOk () {
        if (Object.keys(this.source).length !== 0) {
          this.source.close()
        }
        this.$emit('importCancel')
      },
      handleCancel () {
        if (Object.keys(this.source).length !== 0) {
          this.source.close()
        }
        // this.source.close()
        this.$emit('importCancel')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
