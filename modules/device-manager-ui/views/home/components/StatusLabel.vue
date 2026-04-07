<template>
    <!-- <span class="status-label-container">
        <i class="circle" :style="{ background: bjColor }"></i>
        <span>{{ props.statusLabel }}</span>
    </span> -->
    <a-badge :text="statusLabel" :status="status" />
</template>

<script setup lang="ts">
const props = defineProps<{
    statusValue: string;
    statusLabel: string;
}>();

const status = computed(() => {
    switch (props.statusValue) {
        case 'online':
            return 'processing';
        case 'offline':
            return 'error';
        case 'notActive':
            return 'warning';
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
