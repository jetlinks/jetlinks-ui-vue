<template>
  <a-drawer
    :visible="visible"
    :width="width"
    :title="`${ data.id ? '编辑' : '新建'}网络组件`"
    @close="onClose"
  >
    <a-form
      :labelCol="{ span: 4 }"
      :wrapperCol="{ span: 20 }"
    >

      <a-form-item key="name" label="组件名称" >
        <a-input
          :value="data.name ? data.name: ''"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入组件名称' }
            ],
          }]"
          placeholder="组件名称"
        />
      </a-form-item>
      <a-form-item key="type" label="组件类型" >
        <a-select
          :value="data.type ? data.type: ''"
          v-decorator="['type', {
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
      <template v-if="1">
        <a-form-item label="clientId">
          <a-input
            :value="data.name ? data.name: ''"
            v-decorator="['configuration.clientId', {
              rules: [
              ],
            }]"
          />
        </a-form-item>
        <a-form-item label="HOST">
          <a-input
            :value="data.configuration &&data.configuration.host ? data.configuration.host || '0.0.0.0':''"
            v-decorator="['configuration.host']"
          />
        </a-form-item>
        <a-form-item label="PORT">
          <a-input
            :value="data.configuration &&data.configuration.port ? data.configuration.port: ''"
            v-decorator="['configuration.port']"
          />
        </a-form-item>
        <a-form-item label="TLS">
          <a-radio-group
            :value="data.configuration &&data.configuration.ssl ? data.configuration.ssl: ''"
            v-decorator="['configuration.ssl']"
          >
            <a-radio value>是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="证书" >
          <a-select
            :value="data.type ? data.type: ''"
            v-decorator="['configuration.certId']"
          >
            <a-select-option v-for="(item, index) in selectOptions" :key="item.id+index" :value="item.id">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            :value="data.configuration &&data.configuration.username ? data.configuration.username: ''"
            v-decorator="['configuration.port']"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            :value="data.configuration && data.configuration.password ? data.configuration.password: ''"
            v-decorator="['configuration.password']"
          />
        </a-form-item>
        <a-form-item label="最大消息长度">
          <a-input-number
            :style="{ width: '100%' }"
            :value="data.configuration &&data.configuration.maxMessageSize ? data.configuration.maxMessageSize: '8096'"
            v-decorator="['configuration.maxMessageSize']"
          />
        </a-form-item>
      </template>

      <a-form-item key="describe" label="描述">
        <a-textarea
          :rows="3"
        />
      </a-form-item>
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
        保存
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
  export default {
    name: 'TypeSaveModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number || String,
        default: 900
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
      onClose (e) {
        this.$emit('onClose', 123)
      },
      getAccessToken () {
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
