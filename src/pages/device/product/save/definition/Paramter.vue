<template>
  <a-form :form="form">
    <a-form-item label="参数标识">
      <a-input
        placeholder="请输入参数标识"
      />
    </a-form-item>
    <a-form-item label="参数名称">
      <a-input
        placeholder="请输入参数名称"
      />
    </a-form-item>
    <a-form-item
      label="数据类型"
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
</template>

<script>
  export default {
    name: 'DefineParamter',
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineParamter' })
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
