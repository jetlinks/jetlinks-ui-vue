<template>
    <a-modal
        v-model:visible="dialog.visible"
        :title="dialog.title"
        width="520px"
        @ok="dialog.handleOk"
        class="edit-dialog-container"
        cancelText="取消"
        okText="确定"
        :confirmLoading="form.loading"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <a-form-item name="parentId" label="上级组织">
                <a-tree-select
                    v-model:value="form.data.parentId"
                    style="width: 100%"
                    placeholder="请选择上级组织"
                    :tree-data="props.treeData"
                    :field-names="{ value: 'id' }"
                >
                    <template #title="{ name }"> {{ name }} </template>
                </a-tree-select>
            </a-form-item>
            <a-form-item
                name="name"
                label="名称"
                :rules="[
                    { required: true, message: '请输入名称' },
                    { max: 64, message: '最多可输入64个字符' },
                ]"
            >
                <a-input
                    v-model:value="form.data.name"
                    placeholder="请输入名称"
                />
            </a-form-item>

            <a-form-item
                name="sortIndex"
                label="排序"
                :rules="[{ required: true, message: '请输入排序' }]"
            >
                <a-input
                    v-model:value="form.data.sortIndex"
                    placeholder="请输入排序"
                    :maxlength="64"
                    @blur="form.checkSort"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import {cloneDeep} from 'lodash-es'
import {
    addDepartment_api,
    updateDepartment_api,
} from '@/api/system/department';

const emits = defineEmits(['refresh']);
const props = defineProps<{
    treeData: any[];
}>();
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
    changeVisible: (status: boolean, row: any = {}) => {
        if (row.id) {
            dialog.title = '编辑';
            form.data = cloneDeep(row);
        } else if (row.parentId) {
            dialog.title = '新增子组织';
            form.data = {
                name: '',
                sortIndex: ((row.children && row.children.length) || 0) + 1,
                parentId: row.parentId,
            };
        } else {
            dialog.title = '新增';
            form.data = {
                name: '',
                sortIndex: props.treeData.length + 1,
            };
        }
        form.beforeSortIndex = form.data.sortIndex;
        dialog.visible = status;
        nextTick(() => {
            formRef.value?.clearValidate();
        });
    },
});
// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {} as formType,
    beforeSortIndex: '' as string | number,

    checkSort: (e: any) => {
        const value = e.target.value.match(/^[0-9]*/)[0];
        if (value) {
            form.data.sortIndex = value;
            form.beforeSortIndex = value;
        } else form.data.sortIndex = form.beforeSortIndex;
    },

    submit: () => {
        form.loading = true;
        const api = form.data.id ? updateDepartment_api : addDepartment_api;
        api(form.data)
            .then((resp:any) => {
                emits('refresh',resp.result.id);
                dialog.changeVisible(false);
            })
            .finally(() => (form.loading = false));
    },
});

type formType = {
    id?: string;
    parentId?: string;
    name: string;
    sortIndex: string | number;
};

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style scoped></style>
