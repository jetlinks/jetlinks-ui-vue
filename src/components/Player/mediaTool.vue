<!-- 视频播放工具栏 -->
<template>
    <div class="live-player-tools">
        <div class="direction">
            <div class="direction-item up">
                <AIcon class="direction-icon" type="CaretUpOutlined" />
            </div>
            <div class="direction-item right">
                <AIcon class="direction-icon" type="CaretRightOutlined" />
            </div>
            <div class="direction-item left">
                <AIcon class="direction-icon" type="CaretLeftOutlined" />
            </div>
            <div class="direction-item down">
                <AIcon class="direction-icon" type="CaretDownOutlined" />
            </div>
            <div class="direction-audio">
                <!-- <AIcon type="AudioOutlined" /> -->
            </div>
        </div>
        <div class="zoom">
            <div class="zoom-item zoom-in">
                <AIcon type="PlusOutlined" />
            </div>
            <div class="zoom-item zoom-out">
                <AIcon type="MinusOutlined" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import './mediaTool.less';
</style>
