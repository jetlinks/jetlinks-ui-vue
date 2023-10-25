<template>
    <page-container>
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
                地图
            </div>
        </div>
        <Save v-if="visible" :data="current" @save="onSave" @close="onClose" />
    </page-container>
</template>

<script setup lang="ts" name="RegionMange">
import LeftTree from './LeftTree/index.vue'
import Save from './Save/index.vue'

const searchValue = ref()
const visible = ref<boolean>(false)
const current = ref<any>({})

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
