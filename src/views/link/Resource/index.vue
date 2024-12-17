<template>
    <page-container>
        <div class="container">
            <FullPage>
                <a-button @click="showInstallModal = true">安装</a-button>
            </FullPage>
        </div>
        <Install v-if="showInstallModal"  @close="showInstallModal = false"/>
    </page-container>
</template>

<script setup>
import Install from './Install/index.vue'
const showInstallModal = ref(false) 
</script>
<style lang='less' scoped>
.container{
    border: 1px solid rgb(230,230,230);
}
</style>