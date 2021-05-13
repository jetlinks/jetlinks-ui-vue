<template>
  <div>
    <a-form :form="form">
      <a-form-item label="标签标识">
        <a-input
          placeholder="请输入标签标识"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入标签标识' },
              { max: 64, message: '标签标识不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '标签标识只能由数字、字母、下划线、中划线组成' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="标签名称">
        <a-input
          placeholder="请输入标签名称"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入标签名称' },
              { max: 200, message: '标签名称不超过200个字符' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item
        label="数据类型"
        v-decorator="['valueType.type', {
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
      <a-form-item label="是否只读">
        <a-radio-group
          v-decorator="[
            'expands.readOnly',
            {
              rules: [
                { required: true },
              ]
            },
          ]"
        >
          <a-radio :value="true">
            是
          </a-radio>
          <a-radio :value="false">
            否
          </a-radio>
        </a-radio-group>
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
    name: 'DefineTags',
    components: {
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineTags' })
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
