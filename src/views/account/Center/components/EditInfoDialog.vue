<template>
    <j-modal
        visible
        title="编辑"
        @ok="handleOk"
        width="770px"
        @cancel="emits('update:visible', false)"
    >
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        label="姓名"
                        name="name"
                        :rules="[{ required: true, message: '姓名必填' }]"
                    >
                        <j-input
                            v-model:value="form.name"
                            placeholder="请输入姓名"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item label="用户名">
                        <j-input
                            v-model:value="form.username"
                            placeholder="请输入用户名"
                            disabled
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item label="角色">
                        <j-input
                            :value="
                                form.roleList.map((item) => item.name).join(',')
                            "
                            placeholder="请输入角色"
                            disabled
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item label="组织">
                        <j-input
                            :value="
                                form.orgList.map((item) => item.name).join(',')
                            "
                            placeholder="请输入组织"
                            disabled
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item label="手机号">
                        <j-input
                            v-model:value="form.telephone"
                            placeholder="请输入手机号"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item label="邮箱">
                        <j-input
                            v-model:value="form.email"
                            placeholder="请输入邮箱"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { updateMeInfo_api } from '@/api/account/center';
import { message } from 'ant-design-vue';
import { FormInstance } from 'ant-design-vue/es';
import { userInfoType } from '../typing';

const emits = defineEmits(['ok', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    data: userInfoType;
}>();
const form = ref(props.data);
const formRef = ref<FormInstance>();
const handleOk = () => {
    formRef.value?.validate().then(() => {
        updateMeInfo_api(form.value).then((resp) => {
            if (resp.status === 200) {
                message.success('保存成功');
                emits('ok');
                emits('update:visible', false);
            }
        });
    });
};
</script>

<style scoped></style>
