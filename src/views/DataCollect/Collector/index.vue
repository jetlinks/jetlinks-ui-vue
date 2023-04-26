<template>
    <page-container>
        <div class="container">
            <div class="left">
                <Tree @change="changeTree" />
            </div>
            <div class="right">
                <j-spin :spinning="spinning">
                    <Point v-if="data || data === undefined" :data="data" />
                    <j-empty style="margin-top: 20%" v-else />
                </j-spin>
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="CollectorPage">
import Tree from './Tree/index.vue';
import Point from './Point/index.vue';

const data = ref();
const spinning = ref(false);

const changeTree = (row: any) => {
    spinning.value = true;
    //手动延迟，防止数据库更新不及时
    setTimeout(() => {
        data.value = {
            ...row,
            collectorId: row?.id,
        };
        spinning.value = false;
    }, 1000);
};
</script>

<style lang="less" scoped>
.container {
    margin: 0px;
    background: white;
    padding: 14px;
    display: flex;
    min-height: calc(100vh - 180px);
    width: 100%;
    .left {
        width: 370px;
        border-right: 1px #eeeeee solid;
        margin: 10px 10px 0 0;
    }
    .right {
        flex: 1;
        padding: 10px;
    }
}
</style>
