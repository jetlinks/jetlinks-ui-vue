<template>
   <page-container>
        <div class="dictionary_contain">
            <div class="dictionary_left">
                <Left/>
            </div>
            <div class="dictionary_right"></div>
        </div>
   </page-container>
</template>

<script lang="ts" setup>
import Left from './components/Left.vue'
</script>
<style lang="less" scoped>
.dictionary_contain{
    display: flex;
    background-color: #fff;
    padding: 24px;
}
</style>