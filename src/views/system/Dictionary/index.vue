<template>
    <j-page-container>
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
    </j-page-container>
</template>

<script lang="ts" setup name="Dictionary">
import Left from './components/Left/index.vue'
import Right from './components/Right/index.vue'
const data = ref()
const selectData = (i: any) => {
    data.value = i
}
</script>
<style lang="less" scoped>
.dictionary_contain {
    padding: 24px 24px 0 24px;
    height: 100%;
    display: flex;
}

.dictionary_left {
    border-right: 1px solid #f0f0f0;
    width: 324px;
    height: 100%;
    padding-right: 12px;
}

.dictionary_right {
    margin-left: 12px;
    width: calc(100% - 324px);
    height: 100%;
}
</style>
