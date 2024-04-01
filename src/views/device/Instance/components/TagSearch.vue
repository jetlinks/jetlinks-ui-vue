<template>
  <j-input @click="show" v-model="searchValue">

  </j-input>
  <j-modal v-if="showTagSearch" title="筛选条件" visible>
    <j-form layout="vertical">
      <j-form-item label="设备标签:">
        <j-row>
          <j-col :span=12>
            <j-input placeholder="请输入标签key"></j-input>
          </j-col>
          <j-col :span=12>
            <j-input placeholder="请输入标签value"></j-input>
          </j-col>
        </j-row>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script lang="ts" setup>
const showTagSearch = ref(false)
const searchValue = ref('')
const show = () =>{
   showTagSearch.value = true
}
</script>
<style lang="less" scoped>
</style>