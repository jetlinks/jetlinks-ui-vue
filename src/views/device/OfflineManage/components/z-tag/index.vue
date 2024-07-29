<template>
    <span class="z-tag">
        <slot>{{ 'z-tag' }}</slot>
    </span>
</template>
<script setup lang="ts">
defineOptions({
    name: 'ZTag',
});

const props = defineProps({
    color: {
        type: String,
        default: '#00B87A',
    },
});
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = {
        r: parseInt(result![1], 16),
        g: parseInt(result![2], 16),
        b: parseInt(result![3], 16),
    };
    return '' + rgb.r + ',' + rgb.g + ',' + rgb.b;
};
const color = ref<string>(hexToRgb(props.color));
</script>

<style scoped lang="less">
.z-tag {
    --tag-color: v-bind(color);
    display: inline-flex;
    font-size: 14px;
    line-height: 18px;
    padding: 3px 8px;
    color: rgb(var(--tag-color));

    background-color: rgba(var(--tag-color), 0.05);
    border: 1px solid rgba(var(--tag-color), 0.5);
    border-radius: 3px;
    cursor: pointer;
}
</style>
