<!-- 视频播放工具栏 -->
<template>
    <div class="live-player-tools">
        <div class="direction">
            <div
                class="direction-item up"
                @mousedown="emit('onMouseDown', 'UP')"
                @mouseup="emit('onMouseUp', 'UP')"
            >
                <AIcon class="direction-icon" type="CaretUpOutlined" />
            </div>
            <div
                class="direction-item right"
                @mousedown="emit('onMouseDown', 'RIGHT')"
                @mouseup="emit('onMouseUp', 'RIGHT')"
            >
                <AIcon class="direction-icon" type="CaretRightOutlined" />
            </div>
            <div
                class="direction-item left"
                @mousedown="emit('onMouseDown', 'LEFT')"
                @mouseup="emit('onMouseUp', 'LEFT')"
            >
                <AIcon class="direction-icon" type="CaretLeftOutlined" />
            </div>
            <div
                class="direction-item down"
                @mousedown="emit('onMouseDown', 'DOWN')"
                @mouseup="emit('onMouseUp', 'DOWN')"
            >
                <AIcon class="direction-icon" type="CaretDownOutlined" />
            </div>
            <div class="direction-audio">
                <!-- <AIcon type="AudioOutlined" /> -->
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
