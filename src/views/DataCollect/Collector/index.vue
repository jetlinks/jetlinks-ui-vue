<template>
    <page-container>
        <div class="container">
            <div class="left">
                <Tree @change="changeTree" />
            </div>
            <div class="right">
                <Point v-if="!!data" :data="data" />
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="CollectorPage">
import Tree from './Tree/index.vue';
import Point from './Point/index.vue';

const data = ref();

const changeTree = (row: any) => {
    data.value = row;
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
        margin: 10px;
    }
    .right {
        flex: 1;
        padding: 10px;
    }
}
</style>
