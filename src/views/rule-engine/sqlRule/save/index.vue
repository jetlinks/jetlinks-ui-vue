<template>
  <a-drawer
    :visible="visible"
    :width="900"
    :title="`${data?data.id ? '编辑' : '新增':''}数据转发`"
    @close="onClose"
  >
    <a-form
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 18 }"
      :style="{ paddingBottom: '20px' }"
      key="sqlRule_form"
    >
      <a-row>
        <a-col :span="12">
          <a-form-item key="name" label="名称" >
            <a-input
              v-decorator="['name', {
                rules: [
                  {required: true, message: '请输入名称'},
                  {max: 200, message: '名称不超过200个字符'}
                ],
                initialValue:data.name ? data.name: ''
              }]"
              placeholder="请输入名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item key="type" label="类型" >
            <a-select
              v-decorator="['type', {
                rules: [
                  { required: true, message: '类型' }
                ],
                initialValue:data.type ? data.type: ''
              }]"
              placeholder="请选择类型"
            >
              <a-select-option value="timer" key="timer">定时</a-select-option>
              <a-select-option value="realTime" key="realTime">实时</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="SQL" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
            <AceEditor
              mode="mysql"
              theme="eclipse"
              name="app_code_editor"
              :fontSize="14"
              showPrintMargin
              showGutter
              wrapEnabled
              highlightActiveLine
              enableSnippets
              :style="{width: '100%', height: '300px'}"
              :setOptions="{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2
              }"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="执行动作" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
            <save-action></save-action>
            <a-button icon="plus" type="link">
              执行动作
            </a-button>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="失败执行动作" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
            <save-action></save-action>
            <a-button icon="plus" type="link">
              执行动作
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
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
      <a-button :style="{ marginRight: '8px' }">
        关闭
      </a-button>
      <a-button type="primary" >
        确认
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
  import SaveAction from './actions'
  export default {
    name: 'SaveDrawer',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      data: {
        type: Boolean,
        default: false
      }
    },
    components: {
      SaveAction
    },
    methods: {
      onClose () {
        this.$emit('onClose', false)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
