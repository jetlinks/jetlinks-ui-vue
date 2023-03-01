<template>
    <a-modal
        visible
        title="编辑"
        @ok="handleOk"
        width="770px"
        @cancel="emits('update:visible', false)"
    >
        <a-form :model="form" layout="vertical">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        label="姓名"
                        :rules="[{ required: true, message: '姓名必填' }]"
                    >
                        <a-input
                            v-model:value="form.name"
                            placeholder="请输入姓名"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="用户名">
                        <a-input
                            v-model:value="form.username"
                            placeholder="请输入用户名"
                            disabled
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item label="角色">
                        <a-input
                            :value="
                                form.roleList.map((item) => item.name).join(',')
                            "
                            placeholder="请输入角色"
                            disabled
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="组织">
                        <a-input
                            :value="
                                form.orgList.map((item) => item.name).join(',')
                            "
                            placeholder="请输入组织"
                            disabled
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item label="手机号">
                        <a-input
                            v-model:value="form.telephone"
                            placeholder="请输入手机号"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="邮箱">
                        <a-input
                            v-model:value="form.email"
                            placeholder="请输入邮箱"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { updateMeInfo_api } from '@/api/account/center';
import { message } from 'ant-design-vue';
import { userInfoType } from '../typing';

const emits = defineEmits(['ok', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    data: userInfoType;
}>();
const form = ref(props.data);

const handleOk = () => {
    updateMeInfo_api(form.value).then((resp) => {
        if (resp.status === 200) {
            message.success('保存成功');
            emits('ok');
            emits('update:visible', false);
        }
    });
};
</script>

<style scoped></style>
