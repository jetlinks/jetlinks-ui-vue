<template>
    <a-modal
        visible
        title="编辑"
        @ok="handleOk"
        width="770px"
        @cancel="emits('close')"
        :confirmLoading="loading"
        :zIndex="1100"
        :maskClosable='false'
    >
        <a-form :model="form" layout="vertical" ref="formRef">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        label="姓名"
                        name="name"
                        :rules="[
                            { required: true, message: '姓名必填' },
                            { max: 64, message: '最多可输入64个字符' },
                        ]"
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
                            placeholder="请选择角色"
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
                            placeholder="请选择组织"
                            disabled
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        label="手机号"
                        name="telephone"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: '请输入正确的手机号',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.telephone"
                            placeholder="请输入手机号"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        label="邮箱"
                        name="email"
                        :rules="[
                            {
                                type: 'email',
                                message: '邮箱不是一个有效的email',
                            },
                        ]"
                    >
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
import { onlyMessage  } from "@jetlinks-web/utils";
import { cloneDeep } from 'lodash-es';

const emits = defineEmits(['save', 'close']);
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const loading = ref(false);
const form = ref<any>(cloneDeep(props.data));
const formRef = ref<any>();


const handleOk = () => {
    formRef.value?.validate().then(() => {
        loading.value = true;
        updateMeInfo_api(form.value)
            .then((resp) => {
                if (resp.status === 200) {
                    onlyMessage('保存成功', 'success');
                    emits('save', form.value);
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped></style>
