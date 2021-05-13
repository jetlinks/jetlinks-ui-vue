<template>
  <div id="components-form-demo-vuex">
    <a-form :form="form">
      <a-form-item label="属性标识">
        <a-input
          placeholder="请输入属性标识"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入属性标识' },
              { max: 64, message: '属性标识不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '属性标识只能由数字、字母、下划线、中划线组成' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="属性名称">
        <a-input
          placeholder="请输入属性标识"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入属性名称' },
              { max: 200, message: '属性名称不超过200个字符' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="产品名称">
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, message: '请输入产品名称' },
                { max: 200, message: '产品名称不超过200个字符' }
              ]
            },
          ]"
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
              Jack
            </a-select-option>
            <a-select-option value="lucy">
              Lucy
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
          <a-radio :value="1">
            是
          </a-radio>
          <a-radio :value="2">
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
    name: 'DefineAttribute',
    props: {
      form: {
        type: Object,
        required: true
      }
    },
    methods: {
      handleChangeType () {
      }
    }
  }
</script>

<style lang="less" scoped>
#components-form-demo-vuex .language-bash {
  max-width: 400px;
  border-radius: 15px;
  margin-top: 24px;
}
</style>
