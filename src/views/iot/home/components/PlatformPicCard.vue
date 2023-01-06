<template>
    <a-card class="platform-pic-container">
        <div class="title">
            <span>平台架构图</span>
            <p>PLATFORM ARCHITECTURE DIAGRAM</p>
        </div>
        <img src="/images/home/content.png" class="bj" alt="" />
    </a-card>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
:deep(.ant-card-body) {
    padding: 0;
}
.platform-pic-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    min-height: 480px;

    .bj {
        display: block;
        width: 100%;
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
        
        p{
            position: absolute;
            top: 50px;
            width: 100%;
            opacity: .3;
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
