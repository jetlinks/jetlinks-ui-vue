<template>
    <span class="input-card-container" :class="props.value">
        {{ props.value?.toLocaleUpperCase() }}
    </span>
</template>

<script setup lang="ts">
const props = defineProps({
    value: String,
});
</script>

<style lang="less" scoped>
.input-card-container {
    padding: 4px 15px;
    font-size: 14px;
    color: #fff;

    &.get {
        background-color: #1890ff;
    }
    &.put {
        background-color: #fa8c16;
    }
    &.post {
        background-color: #52c41a;
    }
    &.delete {
        background-color: #f5222d;
    }
    &.patch {
        background-color: #a0d911;
    }
}
</style>
