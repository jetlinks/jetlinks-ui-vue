<template>
    <div class="notice-info-container">
        <a-tabs :activeKey="'default'">
            <a-tab-pane key="default" tab="未读消息"> 111 </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.notice-info-container {
    width: 336px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 6px 16px -8px rgb(0 0 0 / 8%), 0 9px 28px 0 rgb(0 0 0 / 5%),
        0 12px 48px 16px rgb(0 0 0 / 3%);

    :deep(.ant-tabs-nav-wrap) {
        display: flex;
        justify-content: center;
    }
}
</style>
