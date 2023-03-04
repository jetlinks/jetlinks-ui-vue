<template>
    <j-modal
        visible
        :title="title"
        width="520px"
        @cancel="emits('update:visible',false)"
        @ok="confirm"
        class="edit-dialog-container"
        cancelText="取消"
        okText="确定"
        :confirmLoading="loading"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-form-item name="parentId" label="上级组织">
                <a-tree-select
                    v-model:value="form.data.parentId"
                    style="width: 100%"
                    placeholder="请选择上级组织"
                    :tree-data="props.treeData"
                    :field-names="{ value: 'id' }"
                >
                    <template #title="{ name }"> {{ name }} </template>
                </a-tree-select>
            </j-form-item>
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
                    placeholder="请输入名称"
                />
            </j-form-item>

            <j-form-item
                name="sortIndex"
                label="排序"
                :rules="[{ required: true, message: '请输入排序' }]"
            >
                <j-input
                    v-model:value="form.data.sortIndex"
                    placeholder="请输入排序"
                    :maxlength="64"
                    @blur="form.checkSort"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import {
    addDepartment_api,
    updateDepartment_api,
} from '@/api/system/department';

const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps<{
    treeData: any[];
    data: any;
    visible: boolean;
}>();
// 弹窗相关
const title = ref('');
const loading = ref(false);
const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => form.submit())
        .then((resp: any) => {
            emits('refresh', resp.result.id);
            emits('update:visible', false);
        })
        .finally(() => (loading.value = false));
};
// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    data: {} as formType,
    beforeSortIndex: '' as string | number,

    init: () => {
        if (props.data.id) {
            title.value = '编辑';
            form.data = cloneDeep(props.data);
        } else if (props.data.parentId) {
            title.value = '新增子组织';
            form.data = {
                name: '',
                sortIndex: props.data.sortIndex,
                parentId: props.data.parentId,
            };
        } else {
            title.value = '新增';
            form.data = {
                name: '',
                sortIndex: props.data.sortIndex,
            };
        }
        form.beforeSortIndex = form.data.sortIndex;
        nextTick(() => {
            formRef.value?.clearValidate();
        });
    },
    checkSort: (e: any) => {
        const value = e.target.value.match(/^[0-9]*/)[0];
        if (value) {
            form.data.sortIndex = value;
            form.beforeSortIndex = value;
        } else form.data.sortIndex = form.beforeSortIndex;
    },

    submit: () => {
        const api = form.data.id ? updateDepartment_api : addDepartment_api;
        return api(form.data);
    },
});
form.init();

type formType = {
    id?: string;
    parentId?: string;
    name: string;
    sortIndex: string | number;
};
</script>
