<template>
  <div class="role-permiss-container">
    <section class="card">
      <h5>权限分配</h5>
      <PermissionTree v-model:select-items="menus" />

      <a-button
        type="primary"
        :confirm-loading="loading"
        @click="clickSave"
        style="margin-top: 24px"
        >保存</a-button
      >
    </section>
  </div>
</template>

<script setup lang="ts" name="RolePermiss">
import PermissionTree from '../components/PermissionTree.vue'
// import { USER_CENTER_MENU_DATA } from '@/views/init-home/data/baseMenu'
import { updatePermissionTree_api } from '@/api/system/role'
import { onlyMessage } from '@jetlinks-web/utils'

const route = useRoute()
const roleId = route.params.id as string
const loading = ref(false)
const menus = ref([]) // USER_CENTER_MENU_DATA
const clickSave = () => {
  updatePermissionTree_api(roleId, {
    menus: menus.value,
  }).then((res:any)=>{
    if(res.status === 200){
        onlyMessage('操作成功')
    }
  })
}

</script>

<style lang="less" scoped>
.role-permiss-container {
  .card {
    margin-bottom: 24px;
    background-color: #fff;
    padding: 24px;

    h5 {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 4px 0 4px 12px;
      font-weight: bold;
      font-size: 16px;

      &::before {
        position: absolute;
        top: 5px px;
        left: 0;
        width: 4px;
        height: calc(100% - 10px);
        background-color: #1d39c4;
        border-radius: 2px;
        content: ' ';
      }
    }

    .basic-form {
      :deep(.ant-form-item-required) {
        padding-right: 12px;

        &::before {
          right: 0;
        }
      }
      .ant-form-item {
        display: block;
        width: 60%;
      }
    }
  }
}
</style>
