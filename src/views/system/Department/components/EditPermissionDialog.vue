<template>
    <a-modal
        class="edit-permission-dialog-container"
        title="编辑"
        width="500px"
        @ok="dialog.handleOk"
        cancelText="取消"
        okText="确定"
        v-model:visible="dialog.visible.value"
    >
    </a-modal>
</template>

<script setup lang="ts">
const props = defineProps({
    parentId: String,
});
// 弹窗相关
const dialog = {
    visible: ref<boolean>(false),
    handleOk: () => {
        // formRef.value?.validate().then(() => {
        //     form.submit();
        // });
        dialog.changeVisible()
    },
    // 控制弹窗的打开与关闭
    changeVisible: (ids?:string[], permissionList?:string[]) => {
        console.log(ids, permissionList);
        
        dialog.visible.value = !dialog.visible.value;
    },
};

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style scoped></style>
