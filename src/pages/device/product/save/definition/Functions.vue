<template>
  <div>
    <a-form :form="form">
      <a-form-item label="功能标识">
        <a-input
          placeholder="请输入功能标识"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入属性标识' },
              { max: 64, message: '属性标识不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '功能标识只能由数字、字母、下划线、中划线组成' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="功能名称">
        <a-input
          placeholder="请输入功能名称"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入功能名称' },
              { max: 200, message: '功能名称不超过200个字符' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="输入参数">
        <a-button type="link" icon="plus" @click="() => { showParamsDrawer = true }">添加参数</a-button>
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
      <a-form-item label="是否异步">
        <a-radio-group
          v-decorator="[
            'async',
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
    <a-drawer
      title="新增参数"
      width="320"
      :closable="false"
      :visible="showParamsDrawer"
      @close="onChildrenDrawerClose"
    >
      <define-paramter></define-paramter>
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
          保存
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import DefineParamter from './Paramter'
  export default {
    name: 'DefineFunction',
    components: {
      DefineParamter
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineFunction' }),
        showParamsDrawer: false
      }
    },
    methods: {
      onChildrenDrawerClose () {
        this.showParamsDrawer = false
      },
      handleChangeType () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
