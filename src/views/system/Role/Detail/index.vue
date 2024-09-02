<template>
    <j-page-container>
        <FullPage>
          <div class="details-container">
            <a-tabs v-model:activeKey="activeKey" type="card">
              <a-tab-pane key="1" tab="权限分配"><Permission /></a-tab-pane>
              <a-tab-pane key="2" tab="用户管理"><User /></a-tab-pane>
            </a-tabs>
          </div>
        </FullPage>
    </j-page-container>
</template>

<script setup lang="ts" name="RoleDetail">
import Permission from './Permission/index.vue';
import User from './User/index.vue';
import FullPage from "@/layout/FullPage.vue";

const activeKey = ref('1');
</script>

<style lang="less" scoped>
.details-container {
    //:deep(.ant-tabs-nav-wrap) {
    //    background-color: #fff;
    //    padding-left: 24px;
    //}
  padding: 24px;
}
</style>
