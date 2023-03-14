<template>
    <div class="platform-pic-container">
        <div class="title">
            <span>平台架构图</span>
            <p>PLATFORM ARCHITECTURE DIAGRAM</p>
        </div>
        <img
            :src="props.image || '/images/home/content.png'"
            class="bj"
            alt=""
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    image: String,
});
</script>

<style lang="less" scoped>
.platform-pic-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-bottom: 1px solid #2f54eb;
    height: 458px;
    .bj {
        display: block;
        width: 100%;
        height: 100%;
    }

    .title {
        position: absolute;
        width: 100%;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 24px 40px;
        font-weight: 700;
        font-size: 18px;

        p {
            position: absolute;
            top: 50px;
            width: 100%;
            opacity: 0.3;
            font-size: 12px;
        }

        &::before {
            position: absolute;
            top: 50%;
            left: 24px;
            width: 8px;
            height: 8px;
            background-color: #1d39c4;
            border: 1px solid #b4c0da;
            transform: translateY(-50%);
            content: ' ';
        }
    }
}
</style>
