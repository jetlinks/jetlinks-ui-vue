<template>
  <div>
    <a-form :form="form">
      <a-form-item label="事件标识">
        <a-input
          placeholder="请输入事件标识"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入事件标识' },
              { max: 64, message: '事件标识不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '事件标识只能由数字、字母、下划线、中划线组成' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="事件名称">
        <a-input
          placeholder="请输入事件名称"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入事件名称' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="事件级别">
        <a-radio-group
          v-decorator="[
            'expands.level',
            {
              rules: [
                { required: true },
              ]
            },
          ]"
        >
          <a-radio value="ordinary">
            普通
          </a-radio>
          <a-radio value="warn">
            警告
          </a-radio>
          <a-radio value="urgentx ">
            紧急
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="输出参数"
        v-decorator="['output.type', {
          rules: [
            { required: true, message: '请选择' }
          ]
        }]"
      >
        <a-select style="width: 100%" placeholder="请选择数据类型" @change="handleChangeType">
          <a-select-opt-group>
            <span slot="label">基本类型</span>
            <a-select-option value="jack">
              int
            </a-select-option>
            <a-select-option value="lucy">
              long
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item
        label="描述"
        v-decorator="['describe', {
          rules: [
            { required: false }
          ]
        }]"
      >
        <a-textarea placeholder="请输入描述" rows="4"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: 'DefineEvent',
    components: {
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineEvent' })
      }
    },
    methods: {
      handleChangeType () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
