<template>
    <page-container>
      <full-page>
        <div class="region">
            <div class="left">
                <LeftTree />
            </div>
            <div class="right">
                <Map />
            </div>
        </div>
      </full-page>
    </page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Map from './MapTool/map.vue'
import FullPage from "components/Layout/FullPage.vue";
</script>

<style lang="less" scoped>
.region {
    display: flex;
    gap: 24px;
    height: 100%;
    padding: 16px;

    .left {
        width: 300px;
    }
    .right {
        flex: 1;
    }
}
</style>
