<template>
    <page-container>
      <full-page>
        <div class="region">
            <div class="left">
                <LeftTree />
            </div>
            <div class="right">
                <Map :path="path" type="create" />
            </div>
        </div>
      </full-page>
    </page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Map from './MapTool/map.vue'
import FullPage from "components/Layout/FullPage.vue";

const searchValue = ref()
const current = ref<any>({})
const path = ref([[121.5273285, 31.21515044], [121.5293285, 31.21515044], [121.5293285, 31.21915044], [121.5273285, 31.21515044]])

const onSave = () => {

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


        .btn {
            width: 100%;
            margin: 18px 0;
        }
    }
    .right {
        flex: 1;
    }
}
</style>
