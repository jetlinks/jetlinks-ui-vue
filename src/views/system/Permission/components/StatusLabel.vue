<template>
    <span class="status-label-container">
        <i
            class="circle"
            :style="{ background: props.statusValue ? '#52c41a' : '#ff4d4f' }"
        ></i>
        <span>{{ props.statusValue ? '启用' : '禁用' }}</span>
    </span>
</template>

<script setup lang="ts">
const props = defineProps<{
    statusValue: number;
}>();
</script>

<style lang="less" scoped>
.status-label-container {
    display: flex;
    align-items: center;
    .circle {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 8px;
    }
}
</style>
