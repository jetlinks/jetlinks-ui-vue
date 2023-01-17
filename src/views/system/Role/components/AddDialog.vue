<template>
    <a-modal
        v-model:visible="dialog.visible"
        title="新增"
        @ok="dialog.handleOk"
    >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </a-modal>
</template>

<script setup lang="ts">
const emits = defineEmits(['refresh']);
const props = defineProps({
    open: Number,
});

const dialog = reactive({
    visible: false,
    handleOk: () => {
        emits('refresh');
    },
});
</script>

<style scoped></style>
