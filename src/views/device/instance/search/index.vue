<template>
  <a-form :labelCol="formItemLayout.labelCol" :wrapperCol="formItemLayout.wrapperCol">
    <a-row :gutter="{ md: 8, lg: 24, xl: 48 }">
      <a-col :md="8" :sm="24" key="parameter">
        <a-input-group compact>
          <a-select :style="{ width: '100px' }" placeholder="请选择">
            <a-select-option value="id$like" key="id$like">设备ID</a-select-option>
            <a-select-option value="name$like" key="name$like">设备名称</a-select-option>
            <a-select-option value="orgId$in" key="orgId$in">所属机构</a-select-option>
            <a-select-option value="id$dev-tag" key="id$dev-tag">设备标签</a-select-option>
            <a-select-option value="productId$dev-prod-cat" key="productId$dev-prod-cat">所属品类</a-select-option>
            <a-select-option value="id$dev-bind$any" key="id$dev-bind$any">云对云接入</a-select-option>
          </a-select>
          <a-input placeholder="请输入" :style="{ width: 'calc(100% - 100px)' }" />
        </a-input-group>
      </a-col>
      <div
        :style="{
          float: 'right',
          marginBottom: '24px',
          marginRight: '30px',
          marginTop: '4px'
        }">
        <a-button type="primary" :style="{ marginLeft: '8px' }" >
          查询
        </a-button>
        <a-button :style="{ marginLeft: '8px' }" >
          重置
        </a-button>
      </div>
    </a-row>
  </a-form>
</template>

<script>
  export default {
    name: 'InsSearch',
    data () {
      return {
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 }
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
