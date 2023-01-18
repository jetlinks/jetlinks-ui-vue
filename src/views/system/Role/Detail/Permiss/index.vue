<template>
    <div class="role-permiss-container">
        <a-card>
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
                        allow-clear
                        :maxlength="64"
                    />
                </a-form-item>
                <a-form-item name="name" label="说明">
                    <a-textarea
                        v-model:value="form.data.description"
                        placeholder="请输入说明"
                        allow-clear
                        :maxlength="200"
                    />
                </a-form-item>
            </a-form>
        </a-card>

        <a-card>
            <h5>权限分配</h5>
            <PermissTree />

            <a-button type="primary" :disabled="form.loading" @click="form.clickSave">保存</a-button>
        </a-card>
    </div>
</template>

<script setup lang="ts" name="RolePermiss">
import { FormInstance } from 'ant-design-vue';
import PermissTree from '../components/PermissTree.vue'

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {
        name: '',
        description: '',
    },
    getForm: ()=>{},
    clickSave: ()=>{}
});
</script>

<style lang="less" scoped></style>
