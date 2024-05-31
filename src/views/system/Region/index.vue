<template>
    <page-container>
        <full-page fixed>
            <div class="region">
                <div class="left">
                    <LeftTree @select="onSelect" />
                </div>
                <div class="right">
                  <Map ref="mapRef" :selectCode="selectCode" />
                </div>
            </div>
        </full-page>
    </page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Map from './MapTool/map.vue'
import FullPage from "@/components/Layout/FullPage.vue";

const selectCode = ref('')

const onSelect = (dt: string) => {
  selectCode.value = dt
}
</script>

<style lang="less" scoped>
.region {
    display: flex;
    gap: 24px;
    height: 100%;
    padding: 16px;

    .left {
        width: 300px;
        position: relative;

        .btn {
            width: 100%;
            margin: 18px 0;
        }

        .mask {
            width: 100%;
            position: absolute;
            height: 100%;
            background-color: lightgray;
            opacity: .5;
            left: 0;
            top: 0;
            z-index: 10;
        }
    }
    .right {
        flex: 1;
    }
}
</style>
