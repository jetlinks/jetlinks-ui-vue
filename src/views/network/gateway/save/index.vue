<template>
  <a-modal
    :visible="visible"
    :title="`${ data.id ? '编辑' : '新建'}网关`"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="width"
  >
    <a-form
      :labelCol="{ span: 5 }"
      :wrapperCol="{ span: 19 }"
    >
      <a-form-item key="name" label="名称" >
        <a-input
          :value="data.name ? data.name: ''"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入组件名称' }
            ],
          }]"
        />
      </a-form-item>
      <a-form-item key="provider" label="类型" >
        <a-select
          :value="data.provider ? data.provider: ''"
          v-decorator="['provider', {
            rules: [
              { required: true, message: '请选择组件类型' }
            ],
          }]"
          placeholder="请选择组件类型"
        >
          <a-select-option v-for="(item, index) in selectOptions" :key="item.id+index" :value="item.id">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item key="networkId" label="网络组件" >
        <a-select
          :value="data.networkId ? data.networkId: ''"
          v-decorator="['networkId', {
            rules: [
              { required: true, message: '请选择组件类型' }
            ],
          }]"
        >
          <a-select-option v-for="(item, index) in selectOptions" :key="item.id+index" :value="item.id">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item key="description" label="其它" >
        <a-textarea
          v-decorator="['description', {
            rules: [
              { required: true }
            ],
          }]"
          :rows="3"
          placeholder="缺少数据格式判断的组件占位"
        />
      </a-form-item>
      <a-form-item key="description" label="描述" >
        <a-textarea
          v-decorator="['description', {
            rules: [
              { required: true }
            ],
          }]"
          :rows="3"
          placeholder="从MQTT服务订阅Topic.多个使用,分割"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    name: 'GeteWaySaveModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 800
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        selectOptions: [
          { id: 'PFX', text: 'PFX' },
          { id: 'JKS', text: 'JKS' },
          { id: 'PEM', text: 'PEM' }
        ]
      }
    },
    methods: {
      handleOk (e) {
        this.$emit('submitData', 123)
      },
      handleCancel (e) {
        this.$emit('close')
      },
      getAccessToken () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
