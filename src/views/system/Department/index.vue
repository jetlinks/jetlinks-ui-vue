<template>
  <j-page-container>
    <FullPage>
      <div class="department-container">
        <div class="left">
          <LeftTree @change="onChange" />
        </div>
        <div class="right">
          <User :parentId="departmentId" />
        </div>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts" name="Department">
import LeftTree from './components/LeftTree.vue'
import User from './user/index.vue'

const departmentId = ref<string>('')

const onChange = (id: string) => {
  departmentId.value = id
}
</script>

<style lang="less" scoped>
.department-container {
  display: flex;
  background-color: #fff;
  padding: 24px;
  height: 100%;

  .left {
    border-right: 1px solid #f0f0f0;
    padding-right: 24px;
    flex:1;
    height:100%
  }

  .right {
    flex:4;
    height:100%
  }
}
</style>
