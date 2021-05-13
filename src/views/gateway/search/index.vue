<template>
  <a-form
    :labelCol="{
      xs: { span: 24 },
      sm: { span: 7 },
    }"
    :wrapperCol=" {
      xs: { span: 24 },
      sm: { span: 17 },
    }"
  >
    <a-row :gutter="{ md: 8, lg: 24, xl: 48 }">
      <a-col v-for="(item) in options" :md="8" :sm="24" :key="item.key">
        <a-form-item
          :label="item.label"
        >
          <a-input
            placeholder="请输入"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :push="16 - (Number(16) % 24)" :md="8" :sm="24">
        <div :style="{ float: 'right', marginBottom: 24 }">
          <a-button type="primary">
            查询
          </a-button>
          <a-button style="{ marginLeft: 8 }">
            重置
          </a-button>
        </div>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  export default {
    name: 'GatewaySearch',
    data () {
      return {
        options: [{
          label: '设备ID',
          key: 'id$LIKE'
        }, {
          label: '设备名称',
          key: 'name$LIKE'
        }]
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
