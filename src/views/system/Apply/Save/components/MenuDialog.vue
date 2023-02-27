<template>
    <a-modal
        v-model:visible="dialog.visible"
        title="集成菜单"
        width="600px"
        @ok="dialog.handleOk"
        class="edit-dialog-container"
        :confirmLoading="dialog.loading"
        cancelText="取消"
        okText="确定"
    >
    
    
    
    </a-modal>
</template>

<script setup lang="ts">


const emits = defineEmits(['confirm']);
// 弹窗相关
const dialog = reactive({
    visible: false,
    loading: false,

    handleOk: () => {
        emits('confirm');
    },
    /**
     * 设置表单类型
     * @param type 弹窗类型
     * @param defaultForm 表单回显对象
     */
    changeVisible: () => {
        dialog.visible = true;
    }
});
// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});


</script>

<style scoped>

</style>