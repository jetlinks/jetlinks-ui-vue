<template>
    <span class="status-label-container">
        <i class="circle" :style="{ background: bjColor }"></i>
        <span>{{ props.statusLabel }}</span>
    </span>
</template>

<script setup lang="ts">
const props = defineProps<{
    statusValue: string;
    statusLabel: string;
}>();

const bjColor = computed(() => {
    switch (props.statusValue) {
        case 'online':
            return '#52c41a';
        case 'offline':
            return '#ff4d4f';
        case 'notActive':
            return '#1890ff';
    }
});
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
