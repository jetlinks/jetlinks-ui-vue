<template>
    <div class="role-permiss-container">
        <section class="card">
            <h5>权限分配</h5>
            <PermissTree v-model:select-items="form.menus" />
            <j-button
                type="primary"
                :confirm-loading="form.loading"
                @click="form.clickSave"
                style="margin-top: 24px"
                >保存</j-button
            >
        </section>
    </div>
</template>

<script setup lang="ts" name="RolePermiss">
import { FormInstance } from 'ant-design-vue';
import PermissTree from '../components/PermissTree.vue';
import { useMenuStore } from '@/store/menu';
// import { USER_CENTER_MENU_DATA } from '@/views/init-home/data/baseMenu'

import {
  getRoleDetails_api,
  updateRole_api,
  editRole_api,
  updatePrimissTree_api, clearPrimissTree_api,
} from '@/api/system/role';
import { onlyMessage } from '@/utils/comm';

const { jumpPage } = useMenuStore();
const route = useRoute();
const roleId = route.params.id as string;

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    // data: {
    //     name: '',
    //     description: '',
    // },
    menus: [], // USER_CENTER_MENU_DATA
    // getForm: () => {
    //     getRoleDetails_api(roleId).then((resp) => {
    //         if (resp.status) {
    //             form.data = resp.result;
    //         }
    //     });
    // },
    clickSave: () => {
        // formRef.value?.validate().then(() => {
            // const updateRole = editRole_api(roleId, form.data);
          if(form.menus?.length > 0){
            const updateTree = updatePrimissTree_api(roleId, {
              menus: form.menus,
            });
            Promise.all([ updateTree]).then((resp) => {
              onlyMessage('操作成功');
              // jumpPage(`system/Role`);
            })
          } else {
            clearPrimissTree_api(roleId).then(resp => {
              if(resp.success){
                onlyMessage('操作成功');
              }
            })
          }
        // });
    },
});

// form.getForm();
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
                top: 5px;
                left: 0;
                width: 4px;
                height: calc(100% - 10px);
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
