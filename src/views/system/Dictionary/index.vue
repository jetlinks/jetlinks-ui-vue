<template>
   <page-container>
        <FullPage>
            <div class="dictionary_contain">
                <div class="dictionary_left">
                    <Left @selectData="selectData"/>
                </div>
                <div class="dictionary_right">
                    <Right :data="data"/>
                </div>
            </div>
        </FullPage>
   </page-container>
</template>

<script lang="ts" setup>
import Left from './components/Left.vue'
import Right from './components/Right/index.vue'
const data = ref()
const selectData = (i:any)=>{
    data.value= i
}
</script>
<style lang="less" scoped>
.dictionary_contain{
    display: flex;
    background-color: #fff;
    padding: 24px;
    height: 100%;
}
.dictionary_left{
    border-right: 1px solid #f0f0f0;
    padding-right: 24px;
    flex:1;
    height:100%
}
.dictionary_right{
    flex:4
}
</style>