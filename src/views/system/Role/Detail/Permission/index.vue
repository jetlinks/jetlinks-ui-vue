<template>
  <div class="role-permiss-container">
    <div class="card">
      <div>
        <TitleComponent :data="$t('Permission.index.071527-0')" />
      </div>
      <PermissionTree v-model:select-items="menus" />
      <div class="bottom">
        <a-button
            type="primary"
            :confirm-loading="loading"
            @click="clickSave"
            style="margin-top: 24px"
        >{{ $t('Permission.index.071527-1') }}</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="RolePermission">
import PermissionTree from '../components/PermissionTree.vue'
import { updatePermissionTree_api } from '@/api/system/role'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute()
const roleId = route.params.id as string
const loading = ref(false)
const menus = ref([]) // USER_CENTER_MENU_DATA
const clickSave = () => {
  updatePermissionTree_api(roleId, {
    menus: menus.value,
  }).then((res:any)=>{
    if(res.status === 200){
        onlyMessage($t('Permission.index.071527-2'))
    }
  })
}

</script>

<style lang="less" scoped>
.role-permiss-container {
  .card {
    margin-bottom: 24px;

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
        top: 7px;
        left: 0;
        width: 4px;
        height: calc(100% - 14px);
        background-color: @primary-color;
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
