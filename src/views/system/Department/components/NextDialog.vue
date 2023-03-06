<template>
    <j-modal
        visible
        title="绑定"
        width="520px"
        @ok="handleOk"
        class="edit-dialog-container"
        @cancel="emits('update:visible',false)"
    >
        是否继续分配产品下的具体设备
    </j-modal>
</template>

<script setup lang="ts">
const emits = defineEmits(['confirm','update:visible']);

const props = defineProps<{
    visible: boolean;
}>();
const handleOk = () => {
    emits('confirm');
    emits('update:visible',false)
};
</script>

<style scoped></style>
