<template>
    <a-modal
        class="edit-permission-dialog-container"
        title="编辑"
        width="500px"
        @ok="dialog.handleOk"
        :confirmLoading="dialog.loading.value"
        cancelText="取消"
        okText="确定"
        v-model:visible="dialog.visible.value"
    >
        <div>
            <span>资产权限：</span>
            <a-checkbox-group
                v-model:value="form.permission"
                :options="options"
            />
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { dictType, optionsType } from '../typing.d.ts';
import { updatePermission_api } from '@/api/system/department';
import { message } from 'ant-design-vue';

const emits = defineEmits(['confirm']);
const props = defineProps<{
    parentId: string;
    allPermission: dictType;
    assetType: 'product' | 'device';
}>();
// 弹窗相关
const dialog = {
    loading: ref<boolean>(false),
    visible: ref<boolean>(false),
    handleOk: () => {
        dialog.loading.value = true;
        updatePermission_api(props.assetType, props.parentId, form)
            .then(() => {
                message.success('操作成功');
                emits('confirm');
                dialog.visible.value = false;
            })
            .finally(() => (dialog.loading.value = false));
    },
    // 控制弹窗的打开与关闭
    changeVisible: (ids: string[], permissionList: string[]) => {
        console.log(ids, permissionList);
        form.permission = [...permissionList];
        form.assetIdList = ids;
        options.value = setOptions(permissionList);
        dialog.visible.value = !dialog.visible.value;
    },
};
const form = reactive({
    assetIdList: [] as string[],
    permission: [] as string[],
});
const options = ref<optionsType>([]);
const setOptions = (havePermission: string[]): optionsType => {
    const result: optionsType = [];
    props.allPermission.forEach((item) => {
        if (havePermission.includes(item.id))
            result.push({
                label: item.name,
                value: item.id,
                disabled: item.id === 'read',
            });
    });
    return result;
};

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style scoped></style>
