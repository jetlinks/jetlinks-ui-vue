<template>
    <div class="container">
        <div class="header"></div>
        <div class="left"></div>
        <div class="content iot-home-container">
            <!-- <InitHome /> -->
            <DeviceHome />
        </div>
    </div>
</template>

<script lang="ts" setup>
import InitHome from './components/InitHome/index.vue';
import DeviceHome from './components/DeviceHome/index.vue';
</script>

<style lang="less" scoped>
.container {
    background: #f0f2f5;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    .header {
        height: 48px;
        background: #7e1c1c;
        width: 100vw;
    }
    .left {
        background: #352d85;
        width: 210px;
        min-height: calc(100vh - 48px);
        
    }
    .content {
        margin: 24px;
        width: calc(100vw - 258px);
        min-height: calc(100vh - 96px);
    }
}
// .iot-home-container {
// }
</style>
