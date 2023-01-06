<template>
    <div class="init-home-container">
        <div class="title">请选择首页视图</div>

        

    </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.init-home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: calc(100vh - 150px);
    padding: 20px;
    background-color: white;

    .title {
        margin-top: 28px;
        margin-bottom: 48px;
        font-weight: 400;
        font-size: 26px;
        text-align: center;
    }
}
</style>
