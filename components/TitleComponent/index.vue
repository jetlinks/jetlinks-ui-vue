<template>
    <div class="title" :style="style">
        <div class="title-content">{{ data }}</div>
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
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;

    .title-content {
        position: relative;
        padding-left: 10px;
        color: rgba(0, 0, 0, 0.8);
        font-weight: 600;
        line-height: 1;

        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background-color: #1890ff;
            border-radius: 0 3px 3px 0;
            content: ' ';
        }
    }
}
</style>
