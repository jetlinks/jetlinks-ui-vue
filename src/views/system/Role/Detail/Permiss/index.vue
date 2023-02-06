<template>
    <div class="role-permiss-container">
        <a-card style="max-width: 60%">
            <h5>基本信息</h5>
            <a-form ref="formRef" :model="form.data" layout="vertical">
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
        const updateTree = updatePrimissTree_api(roleId, { menu: form.menus });

        Promise.all([updateRole, updateTree]).then((resp) => {
            message.success('操作成功');
            router.push('/system/Role');
        });
    },
});

form.getForm();
</script>

<style lang="less" scoped></style>
