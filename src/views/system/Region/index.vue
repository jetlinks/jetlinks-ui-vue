<template>
    <page-container>
      <full-page>
        <div class="region">
            <div class="left">
                <j-input-search
                    v-model:value="searchValue"
                    placeholder="请输入区域名称或行政区划代码"
                    @search="onSearch"
                />
                <j-button @click="onAdd" type="primary" class="btn">新增区域</j-button>
                <LeftTree />
            </div>
            <div class="right">
                <Map :path="path" type="create" />
            </div>
        </div>
      </full-page>
        <Save v-if="visible" :data="current" @save="onSave" @close="onClose" />
    </page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Save from './Save/index.vue'
import Map from './MapTool/map.vue'
import FullPage from "components/Layout/FullPage.vue";

const searchValue = ref()
const visible = ref<boolean>(false)
const current = ref<any>({})
const path = ref([[121.5273285, 31.21515044], [121.5293285, 31.21515044], [121.5293285, 31.21915044], [121.5273285, 31.21515044]])

const onSearch = () => {

}

const onAdd = () => {
    visible.value = true
    current.value = {}
}

const onSave = () => {

}

const onClose = () => {
    visible.value = false
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
