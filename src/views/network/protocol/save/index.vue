<template>
  <a-drawer
    :visible="visible"
    :width="width"
    :title="`${ data.id ? '编辑' : '新建'}协议`"
    @close="onClose"
  >
    <a-form
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 18 }"
      :form="form"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item key="id" label="协议ID" >
            <a-input
              v-decorator="['id', {
                rules: [
                  { required: true, message: '请输入协议标识' }
                ],
              }]"
              :initialValue="data.id ? data.id: ''"
              placeholder="请输入协议ID"
              :disabled="data.id ? true : false"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item key="name" label="协议名称" >
            <a-input
              :initialValue="data.name ? data.name: ''"
              v-decorator="['name', {
                rules: [
                  { required: true, message: '请输入协议名称' }
                ],
              }]"
              placeholder="请输入协议名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item key="type" label="类型" >
            <a-select
              v-decorator="['type', {
                rules: [
                  { required: true , message: '请选择类型'}
                ],
              }]"
              :initialValue="data.type ? data.type: undefined"
              @change="SelectProtocolType"
              placeholder="请选择协议类型"
            >
              <a-select-option v-for="(item, index) in protocolTypeOptions" :key="item.id+index" :value="item.id">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="selectProtocolType === 'script' ">
        <a-col :span="12">
          <a-form-item key="protocol" label="协议标识" >
            <a-input
              v-decorator="['configuration.protocol', {
                rules: [
                  { required: true, message: '请输入协议标识' }
                ],
              }]"
              :initialValue="data.configuration?data.configuration.protocol?data.configuration.protocol:undefined:'' "
              placeholder="请输入协议ID"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item key="transport" label="连接协议" >
            <a-select
              v-decorator="['configuration.transport', {
                rules: [
                  { required: true , message: '请输入连接协议'}
                ],
              }]"
              mode="multiple"
              :initialValue="data.configuration? data.configuration.transport.split(','):undefined"
              @change="SelectTransport"
              placeholder="请选择协议类型"
            >
              <a-select-option v-for="(item) in transportOptions" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="selectProtocolType === 'jar' ">
        <a-col :span="12">
          <a-form-item key="provider" label="类名" >
            <a-input
              v-decorator="['configuration.provider', {
                rules: [
                  { required: true, message: '请输入类名' }
                ],
              }]"
              :initialValue="data.configuration?data.configuration.configuration?data.configuration.provider:'':''"
              placeholder="请输入类名"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item key="location" label="文件地址" >
            <a-row>
              <a-col :span="14">
                <a-input
                  v-decorator="['configuration.location', {
                    rules: [
                      { required: true, message: '请上传文件地址' }
                    ],
                  }]"
                  :initialValue="data.location?data.configuration.location?data.configuration.location:'':''"
                  placeholder="请上传文件地址"
                />
              </a-col>
              <a-col :span="2">
                <a-upload v-bind="uploadOptions" @change="UploadLocation">
                  <a-button type="primary" :disabled="uploading">
                    <a-icon type="upload" /> {{ uploading ? '正在上传...' : '上传Jar包' }}
                  </a-button>
                </a-upload>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item key="description" label="描述" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
        <a-input
          :initialValue="data.description ? data.description: ''"
          v-decorator="['description', {
            rules: [
              { required: true ,message: '请输入描述'}
            ],
          }]"
          placeholder="请输入"
        />
      </a-form-item>
      <a-collapse :bordered="false" @change="collapseChange" :activeKey="activeDebugger">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel
          header="调试"
          key="debugger"
          :style="customStyle"
        >
          <a-tabs default-active-key="mock" @change="setActiveKey">
            <a-tab-pane key="mock" tab="模拟输入">
              <a-row>
                <a-col :span="6">
                  <a-form-item key="action" >
                    <a-radio-group defaultValue="encode">
                      <a-radio value="encode">
                        编码
                      </a-radio>
                      <a-radio value="decode">
                        解码
                      </a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item key="transport" label="连接类型" >
                    <a-select
                      @change="SetSelectTransportType"
                    >
                      <a-select-option v-for="(item) in 0" :key="item" :value="item">
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="8" offset="2">
                  <a-form-item key="payloadType" label="消息类型" >
                    <a-select
                      :initialValue="'JSON'"
                      @change="SelectPayloadType"
                      placeholder="请选择消息类型"
                    >
                      <a-select-option v-for="(item) in payloadTypeOptions" :key="item" :value="item">
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <AceEditor
                mode="javascript"
                theme="eclipse"
                name="app_code_editor"
                fontSize="14"
                showPrintMargin
                showGutter
                :value="script"
                wrapEnabled
                highlightActiveLine
                enableSnippets
                :style="{ width: '100%', height: 500 }"
                :setOptions="{
                  enableBasicAutocompletion: true, //启用基本自动完成功能
                  enableLiveAutocompletion: true, //启用实时自动完成功能 （比如：智能代码提示）
                  enableSnippets: true, //启用代码段
                  showLineNumbers: true,
                  tabSize: 2,
                }"
              >
              </AceEditor>
              <a-button type="danger">
                执行
              </a-button>
            </a-tab-pane>
            <a-tab-pane key="result" tab="运行结果">
              <a-textarea :rows="5" :value="12" />
            </a-tab-pane>
          </a-tabs>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        关闭
      </a-button>
      <a-button type="primary" @click="Submit">
        确认
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
  import apis from '@/api'
  import { HandleProviders } from '../service'
  export default {
    name: 'ProtoSaveModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 900
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      getDefaultValue () {
        return function (key, value = '') {
          const { data } = this
          const keys = data.split('.')
          if (keys.length > 1) {
            if (data[keys[0]]) {
            }
          }
          if (data[key]) {
            return data[key]
          }
          return value
        }
      }
    },
    watch: {
      visible: {
        handler (newVal, oldVal) {
          if (newVal === true) {
            console.log('this.data', this.data)
            this.Init()
            this.GetProviders()
          }
        }
      }
    },
    data () {
      // const _this = this
      return {
        form: this.$form.createForm(this, { name: 'ProtoSaveModalForm' }),
        protocolTypeOptions: [],
        selectProtocolType: '',
        transportOptions: [ 'MQTT', 'UDP', 'CoAP', 'TCP', 'HTTP', 'HTTPS' ],
        selectTransportType: '',
        uploading: false,
        uploadOptions: {
          accept: '.jar,.zip',
          name: 'file',
          action: `/jetlinks/file/static`,
          showUploadList: false
        },
        customStyle: 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
        activeDebugger: null,
        script: '//解码,收到设备上行消息时\n' +
          'codec.decoder(function (context) {\n' +
          '  var message = context.getMessage();\n' +
          '  return {\n' +
          '    messageType:"REPORT_PROPERTY"//消息类型\n' +
          '  };\n' +
          '});\n' +
          '\n' +
          '//编码读取设备属性消息\n' +
          'codec.encoder("READ_PROPERTY",function(context){\n' +
          '  var message = context.getMessage();\n' +
          '  var properties = message.properties;\n' +
          '})',
        payloadTypeOptions: [ 'JSON', 'STRING', 'HEX', 'BINARY' ]
      }
    },
    methods: {
      Init () {
        this.selectProtocolType = this.data.type
      },
      async GetProviders () {
        const result = await apis.network.GetProviders()
        const handleData = HandleProviders(result)
        this.protocolTypeOptions = handleData.data
      },
      SelectProtocolType (value) {
        this.selectProtocolType = value
      },
      SelectTransport (value) {
        this.selectTransportType = value
      },
      UploadLocation (info) {
        console.log('++++++ info ++++++', info)
        if (info.file.status === 'uploading') {
          this.uploading = true
        }
        if (info.file.status === 'done') {
          // setJarLocation(info.file.response.result)
          this.form.setFieldsValue({ 'configuration.location': info.file.response.result })
          this.$message.success(`${info.file.name} 上传成功`)
          this.uploading = false
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`)
          this.uploading = false
        }
      },
      collapseChange (key) {
        this.form.validateFields((err) => {
          if (!err) {
            this.activeDebugger = this.activeDebugger !== 'debugger' ? 'debugger' : ''
          } else {
            this.activeDebugger = ''
          }
        })
      },
      setActiveKey (e) {
        console.log('1')
      },
      SetSelectTransportType () {

      },
      SelectPayloadType () {

      },
      Submit (e) {
        const { form: { validateFields } } = this
        validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
      },
      onClose (e) {
        this.form.resetFields()
        this.$emit('onClose')
      },
      getAccessToken () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
