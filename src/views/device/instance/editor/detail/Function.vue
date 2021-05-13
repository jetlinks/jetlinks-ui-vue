<template>
  <div>
    <a-spin :spinning="false">
      <a-card :style="{marginBottom: '20px'}" title="功能调试">
        <a-form :form="form" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
          <a-form-item
            label="设备功能"
          >
            <a-select
              placeholder="请选择设备功能"
              v-decorator="['functionId', {
                rules: [
                  { required: true, message: '请选择设备功能' }
                ]
              }]"
            >
              <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="参数："
          >
            <AceEditor
              v-decorator="['functionData', {
                rules: [
                  { required: true, message: '请输入功能参数' }
                ],
                initialValue :''
              }]"
              mode="json"
              theme="eclipse"
              name="app_code_editor"
              key="simulator"
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
          <div :style="{textAlign: 'right'}">
            <a-button type="primary">
              执行
            </a-button>
            <a-divider type="vertical"/>
            <a-button>
              清空
            </a-button>
          </div>
          <a-form-item label="调试结果：" :style="{paddingTop: '20px'}">
            <a-textarea :rows="4" readOnly/>
          </a-form-item>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
  export default {
    name: 'InsEditorFunction',
    data () {
      return {
        form: this.$form.createForm(this, { name: 'InsEditorFunction' })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
