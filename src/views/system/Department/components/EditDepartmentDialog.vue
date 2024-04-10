<template>
    <j-modal
        visible
        :title="title"
        :maskClosable="false"
        width="520px"
        @cancel="emits('update:visible', false)"
        @ok="confirm"
        class="edit-dialog-container"
        cancelText="取消"
        okText="确定"
        :confirmLoading="loading"
    >
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-form-item name="parentId" label="上级组织">
                <j-tree-select
                    v-model:value="form.data.parentId"
                    style="width: 100%"
                    placeholder="请选择上级组织"
                    allowClear
                    :tree-data="treeData"
                    :field-names="{ value: 'id' }"
                    @change="handleTreeSelectChange"
                >
                    <template #title="{ name }"> {{ name }} </template>
                </j-tree-select>
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
                <j-input-number
                    style="width: 100%;"
                    v-model:value="form.data.sortIndex"
                    placeholder="请输入排序"
                    :controls="false"
                    :min="0"
                    :max="99999999"
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
import { onlyMessage } from '@/utils/comm'

type treeType = {
    id: string;
    parentId?: string;
    name: string;
    sortIndex: string | number;
    children?: treeType[];
    disabled?: boolean;
};
type formType = {
    id?: string;
    parentId?: string;
    name: string;
    sortIndex: string | number;
};

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
            onlyMessage('操作成功')
            emits('refresh', resp.result.id);
            emits('update:visible', false);
        })
        .finally(() => (loading.value = false));
};

const treeData = computed(() => {
    if (!props.data.id) return props.treeData;
    const result = cloneDeep(props.treeData) as treeType[];
    const me = findItemById(result, props.data.id) as treeType;
    me.disabled = true;
    me.children && me.children.length > 0 && filterTree(me.children);
    return result;
});
/**
 * 在给定的树中通过id匹配
 * @param node
 * @param id
 */
const findItemById = (node: treeType[], id: string): treeType | null => {
    let result = null;
    for (const item of node) {
        if (item.id === id) return item;
        else if (item.children && item.children.length > 0) {
            result = findItemById(item.children, id);
            if (result) return result;
        }
    }
    return null;
};
/**
 * 将此树下的所有节点禁用
 * @param treeNode
 */
const filterTree = (treeNode: treeType[]) => {
    if (treeNode.length < 1) return;
    treeNode.forEach((item) => {
        item.disabled = true;
        item.children && item.children.length > 0 && filterTree(item.children);
    });
};
// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    data: {} as formType,

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
        nextTick(() => {
            formRef.value?.clearValidate();
        });
    },
    submit: () => {
        const api = form.data.id ? updateDepartment_api : addDepartment_api;
        form.data.parentId =  form.data.parentId ? form.data.parentId : '';
        if(form.data.id && form.data?.children){
            delete(form.data.children)
        }
        return api(form.data);
    },
});
form.init();

/**
 * 上级组织选择改变
 */
const handleTreeSelectChange = () => {
    // 上级组织
    const parent = treeData.value.find((f: any) => f.id === form.data.parentId);
    // 当前编辑的组织排序, 为选择上级组织的最大排序+1, 如上级组织没有自组织, 则默认为1
    form.data.sortIndex = parent?.children
        ? parent.children[parent.children.length - 1].sortIndex + 1
        : 1;
};
</script>
