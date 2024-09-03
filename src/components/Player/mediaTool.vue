<!-- 视频播放工具栏 -->
<template>
    <div class="live-player-tools">
        <div class="direction">
            <div
                class="direction-item up"
                @mousedown="emit('onMouseDown', 'UP')"
                @mouseup="emit('onMouseUp', 'UP')"
            >
                <div class="direction-icon">
                    <AIcon type="CaretUpOutlined" />
                </div>
            </div>
            <div
                class="direction-item right"
                @mousedown="emit('onMouseDown', 'RIGHT')"
                @mouseup="emit('onMouseUp', 'RIGHT')"
            >
                <div class="direction-icon">
                    <AIcon type="CaretRightOutlined" />
                </div>
            </div>
            <div
                class="direction-item left"
                @mousedown="emit('onMouseDown', 'LEFT')"
                @mouseup="emit('onMouseUp', 'LEFT')"
            >
                <div class="direction-icon">
                    <AIcon type="CaretLeftOutlined" />
                </div>
            </div>
            <div
                class="direction-item down"
                @mousedown="emit('onMouseDown', 'DOWN')"
                @mouseup="emit('onMouseUp', 'DOWN')"
            >
                <div class="direction-icon">
                    <AIcon type="CaretDownOutlined" />
                </div>
            </div>
            <div class="direction-audio">
                <slot name="center"><!-- <AIcon type="AudioOutlined" /> --></slot>
            </div>
        </div>
        <div class="zoom">
            <div
                class="zoom-item zoom-in"
                @mousedown="emit('onMouseDown', 'ZOOM_IN')"
                @mouseup="emit('onMouseUp', 'ZOOM_IN')"
            >
                <AIcon type="PlusOutlined" />
            </div>
            <div
                class="zoom-item zoom-out"
                @mousedown="emit('onMouseDown', 'ZOOM_OUT')"
                @mouseup="emit('onMouseUp', 'ZOOM_OUT')"
            >
                <AIcon type="MinusOutlined" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
type Emits = {
    (e: 'onMouseDown', type: string): void;
    (e: 'onMouseUp', type: string): void;
};
const emit = defineEmits<Emits>();
</script>

<style lang="less" scoped>
@import './mediaTool.less';
</style>
