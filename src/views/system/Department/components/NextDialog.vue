<template>
    <a-modal
        v-model:visible="visible"
        title="绑定"
        width="520px"
        @ok="handleOk"
        class="edit-dialog-container"
        cancelText="取消"
        okText="确定"
    >
        是否继续分配产品下的具体设备
    </a-modal>
</template>

<script setup lang="ts">
const emits = defineEmits(['confirm']);

const visible = ref<boolean>(false);
const handleOk = () => {
    emits('confirm');
    changeVisible();
};
// 控制弹窗的打开与关闭
const changeVisible = () => {
    visible.value = !visible.value;
};
// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: changeVisible,
});
</script>

<style scoped></style>
