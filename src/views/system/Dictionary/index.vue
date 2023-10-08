<template>
    <page-container>
        <FullPage>
            <div class="dictionary_contain">
                <div class="dictionary_left">
                    <Left @selectData="selectData" />
                </div>
                <div class="dictionary_right">
                    <Right :data="data" />
                </div>
            </div>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import Left from './components/Left/index.vue'
import Right from './components/Right/index.vue'
const data = ref()
const selectData = (i: any) => {
    data.value = i
}
</script>
<style lang="less" scoped>
.dictionary_contain {
    background-color: #fff;
    padding: 24px;
    padding-bottom: 0;
    position: relative;
    height: 100%;
}

.dictionary_left {
    position: absolute;
    border-right: 1px solid #f0f0f0;
    padding-right: 24px;
    width: 310px;
    height: 100%;
}

.dictionary_right {
    margin-left: 317px;
    width: calc(100% - 317px);
}
</style>