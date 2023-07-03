<template>
    <j-modal
        visible
        title="编辑"
        @ok="handleOk"
        width="770px"
        @cancel="emits('close')"
        :confirmLoading="loading"
    >
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        label="姓名"
                        name="name"
                        :rules="[
                            { required: true, message: '姓名必填' },
                            { max: 64, message: '最多可输入64个字符' },
                        ]"
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
                    <j-form-item
                        label="手机号"
                        name="telephone"
                        :rules="[
                            {
                                pattern: /^1[3456789]\d{9}$/,
                                message: '请输入正确手机号',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="form.telephone"
                            placeholder="请输入手机号"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        label="邮箱"
                        name="email"
                        :rules="[
                            {
                                type: 'email',
                                message: '邮箱不是一个有效的email',
                            },
                        ]"
                    >
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
import { onlyMessage } from '@/utils/comm';
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
                    emits('save');
                }
            })
            .finally(() => (loading.value = false));
    });
};
</script>

<style scoped></style>
