<template>
    <page-container>
        <div class="standard-warp">
            <div class="standard-container">
                <div class="left">
                    <LeftTree @change="(id) => (departmentId = id)" />
                </div>
                <div class="right">
                    <Standard :parentId="departmentId" />
                </div>
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Standard">
import LeftTree from './components/LeftTree.vue';
import Standard from './standardTable/index.vue';
const departmentId = ref<string>('');
</script>

<style lang="less" scoped>
.standard-warp {
    background-color: #fff;
    padding: 24px;
    .standard-container {
        position: relative;

        .left {
            position: absolute;
            height: 100%;
            width: 300px;
        }

        .right {
            width: calc(100% - 316px);
            margin-left: 316px;
        }
    }
}
</style>
