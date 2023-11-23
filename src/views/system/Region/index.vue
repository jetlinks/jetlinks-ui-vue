<template>
    <page-container>
        <full-page>
            <div class="region">
                <div class="left">
                    <LeftTree />
                    <div class="mask" v-if="type === 'edit'"></div>
                </div>
                <div class="right">
                    <Map :path="path" :type="mapType" />
                </div>
            </div>
        </full-page>
    </page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Map from './MapTool/map.vue'
import FullPage from "components/Layout/FullPage.vue";
import { provide } from 'vue'

const path = ref([[121.5273285, 31.21515044], [121.5293285, 31.21515044], [121.5293285, 31.21915044], [121.5273285, 31.21515044]])
const type = ref<'view' | 'edit'>('view')
const mapType = ref<string>('create')

provide('system-region', {
    type,
    mapType: '',
    path
})
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
