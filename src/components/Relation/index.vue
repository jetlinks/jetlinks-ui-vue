<template>
  <j-drawer :visible="true" title="关系绑定" placement="right" @close="closeDrawer" :width="500">
    <j-tabs v-model:activeKey="activeKey" type="card">
      <j-tab-pane v-for="(item,index) in relationOptions" :key="item.value" :tab="item.text">
        
      </j-tab-pane>
    </j-tabs>
  </j-drawer>
</template>

<script lang="ts" setup>
const activeKey = ref('user')
const relationOptions = [{
  text:'用户',
  value:'user'
},{
  text:'产品',
  value:'product'
},{
  text:'设备',
  value:'device'
},{
  text: '组织',
  value:'organization'
},{
  text:'角色',
  value:'role'
}]
const closeDrawer = () =>{

}
</script>
<style lang="less" scoped>
</style>