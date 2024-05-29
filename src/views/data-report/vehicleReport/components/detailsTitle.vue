<template>
    <div class="table-title">{{ title }}</div>
    <slot></slot>
</template>

<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: '',
        required: true,
    },
});
</script>
<style lang="less" scoped>
.table-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
    color: #191c27;
}
</style>
