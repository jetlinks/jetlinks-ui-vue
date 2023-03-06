<template>
    <page-container>
        <div class="container">
            <div class="left">
                <Tree @change="changeTree" />
            </div>
            <div class="right">right</div>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="CollectorPage">
import Tree from './Tree/index.vue';

const changeTree = (value: any) => {
    console.log(32, value);
};
</script>

<style lang="less" scoped>
.container {
    margin: 0px;
    background: white;
    padding: 14px;
    display: flex;
    min-height: calc(100vh - 180px);
    .left {
        width: 300px;
        border-right: 1px #eeeeee solid;
        // padding: 10px;
        margin: 10px;
    }
    .right {
        padding: 10px;
    }
}
</style>
