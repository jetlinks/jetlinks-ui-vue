<template>
    <div class="role-permiss-container">
        <section class="card">
            <h5>基本信息</h5>
            <j-form
                ref="formRef"
                class="basic-form"
                :model="form.data"
                layout="vertical"
            >
                <j-form-item
                    name="name"
                    label="名称"
                    :rules="[
                        { required: true, message: '请输入名称' },
                        { max: 64, message: '最多可输入64个字符' },
                    ]"
                >
                    <j-input
                        v-model:value="form.data.name"
                        placeholder="请输入角色名称"
                    />
                </j-form-item>
                <j-form-item label="说明">
                    <j-textarea
                        v-model:value="form.data.description"
                        placeholder="请输入说明"
                        :maxlength="200"
                        show-count
                    />
                </j-form-item>
            </j-form>
        </section>

        <section class="card">
            <h5>权限分配</h5>
            <PermissTree v-model:select-items="form.menus" />

            <j-button
                type="primary"
                :disabled="form.loading"
                @click="form.clickSave"
                style="margin-top: 24px"
                >保存</j-button
            >
        </section>
    </div>
</template>

<script setup lang="ts" name="RolePermiss">
import { FormInstance, message } from 'ant-design-vue';
import PermissTree from '../components/PermissTree.vue';
import { useMenuStore } from '@/store/menu';
import { USER_CENTER_MENU_DATA } from '@/views/init-home/data/baseMenu'

import {
    getRoleDetails_api,
    updateRole_api,
    updatePrimissTree_api,
} from '@/api/system/role';

const { jumpPage } = useMenuStore();
const route = useRoute();
const router = useRouter();
const roleId = route.params.id as string;

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {
        name: '',
        description: '',
    },
    menus: [USER_CENTER_MENU_DATA],
    getForm: () => {
        getRoleDetails_api(roleId).then((resp) => {
            if (resp.status) {
                form.data = resp.result;
            }
        });
    },
    clickSave: () => {
        formRef.value?.validate().then(() => {
            const updateRole = updateRole_api(form.data);
            const updateTree = updatePrimissTree_api(roleId, {
                menus: form.menus,
            });
            // console.log(form.menus);
            Promise.all([updateRole, updateTree]).then((resp) => {
                message.success('操作成功');
                // jumpPage(`system/Role`);
            });
        });
    },
});

form.getForm();
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
