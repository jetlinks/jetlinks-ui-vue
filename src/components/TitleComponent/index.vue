<template>
    <div class="title" :style="style">
        <span class="titleData">{{ data }}</span>
        <slot name="extra"></slot>
    </div>
</template>

<script setup lang="ts" name="TitleComponent">
import type { CSSProperties, PropType } from 'vue';

const props = defineProps({
    data: {
        type: String,
        default: '',
    },
    style: {
        type: Object as PropType<CSSProperties>,
        default: () => ({}),
    },
});
</script>

<style lang="less" scoped>
.title {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    font-size: 16px;
}
.titleData {
    position: relative;
    width: 100%;
    padding-left: 12px;
    &::before {
        position: absolute;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        bottom: 0.5px;
        left: 0;
        width: 4px;
        height: 80%;
        background-color: @primary-color;
        content: '';
    }
}
</style>
