<template>
    <a-modal
        v-model:visible="dialog.visible"
        :title="dialog.title"
        :maskClosable="false"
        width="675px"
        @ok="dialog.handleOk"
        class="edit-dialog-container"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <a-form-item
                label="名称"
                name="name"
                :rules="[
                    { required: true, message: '请输入名称' },
                    { max: 64, message: '最多可输入64个字符' },
                ]"
            >
                <a-input
                    v-model:value="form.data.name"
                    placeholder="请输入名称"
                    :maxlength="64"
                />
            </a-form-item>
            <a-form-item
                name="relation"
                label="标识"
                :rules="[
                    { required: true, message: '请输入标识' },
                    { max: 64, message: '最多可输入64个字符' },
                    { validator: form.rules.checkRelation, trigger: 'change' },
                ]"
            >
                <a-input
                    v-model:value="form.data.relation"
                    placeholder="请输入标识"
                    :maxlength="64"
                    :disabled="!!form.data.id"
                />
            </a-form-item>

            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        name="objectType"
                        label="关联方"
                        :rules="[{ required: true, message: '请选择关联方' }]"
                    >
                        <a-select
                            v-model:value="form.data.objectType"
                            :disabled="!!form.data.id"
                        >
                            <a-select-option
                                v-for="item in form.objectList"
                                :value="item.id"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="targetType"
                        label="标识"
                        :rules="[{ required: true, message: '请选择被关联方' }]"
                    >
                        <a-select
                            v-model:value="form.data.targetType"
                            :disabled="!!form.data.id"
                        >
                            <a-select-option
                                v-for="item in form.targetList"
                                :value="item.id"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item
                name="description"
                label="说明"
                :rules="[{ max: 200, message: '最多可输入200个字符' }]"
            >
                <a-textarea
                    v-model:value="form.data.description"
                    placeholder="请输入说明"
                    show-count
                    :maxlength="200"
                />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button key="back" @click="dialog.visible = false">取消</a-button>
            <a-button
                key="submit"
                type="primary"
                :loading="form.loading"
                @click="dialog.handleOk"
                >确定</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';

import {
    getObjectList_api,
    addRelation_api,
    editRelation_api,
} from '@/api/system/relationship';

const emits = defineEmits(['refresh']);
// 弹窗相关
const dialog = reactive({
    title: '',
    visible: false,
    handleOk: () => {
        formRef.value?.validate().then(() => {
            form.submit();
        });
    },
    // 控制弹窗的打开与关闭
    changeVisible: (status: boolean, defaultForm: formType) => {
        dialog.title = defaultForm.id ? '编辑' : '新增';
        form.data = { ...defaultForm };
        dialog.visible = status;
        nextTick(() => {
            formRef.value?.clearValidate();
        });
    },
});

// 表单相关
const initForm: formType = {
    name: '',
    relation: '',
    objectType: '',
    targetType: '',
    description: '',
};
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {} as formType,
    rules: {
        checkRelation: (_rule: Rule, value: string): any => {
            if (!value) return '';
            const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
            if (reg.test(value)) return Promise.resolve();
            else
                return Promise.reject(
                    '标识只能由数字、字母、下划线、中划线组成',
                );
        },
    },
    objectList: [] as any[],
    targetList: [] as any[],

    getObjectList: () => {
        getObjectList_api().then((resp: any) => {
            form.objectList = resp.result;
        });
    },
    submit: () => {
        formRef.value?.validate().then(() => {
            const params = {
                ...form.data,
                objectTypeName: form.objectList.find(
                    (item) => item.id === form.data.objectType,
                ).name,
                targetTypeName: form.targetList.find(
                    (item) => item.id === form.data.targetType,
                ).name,
            };
            const api =
                dialog.title === '编辑'
                    ? editRelation_api
                    : addRelation_api;
            api(params).then((resp: any) => {
                if (resp.status === 200) {
                    message.success('操作成功');
                    emits('refresh');
                    dialog.visible = false;
                }
            });
        });
    },
});
form.getObjectList();

watch(
    () => form.data.objectType,
    (n) => {
        form.targetList = n === 'device' ? [{ id: 'user', name: '用户' }] : [];
    },
);

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});

type formType = {
    name: string;
    relation: string;
    objectType: string;
    targetType: string;
    description: string;
    id?: string;
};
</script>

<style scoped></style>
