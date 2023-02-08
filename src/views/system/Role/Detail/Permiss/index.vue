<template>
    <div class="role-permiss-container">
        <a-card>
            <h5>基本信息</h5>
            <a-form ref="formRef" class="basic-form" :model="form.data" layout="vertical">
                <a-form-item
                    name="name"
                    label="名称"
                    :rules="[{ required: true, message: '请输入名称' }]"
                >
                    <a-input
                        v-model:value="form.data.name"
                        placeholder="请输入角色名称"
                        :maxlength="64"
                    />
                </a-form-item>
                <a-form-item name="name" label="说明">
                    <a-textarea
                        v-model:value="form.data.description"
                        placeholder="请输入说明"
                        :maxlength="200"
                        show-count
                    />
                </a-form-item>
            </a-form>
        </a-card>

        <a-card>
            <h5>权限分配</h5>
            <PermissTree v-model:select-items="form.menus" />

            <a-button
                type="primary"
                :disabled="form.loading"
                @click="form.clickSave"
                style="margin-top: 24px;"
                >保存</a-button
            >
        </a-card>
    </div>
</template>

<script setup lang="ts" name="RolePermiss">
import { FormInstance, message } from 'ant-design-vue';
import PermissTree from '../components/PermissTree.vue';

import {
    getRoleDetails_api,
    updateRole_api,
    updatePrimissTree_api,
} from '@/api/system/role';

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
    menus: [],
    getForm: () => {
        getRoleDetails_api(roleId).then((resp) => {
            if (resp.status) {
                form.data = resp.result;
            }
        });
    },
    clickSave: () => {
        const updateRole = updateRole_api(form.data);
        const updateTree = updatePrimissTree_api(roleId, { menus: form.menus });

        Promise.all([updateRole, updateTree]).then((resp) => {
            message.success('操作成功');
            router.push('/system/Role');
        });
    },
});

form.getForm();
</script>

<style lang="less" scoped>
.role-permiss-container {
    .ant-card {
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
            .ant-form-item {
                display: block;
                width: 60%;
            }
        }
    }
}
</style>
