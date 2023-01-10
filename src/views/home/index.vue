<template>
    <div class="container">
        <div class="header"></div>
        <div class="left"></div>
        <div class="content iot-home-container">
            <!-- <InitHome /> -->
            <!-- <DeviceHome /> -->
            <!-- <DevOpsHome /> -->
            <!-- <ComprehensiveHome /> -->
            <ApiPage />
        </div>
    </div>
</template>

<script lang="ts" setup>
import InitHome from './components/InitHome/index.vue';
import DeviceHome from './components/DeviceHome/index.vue';
import DevOpsHome from './components/DevOpsHome/index.vue';
import ComprehensiveHome from './components/ComprehensiveHome/index.vue';
import ApiPage from '@/views/system/apiPage/index.vue'

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
        width: calc(100vw - 280px);
        overflow: hidden;
        min-height: calc(100vh - 96px);
    }
}
</style>
